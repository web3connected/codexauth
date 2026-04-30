'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

interface ThemeContextType {
  theme?: string
  setTheme: (theme: string) => void
  resolvedTheme?: string
  codexTheme: string
  setCodexTheme: (theme: string) => void
}

export const ThemeContext = createContext<ThemeContextType>({
  setTheme: () => {},
  codexTheme: 'default',
  setCodexTheme: () => {},
})

const codexThemes = {
  'default': 'Web3 Connected',
  'codex-identity': 'Codex Identity',
  'codex-secure': 'Codex Secure',
  'codex-voice': 'Codex Voice',
  'codex-time': 'Codex Time',
  'codex-mind': 'Codex Mind',
  'universe-factor': 'Universe Factor',
}

export function ThemeProvider({ 
  children,
  ...props 
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [codexTheme, setCodexTheme] = useState('default')

  useEffect(() => {
    // Apply the data-theme attribute to the body
    document.body.setAttribute('data-theme', codexTheme)
  }, [codexTheme])

  const contextValue = {
    codexTheme,
    setCodexTheme,
    setTheme: () => {},
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <NextThemesProvider
        attribute="data-theme"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
        storageKey="codexauth-theme"
        {...props}
      >
        {children}
      </NextThemesProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const useCodexTheme = () => {
  const { codexTheme, setCodexTheme } = useContext(ThemeContext)
  return { codexTheme, setCodexTheme, themes: codexThemes }
}
