import { NextRequest, NextResponse } from 'next/server'

/**
 * CodexAuth Login API Route
 * 
 * Proxies authentication requests to CodexAuth API service.
 * CodexAuth handles quantum hashing via CodexHash and temporal binding.
 */

type LoginRequest = {
  email: string
  password?: string
  secret?: string // Legacy field name support
}

type LoginResponse = {
  success: boolean
  accessToken?: string
  refreshToken?: string
  expiresIn?: number
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

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    const body = await request.json() as LoginRequest
    const { email, password, secret } = body

    // Support both 'password' and 'secret' field names
    const pass = password || secret

    // Validation
    if (!email || !pass) {
      return NextResponse.json({
        success: false,
        message: 'Email and password are required',
      }, { status: 400 })
    }

    // Call CodexAuth API
    const authResponse = await fetch(`${CODEXAUTH_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password: pass }),
    })

    // Check if response is JSON
    const contentType = authResponse.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      console.error('CodexAuth login returned non-JSON response:', authResponse.status)
      return NextResponse.json({
        success: false,
        message: 'Authentication service error',
      }, { status: 500 })
    }

    const data = await authResponse.json()

    if (!authResponse.ok) {
      return NextResponse.json({
        success: false,
        message: data.message || 'Authentication failed',
      }, { status: authResponse.status })
    }

    // Return CodexAuth response
    return NextResponse.json({
      success: true,
      accessToken: data.token || data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      user: data.user,
    })
  } catch (error: unknown) {
    console.error('CodexAuth login error:', error)
    return NextResponse.json({
      success: false,
      message: 'Authentication service unavailable',
    }, { status: 500 })
  }
}
