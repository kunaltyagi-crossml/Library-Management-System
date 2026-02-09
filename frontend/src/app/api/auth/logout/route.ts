import { NextResponse } from 'next/server';

/**
 * Logout API Route
 * POST /api/auth/logout
 * 
 * This route handles client-side logout by clearing cookies
 * In a real application, you might want to:
 * - Blacklist the JWT token on the backend
 * - Clear server-side session
 * - Log the logout event
 */
export async function POST(request: Request) {
  try {
    // In this implementation, token management is handled client-side
    // You could add server-side token blacklisting here if needed
    
    return NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
