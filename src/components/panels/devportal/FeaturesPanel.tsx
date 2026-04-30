'use client'

import React from 'react'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  highlight?: string
}

const features: Feature[] = [
  {
    icon: <QuantumIcon />,
    title: 'Quantum Resistant',
    description: 'Built with post-quantum cryptographic algorithms that protect your data against future quantum computing attacks.',
    highlight: 'Future-proof security'
  },
  {
    icon: <SpeedIcon />,
    title: 'Blazing Fast',
    description: 'Sub-10ms hash generation with optimized algorithms that maintain security without sacrificing performance.',
    highlight: '<10ms generation'
  },
  {
    icon: <ShieldIcon />,
    title: 'Enterprise Grade',
    description: 'SOC2 compliant infrastructure with 99.9% uptime SLA, dedicated support, and comprehensive audit logging.',
    highlight: '99.9% SLA'
  },
  {
    icon: <CodeIcon />,
    title: 'Developer First',
    description: 'Intuitive APIs, comprehensive SDKs, detailed documentation, and examples in every major language.',
    highlight: '5+ SDKs'
  },
  {
    icon: <ChainIcon />,
    title: 'Context-Bound Hashing',
    description: 'Include temporal and contextual metadata in your hashes for time-aware verification and audit trails.',
    highlight: 'Time-aware'
  },
  {
    icon: <ScaleIcon />,
    title: 'Infinitely Scalable',
    description: 'Distributed architecture that scales automatically to handle millions of hash operations per second.',
    highlight: '1M+ ops/sec'
  }
]

/**
 * FeaturesPanel - Key features grid with icons and descriptions
 */
export default function FeaturesPanel() {
  return (
    <section className="py-20 lg:py-28 bg-orange-950/40">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why CodexAuth?
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Enterprise-grade quantum-resistant hashing built for the future
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div className="group relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-orange-600/30">
      {/* Icon */}
      <div className="mb-4 p-3 inline-flex rounded-xl bg-orange-900/30 border border-orange-700/30 text-orange-500">
        {feature.icon}
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-orange-500 transition-colors">
        {feature.title}
      </h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        {feature.description}
      </p>

      {/* Highlight Badge */}
      {feature.highlight && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-900/30 text-orange-400 border border-orange-700/30">
          {feature.highlight}
        </span>
      )}

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-600/0 via-orange-600/5 to-orange-600/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  )
}

// Icon Components
function QuantumIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  )
}

function SpeedIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  )
}

function CodeIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  )
}

function ChainIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
  )
}

function ScaleIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
    </svg>
  )
}
