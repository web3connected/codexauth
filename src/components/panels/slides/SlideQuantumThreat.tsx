'use client'

import Image from 'next/image'
import Link from 'next/link'
import bgQuantum from '@/assets/images/quantum-computing-render-gtc25s-silverfix2.png'
import type { HeroSlideProps } from './types'

/**
 * Slide 0 — The Quantum Threat
 * Full ownership: red-toned background, threat badge, centered layout with broken-algo pills.
 */
export default function SlideQuantumThreat({ isActive }: HeroSlideProps) {
  return (
    <div
      className={`absolute inset-0 flex flex-col justify-center transition-opacity duration-700 ${
        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
      }`}
    >
      {/* Background */}
      <Image src={bgQuantum} alt="" fill priority className="object-cover object-center" sizes="100vw" />
      <div className="absolute inset-0 bg-black/75" />
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-auth-primary/10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-36 pb-28">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
            </span>
            The Quantum Threat Is Real
          </div>
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-mono text-red-400/80 tracking-widest uppercase mb-4">Security Advisory · 2026</p>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="whitespace-nowrap">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-red-500">Quantum</span>
            {' '}
            <span className="text-white">Computers</span>
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-auth-accent to-red-800 w-fit mx-auto">
            SHA-256 Future Threat.
          </span>
        </h1>
        <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Shor&apos;s and Grover&apos;s algorithms reduce SHA-256 to effectively 128-bit security against a quantum adversary.
          MD5 and bcrypt are already compromised. The algorithms your stack relies on were not designed for this threat model.
          CodexAuth was.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/security"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-auth-primary text-white font-semibold transition-all hover:bg-auth-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-auth-primary/25"
          >
            See the Threat Model
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/docs/getting-started"
            className="inline-flex items-center px-8 py-4 rounded-lg border border-white/20 text-white font-semibold transition-all hover:bg-white/5"
          >
            Get Protected
          </Link>
        </div>

        {/* Broken algorithm callouts */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {[
            { algo: 'SHA-256', status: 'Grover-vulnerable', color: 'border-red-500/40 text-red-400' },
            { algo: 'MD5', status: 'Quantum-broken', color: 'border-red-500/60 text-red-300 bg-red-500/5' },
            { algo: 'bcrypt', status: 'Collision-exposed', color: 'border-red-500/40 text-red-400' },
          ].map((a) => (
            <div key={a.algo} className={`flex items-center gap-3 px-5 py-2.5 rounded-full border ${a.color}`}>
              <span className="font-mono font-semibold text-sm">{a.algo}</span>
              <span className="text-xs opacity-70">{a.status}</span>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  )
}
