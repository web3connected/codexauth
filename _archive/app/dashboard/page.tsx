'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

/**
 * Dashboard Page - Developer Portal
 * Protected route - requires authentication
 */
export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [mounted, isLoading, isAuthenticated, router])

  // Loading state
  if (isLoading || !mounted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-hash-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </main>
    )
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-x-hidden">
      {/* Decorative blur elements */}
      <div className="hidden lg:block absolute bottom-0 left-[-6%] w-[250px] h-[300px] bg-hash-primary/30 rounded-full blur-[100px] z-[1]" />
      <div className="hidden lg:block absolute bottom-0 right-[-8%] w-[250px] h-[300px] bg-hash-secondary/30 rounded-full blur-[100px] z-[1]" />

      <div className="container mx-auto px-4 py-12 relative z-[2]">
        {/* Welcome Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {user?.first_name || 'Developer'}!
              </h1>
              <p className="text-slate-400">Manage your CodexHash integration from your dashboard.</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-hash-primary/10 border border-hash-primary/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-hash-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-sm text-slate-400">API Keys</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-hash-secondary/10 border border-hash-secondary/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-hash-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-sm text-slate-400">Hash Operations</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-hash-accent/10 border border-hash-accent/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-hash-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">Free</p>
                <p className="text-sm text-slate-400">Plan</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">Active</p>
                <p className="text-sm text-slate-400">Account Status</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Link href="/docs/getting-started" className="group">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 hover:border-hash-primary/50 rounded-xl p-6 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-hash-primary/10 border border-hash-primary/20 flex items-center justify-center group-hover:bg-hash-primary/20 transition-colors">
                  <svg className="w-6 h-6 text-hash-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1 group-hover:text-hash-primary transition-colors">Documentation</h3>
                  <p className="text-sm text-slate-400">Read the guides and API reference</p>
                </div>
                <svg className="w-5 h-5 text-slate-500 group-hover:text-hash-primary group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="/sdk" className="group">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 hover:border-hash-primary/50 rounded-xl p-6 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-hash-primary/10 border border-hash-primary/20 flex items-center justify-center group-hover:bg-hash-primary/20 transition-colors">
                  <svg className="w-6 h-6 text-hash-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1 group-hover:text-hash-primary transition-colors">Download SDKs</h3>
                  <p className="text-sm text-slate-400">JavaScript, Python, Go, Rust</p>
                </div>
                <svg className="w-5 h-5 text-slate-500 group-hover:text-hash-primary group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="/api-keys" className="group">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 hover:border-hash-primary/50 rounded-xl p-6 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-hash-primary/10 border border-hash-primary/20 flex items-center justify-center group-hover:bg-hash-primary/20 transition-colors">
                  <svg className="w-6 h-6 text-hash-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1 group-hover:text-hash-primary transition-colors">API Keys</h3>
                  <p className="text-sm text-slate-400">Create and manage your keys</p>
                </div>
                <svg className="w-5 h-5 text-slate-500 group-hover:text-hash-primary group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* User Info Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500 mb-1">Email</p>
              <p className="text-white">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Name</p>
              <p className="text-white">{user?.first_name} {user?.last_name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">CodexHash ID</p>
              <p className="text-hash-primary font-mono text-sm">{user?.id ? `#${user.id}` : 'Generating...'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Account Type</p>
              <p className="text-white">Developer</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
