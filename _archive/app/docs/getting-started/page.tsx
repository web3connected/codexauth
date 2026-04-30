'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import QuickSteps from './docs/QuickSteps'
import InstallationDocs from './docs/InstallationDocs'
import KeyConcepts from './docs/KeyConcepts'
import NextStepsSection from './docs/NextStepsSection'

export default function GettingStartedPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-x-hidden">
      {/* Decorative blur elements */}
      <div className="hidden lg:block absolute bottom-0 left-[-6%] w-[250px] h-[300px] bg-hash-primary/30 rounded-full blur-[100px] z-[1]" />
      <div className="hidden lg:block absolute top-[30%] right-[-8%] w-[250px] h-[300px] bg-hash-secondary/30 rounded-full blur-[100px] z-[1]" />

      <div className="container mx-auto px-4 py-12 relative z-[2]">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/docs" className="hover:text-hash-primary transition-colors">Docs</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-hash-primary">Getting Started</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Getting Started with <span className="text-hash-primary">CodexHash</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl">
            Start creating and verifying hash events in minutes. CodexHash provides a REST API for cryptographic hashing with chain integrity verification.
          </p>
        </div>

        <QuickSteps />
        <InstallationDocs />
        <KeyConcepts />
        <NextStepsSection />
      </div>
    </main>
  )
}
