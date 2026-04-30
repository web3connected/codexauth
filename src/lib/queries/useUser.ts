import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  User,
  LoginCredentials,
  RegisterData,
  LoginResponse,
  RegisterResponse,
  UserResponse,
  LogoutResponse
} from '../services/userService'

const API_BASE = '/api/auth'

// Token storage keys
const TOKEN_KEYS = {
  ACCESS_TOKEN: 'codexauth_access_token',
  REFRESH_TOKEN: 'codexauth_refresh_token',
} as const

/**
 * Get stored access token
 */
function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN)
}

/**
 * Store access token
 */
function setAccessToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, token)
}

/**
 * Store refresh token
 */
function setRefreshToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, token)
}

/**
 * Clear all tokens
 */
function clearTokens(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN)
  localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN)
}

/**
 * Fetch current user from API
 */
async function fetchCurrentUser(): Promise<User | null> {
  const token = getAccessToken()

  if (!token) {
    return null
  }

  try {
    const response = await fetch(`${API_BASE}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        clearTokens()
      }
      return null
    }

    const data: UserResponse = await response.json()
    return data.user || null
  } catch (error) {
    console.error('[fetchCurrentUser] Error:', error)
    return null
  }
}

/**
 * Login user
 */
async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  const data: LoginResponse = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Login failed')
  }

  // Store tokens
  if (data.accessToken) {
    setAccessToken(data.accessToken)
  }
  if (data.refreshToken) {
    setRefreshToken(data.refreshToken)
  }

  return data
}

/**
 * Register user
 */
async function registerUser(userData: RegisterData): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })

  const data: RegisterResponse = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed')
  }

  return data
}

/**
 * Logout user
 */
async function logoutUser(): Promise<LogoutResponse> {
  const token = getAccessToken()

  try {
    const response = await fetch(`${API_BASE}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    })

    const data: LogoutResponse = await response.json()
    clearTokens()
    return data
  } catch {
    clearTokens()
    return { success: true, message: 'Logged out' }
  }
}

// Query Keys
export const userKeys = {
  all: ['user'] as const,
  current: () => [...userKeys.all, 'current'] as const,
}

/**
 * Hook: Get current user
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: userKeys.current(),
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  })
}

/**
 * Hook: Login mutation
 */
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}

/**
 * Hook: Register mutation
 */
export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}

/**
 * Hook: Logout mutation
 */
export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(userKeys.current(), null)
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}
