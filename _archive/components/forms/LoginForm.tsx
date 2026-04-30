'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

/**
 * LoginForm Component
 * CodexAuth login form using "secret" terminology
 */
export default function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', secret: '' })
  const [showSecret, setShowSecret] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await login({ email: formData.email, secret: formData.secret })
      router.push('/dashboard')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign in'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border-2 border-red-500 rounded-xl shadow-lg shadow-red-500/20 animate-pulse">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-base font-semibold text-red-400">Authentication Failed</p>
              <p className="text-sm text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label htmlFor="email" className="mb-3 font-medium block text-white">
              Your Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full focus:border-hash-primary bg-transparent border border-slate-700 p-3 xl:p-4 rounded-xl text-white placeholder-slate-500 transition-colors"
            />
          </div>
          <div className="col-span-2 mb-2">
            <label htmlFor="secret" className="mb-3 font-medium block text-white">
              Your Codex Secret*
            </label>
            <div className="w-full focus-within:border-hash-primary bg-transparent relative border border-slate-700 p-3 xl:p-4 rounded-xl mb-3 transition-colors">
              <input
                type={showSecret ? 'text' : 'password'}
                id="secret"
                name="secret"
                value={formData.secret}
                onChange={handleChange}
                placeholder="Enter your secret"
                required
                minLength={8}
                className="w-full bg-transparent text-white placeholder-slate-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="text-xl absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showSecret ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-slate-400">
              Forgot your secret?{' '}
              <Link href="/forgot-password" className="underline font-medium text-hash-primary hover:text-hash-primary/80">
                Reset
              </Link>
            </p>
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="py-3 px-5 w-full rounded-xl text-lg bg-gradient-to-r from-hash-primary to-hash-secondary hover:opacity-90 font-medium text-white mb-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <p className="text-center text-slate-400">
              Don&apos;t have an account yet?{' '}
              <Link href="/register" className="underline text-hash-primary hover:text-hash-primary/80">
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </form>
    </>
  )
}
