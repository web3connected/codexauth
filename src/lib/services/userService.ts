/**
 * User Service Types and Interfaces
 * TypeScript definitions for authentication and user management
 */

export interface User {
  id: number
  email: string
  name: string
  first_name: string
  last_name: string
  email_verified: boolean
  reg_sites?: string[]
}

export interface LoginCredentials {
  email: string
  password?: string
  secret?: string // Legacy field name support
}

export interface RegisterData {
  first_name: string
  last_name: string
  email: string
  password?: string
  secret?: string // CodexAuth uses "secret" terminology
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface LoginResponse {
  success: boolean
  accessToken?: string
  refreshToken?: string
  expiresIn?: number
  user?: User
  message?: string
}

export interface RegisterResponse {
  success: boolean
  message: string
  user?: {
    id: number
    email: string
    first_name: string
    last_name: string
  }
}

export interface UserResponse {
  success: boolean
  user?: User
  message?: string
}

export interface LogoutResponse {
  success: boolean
  message: string
}
