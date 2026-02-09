import { NextResponse } from 'next/server';

/**
 * Health Check API Route
 * GET /api/health
 * 
 * Simple health check endpoint to verify the application is running
 * Can be used by monitoring tools, load balancers, etc.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'Library Management Frontend',
      version: '1.0.0',
    },
    { status: 200 }
  );
}
