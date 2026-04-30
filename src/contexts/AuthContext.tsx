'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useCurrentUser, useLogin, useLogout, useRegister } from '@/lib/queries/useUser'
import type { User, LoginCredentials, RegisterData } from '@/lib/services/userService'

/**
 * Auth Context Interface
 */
interface AuthContextType {
  user: User | null | undefined
  isLoading: boolean
  isAuthenticated: boolean
  isError: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
}

/**
 * Auth Context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Auth Provider Props
 */
interface AuthProviderProps {
  children: ReactNode
}

/**
 * Auth Provider Component
 * Wraps the app and provides authentication state and methods
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Queries and mutations
  const { data: user, isLoading, isError, refetch } = useCurrentUser()
  const loginMutation = useLogin()
  const registerMutation = useRegister()
  const logoutMutation = useLogout()

  // Derived state - user existence indicates authentication
  const isAuthenticated = !!user

  /**
   * Login handler
   */
  const handleLogin = async (credentials: LoginCredentials) => {
    await loginMutation.mutateAsync(credentials)
    await refetch() // Refetch user data after login
  }

  /**
   * Register handler
   */
  const handleRegister = async (data: RegisterData) => {
    await registerMutation.mutateAsync(data)
    await refetch() // Refetch user data after registration
  }

  /**
   * Logout handler
   */
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }

  const value: AuthContextType = {
    user: user ?? null,
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
    isAuthenticated,
    isError,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * useAuth Hook
 * Custom hook to use the auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
