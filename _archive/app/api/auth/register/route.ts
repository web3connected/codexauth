import { NextRequest, NextResponse } from 'next/server'

/**
 * CodexAuth Register API Route
 * 
 * Proxies registration requests to CodexAuth API service.
 * Creates user with CodexHash quantum-resistant password hashing.
 */

type RegisterRequest = {
  first_name: string
  last_name: string
  email: string
  password?: string
  secret?: string // CodexAuth terminology
}

type RegisterResponse = {
  success: boolean
  message: string
  user?: {
    id: number
    email: string
    first_name: string
    last_name: string
  }
}

const CODEXAUTH_API_URL = process.env.CODEX_AUTH_API_URL || process.env.NEXT_PUBLIC_CODEX_AUTH_URL || 'http://localhost:8003/api'

export async function POST(request: NextRequest): Promise<NextResponse<RegisterResponse>> {
  try {
    const body = await request.json() as RegisterRequest
    const { first_name, last_name, email, password, secret } = body

    // Support both 'password' and 'secret' field names
    const pass = password || secret

    // Validation
    if (!first_name || !last_name || !email || !pass) {
      return NextResponse.json({
        success: false,
        message: 'All fields are required',
      }, { status: 400 })
    }

    if (pass.length < 8) {
      return NextResponse.json({
        success: false,
        message: 'Password must be at least 8 characters',
      }, { status: 400 })
    }

    // Call CodexAuth API
    const authResponse = await fetch(`${CODEXAUTH_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        first_name,
        last_name,
        email,
        password: pass,
      }),
    })

    // Check if response is JSON
    const contentType = authResponse.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      console.error('CodexAuth register returned non-JSON response:', authResponse.status)
      return NextResponse.json({
        success: false,
        message: 'Registration service error',
      }, { status: 500 })
    }

    const data = await authResponse.json()

    if (!authResponse.ok) {
      return NextResponse.json({
        success: false,
        message: data.message || 'Registration failed',
      }, { status: authResponse.status })
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: data.user,
    })
  } catch (error: unknown) {
    console.error('CodexAuth register error:', error)
    return NextResponse.json({
      success: false,
      message: 'Registration service unavailable',
    }, { status: 500 })
  }
}
