import { NextRequest, NextResponse } from 'next/server'

/**
 * CodexAuth Logout API Route
 * 
 * Invalidates the user's session/token.
 */

type LogoutResponse = {
  success: boolean
  message: string
}

const CODEXAUTH_API_URL = process.env.CODEX_AUTH_API_URL || process.env.NEXT_PUBLIC_CODEX_AUTH_URL || 'http://localhost:8003/api'

export async function POST(request: NextRequest): Promise<NextResponse<LogoutResponse>> {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

    if (token) {
      // Call CodexAuth API to invalidate token
      await fetch(`${CODEXAUTH_API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      }).catch(() => {
        // Ignore errors - we'll clear client-side tokens anyway
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error: unknown) {
    console.error('CodexAuth logout error:', error)
    // Still return success - client will clear tokens
    return NextResponse.json({
      success: true,
      message: 'Logged out',
    })
  }
}
