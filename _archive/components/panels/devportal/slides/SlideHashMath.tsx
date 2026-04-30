'use client'

import Image from 'next/image'
import Link from 'next/link'
import bgTime from '@/assets/images/blue-data-stream-abstract-background-future-technology-innovation-concept-389117198.webp'
import type { HeroSlideProps } from './types'

/**
 * Slide 1 — The Mathematics
 * Full ownership: blue data-stream background, algorithm badge, two-column layout.
 */
export default function SlideHashMath({ isActive }: HeroSlideProps) {
  return (
    <div
      className={`absolute inset-0 flex flex-col justify-center transition-opacity duration-700 ${
        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
      }`}
    >
      {/* Background */}
      <Image src={bgTime} alt="" fill className="object-cover object-center" sizes="100vw" />
      <div className="absolute inset-0 bg-black/75" />
      <div className="absolute inset-0 bg-gradient-to-br from-hash-primary/15 via-transparent to-blue-900/15 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-36 pb-28">
        {/* Badge */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-hash-primary/10 border border-hash-primary/30 text-hash-primary text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hash-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-hash-primary" />
            </span>
            CodexHarmonicHash · The Mathematics
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: text */}
        <div>
          <p className="text-xs font-mono text-hash-primary/60 tracking-widest uppercase mb-4">CodexHarmonicHash · Algorithm v2</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="whitespace-nowrap">
              <span className="text-hash-primary">Harmonic</span>
              {' '}
              <span className="text-white">Strength.</span>
            </span>
            <br />
            <span className="whitespace-nowrap text-2xl md:text-3xl lg:text-4xl">
              <span className="text-hash-primary">Mathematically</span>
              {' '}
              <span className="text-hash-accent">different.</span>
            </span>
          </h1>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            CodexHarmonicHash applies HMAC-SHA3-512 as the base, then runs 16 rounds of
            iterative entropy mixing seeded from physics-based constants.
            Each round recombines the prior digest with domain-separated salts —
            making collision attacks exponentially harder with every iteration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/technical-details"
              className="group inline-flex items-center gap-2 px-7 py-4 rounded-lg bg-hash-primary text-white font-semibold transition-all hover:bg-hash-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-hash-primary/25"
            >
              Read the Cryptographic Spec
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link href="/security" className="inline-flex items-center px-7 py-4 rounded-lg border border-white/20 text-white font-semibold transition-all hover:bg-white/5">
              Security Model
            </Link>
          </div>
        </div>

        {/* Right: algorithm stats */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: 'SHA3-512', label: 'Base algorithm', sub: 'NIST post-quantum standard' },
            { value: '16', label: 'Entropy mixing rounds', sub: 'Per hash generation' },
            { value: '65,000×', label: 'More collision-resistant', sub: 'vs SHA-256' },
            { value: '1024-bit', label: 'Max output length', sub: 'Government tier' },
          ].map((s, i) => (
            <div key={i} className="p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="text-2xl font-bold text-hash-primary mb-1 font-mono">{s.value}</div>
              <div className="text-sm text-white font-medium mb-1">{s.label}</div>
              <div className="text-xs text-slate-500">{s.sub}</div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  )
}
