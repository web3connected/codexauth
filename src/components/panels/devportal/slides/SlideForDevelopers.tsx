'use client'

import Image from 'next/image'
import Link from 'next/link'
import bgChain from '@/assets/images/web3-cyber-sicurezza.webp'
import type { HeroSlideProps } from './types'

/**
 * Slide 2 — Built for Developers
 * Full ownership: security-grid background, dev badge, code-block layout.
 */
export default function SlideForDevelopers({ isActive }: HeroSlideProps) {
  return (
    <div
      className={`absolute inset-0 flex flex-col justify-center transition-opacity duration-700 ${
        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
      }`}
    >
      {/* Background */}
      <Image src={bgChain} alt="" fill className="object-cover object-center" sizes="100vw" />
      <div className="absolute inset-0 bg-black/78" />
      <div className="absolute inset-0 bg-gradient-to-tl from-auth-secondary/15 via-transparent to-auth-primary/10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-36 pb-28">
        {/* Badge */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            Built for Developers
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
        {/* Headline */}
        <div className="mb-8">
          <p className="text-xs font-mono text-auth-primary/60 tracking-widest uppercase mb-4">REST API · SDKs · Webhooks</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="text-white">One endpoint.</span>
            <br />
            <span className="whitespace-nowrap">
              <span className="text-auth-secondary">Production-ready</span>
              {' '}
              <span className="text-auth-primary">in minutes.</span>
            </span>
          </h1>
        </div>

        {/* Quickstart code block */}
        <div className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-sm overflow-hidden mb-8">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10 bg-white/5">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-3 text-xs font-mono text-slate-500">quickstart.sh</span>
          </div>
          <div className="p-6 font-mono text-sm leading-relaxed">
            <div className="text-slate-500"># Hash any payload — returns tamper-evident event hash</div>
            <div className="mt-3">
              <span className="text-green-400">curl</span>
              <span className="text-slate-300"> -X POST https://codexauth.web3connected.com/api/hash/ \</span>
            </div>
            <div className="ml-6 text-slate-300">
              <span className="text-yellow-400">-H</span>
              <span className="text-slate-300"> </span>
              <span className="text-blue-300">&quot;Content-Type: application/json&quot;</span>
              <span className="text-slate-300"> \</span>
            </div>
            <div className="ml-6">
              <span className="text-yellow-400">-d</span>
              <span className="text-slate-300"> </span>
              <span className="text-blue-300">&apos;&#123;&quot;data&quot;: &quot;my-document-v1&quot;, &quot;algorithm&quot;: &quot;harmonic&quot;&#125;&apos;</span>
            </div>
            <div className="mt-4 text-slate-500"># → event_hash bound to current TIU · chained to previous event</div>
          </div>
        </div>

        {/* CTAs + dev feature strip */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/docs/getting-started"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-auth-primary text-white font-semibold transition-all hover:bg-auth-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-auth-primary/25"
            >
              Start Building
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link href="/sdk" className="inline-flex items-center px-7 py-3.5 rounded-lg border border-white/20 text-white font-semibold transition-all hover:bg-white/5">
              View SDKs
            </Link>
          </div>

          <div className="flex gap-8">
            {[
              { value: 'REST', label: 'JSON API' },
              { value: 'JS / PY', label: 'Native SDKs' },
              { value: '<50ms', label: 'p99 latency' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-auth-primary font-mono">{s.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
