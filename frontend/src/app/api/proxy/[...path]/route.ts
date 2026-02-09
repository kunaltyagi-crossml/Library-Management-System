import { NextRequest, NextResponse } from 'next/server';

/**
 * API Proxy Route
 * ALL /api/proxy/*
 * 
 * This route acts as a proxy to the Django backend
 * Useful for:
 * - Avoiding CORS issues in development
 * - Hiding backend URL from client
 * - Adding server-side middleware/logging
 * 
 * Example usage:
 * Frontend: fetch('/api/proxy/books/')
 * Proxies to: http://localhost:8000/api/books/
 */

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000/api';

export async function GET(request: NextRequest) {
  return proxyRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request, 'PUT');
}

export async function PATCH(request: NextRequest) {
  return proxyRequest(request, 'PATCH');
}

export async function DELETE(request: NextRequest) {
  return proxyRequest(request, 'DELETE');
}

async function proxyRequest(request: NextRequest, method: string) {
  try {
    // Extract the path after /api/proxy/
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/api/proxy/');
    const backendPath = pathSegments[1] || '';
    
    // Build the backend URL
    const backendUrl = `${BACKEND_URL}/${backendPath}${url.search}`;
    
    // Prepare headers
    const headers: HeadersInit = {};
    
    // Forward authorization header if present
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    // Forward content-type for POST/PUT/PATCH
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const contentType = request.headers.get('content-type');
      if (contentType) {
        headers['Content-Type'] = contentType;
      }
    }
    
    // Prepare request options
    const options: RequestInit = {
      method,
      headers,
    };
    
    // Add body for POST/PUT/PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const body = await request.text();
      if (body) {
        options.body = body;
      }
    }
    
    // Make the request to the backend
    const response = await fetch(backendUrl, options);
    
    // Get response data
    const data = await response.text();
    
    // Forward the response
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
      },
    });
    
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Proxy request failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
