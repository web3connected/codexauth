import { NextRequest, NextResponse } from 'next/server'

/**
 * CodexAuth User API Route
 * 
 * Returns the current authenticated user's information.
 */

type UserResponse = {
  success: boolean
  user?: {
    id: number
    email: string
    name: string
    first_name: string
    last_name: string
    email_verified: boolean
  }
  message?: string
}

const CODEXAUTH_API_URL = process.env.CODEX_AUTH_API_URL || process.env.NEXT_PUBLIC_CODEX_AUTH_URL || 'http://localhost:8003/api'

export async function GET(request: NextRequest): Promise<NextResponse<UserResponse>> {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'Not authenticated',
      }, { status: 401 })
    }

    const token = authHeader.substring(7) // Remove "Bearer " prefix

    // Call CodexAuth API to validate token and get user
    const authResponse = await fetch(`${CODEXAUTH_API_URL}/auth/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    })

    if (!authResponse.ok) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired token',
      }, { status: 401 })
    }

    const data = await authResponse.json()

    return NextResponse.json({
      success: true,
      user: data.user || data,
    })
  } catch (error: unknown) {
    console.error('CodexAuth user fetch error:', error)
    return NextResponse.json({
      success: false,
      message: 'Authentication service unavailable',
    }, { status: 500 })
  }
}
