'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

const PageLoader: React.FC<{ message?: string }> = ({ message = 'Loading…' }) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm">
    <div className="w-10 h-10 rounded-full border-4 border-auth-primary border-t-transparent animate-spin mb-4" />
    <p className="text-sm text-slate-300">{message}</p>
  </div>
)

interface LoadingContextType {
  isLoading: boolean
  setLoading: (loading: boolean) => void
  showLoader: (message?: string) => void
  hideLoader: () => void
  message: string
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

interface LoadingProviderProps {
  children: React.ReactNode
  initialLoading?: boolean
  initialMessage?: string
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ 
  children, 
  initialLoading = false,
  initialMessage = "Initializing Web3 Codex..."
}) => {
  const [isLoading, setIsLoading] = useState(initialLoading)
  const [message, setMessage] = useState(initialMessage)

  // Auto-hide initial loader after 2 seconds
  useEffect(() => {
    if (initialLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [initialLoading])

  const setLoading = (loading: boolean) => {
    setIsLoading(loading)
  }

  const showLoader = (newMessage?: string) => {
    if (newMessage) {
      setMessage(newMessage)
    }
    setIsLoading(true)
  }

  const hideLoader = () => {
    setIsLoading(false)
  }

  const value = {
    isLoading,
    setLoading,
    showLoader,
    hideLoader,
    message
  }

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isLoading && <PageLoader message={message} />}
    </LoadingContext.Provider>
  )
}
