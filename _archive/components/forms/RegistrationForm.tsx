'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

/**
 * RegistrationForm Component
 * CodexAuth registration form using "secret" terminology
 */
export default function RegistrationForm() {
  const router = useRouter()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    secret: '',
    confirmSecret: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const [showConfirmSecret, setShowConfirmSecret] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.secret !== formData.confirmSecret) {
      setError('Secrets do not match')
      return
    }

    if (formData.secret.length < 8) {
      setError('Secret must be at least 8 characters long')
      return
    }

    setLoading(true)

    try {
      await register({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        secret: formData.secret,
      })

      // Redirect to dashboard or onboarding
      router.push('/dashboard')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <>
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block mb-3 font-medium text-slate-300">
              First Name*
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
              className="w-full p-3 xl:p-4 bg-transparent border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-hash-primary transition-colors"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block mb-3 font-medium text-slate-300">
              Last Name*
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
              className="w-full p-3 xl:p-4 bg-transparent border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-hash-primary transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block mb-3 font-medium text-slate-300">
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
            className="w-full p-3 xl:p-4 bg-transparent border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-hash-primary transition-colors"
          />
        </div>

        <div>
          <label htmlFor="secret" className="block mb-3 font-medium text-slate-300">
            Your Codex Secret*
          </label>
          <div className="relative mb-3">
            <input
              type={showSecret ? 'text' : 'password'}
              id="secret"
              name="secret"
              value={formData.secret}
              onChange={handleChange}
              placeholder="Create your secret"
              required
              className="w-full p-3 xl:p-4 bg-transparent border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-hash-primary transition-colors pr-12"
            />
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
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

          <div className="relative">
            <input
              type={showConfirmSecret ? 'text' : 'password'}
              id="confirmSecret"
              name="confirmSecret"
              value={formData.confirmSecret}
              onChange={handleChange}
              placeholder="Confirm your secret"
              required
              className="w-full p-3 xl:p-4 bg-transparent border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-hash-primary transition-colors pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirmSecret(!showConfirmSecret)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
            >
              {showConfirmSecret ? (
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
          <p className="mt-2 text-xs text-slate-500">
            Secret must be at least 8 characters long
          </p>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="py-3 px-5 w-full rounded-xl text-lg bg-gradient-to-r from-hash-primary to-hash-secondary hover:opacity-90 font-medium text-white mb-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          <p className="text-center text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="underline text-hash-primary hover:text-hash-primary/80">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </>
  )
}
