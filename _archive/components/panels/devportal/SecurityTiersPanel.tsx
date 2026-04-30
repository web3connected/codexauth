'use client'

import React from 'react'
import Link from 'next/link'

interface Tier {
  name: string
  bitLength: number
  hexLength: number
  badge: string
  description: string
  useCases: string[]
  highlight: boolean
  ctaLabel: string
  ctaHref: string
}

const tiers: Tier[] = [
  {
    name: 'Commercial',
    bitLength: 256,
    hexLength: 64,
    badge: 'Standard',
    description:
      'Performance-optimised hashing for consumer apps, SaaS platforms, and any use case where throughput matters alongside strong security.',
    useCases: [
      'User data integrity',
      'API payload signing',
      'Document fingerprinting',
      'Session verification',
    ],
    highlight: false,
    ctaLabel: 'Get Started',
    ctaHref: '/docs/getting-started',
  },
  {
    name: 'Enterprise',
    bitLength: 512,
    hexLength: 128,
    badge: 'Most Popular',
    description:
      'Double-width output for regulated industries. Built for SOC2, HIPAA, and GDPR compliance where audit trails and data integrity proofs are mandatory.',
    useCases: [
      'Healthcare records',
      'Financial transactions',
      'Legal document chains',
      'Compliance audit logs',
    ],
    highlight: true,
    ctaLabel: 'Start Free Trial',
    ctaHref: '/pricing',
  },
  {
    name: 'Government',
    bitLength: 1024,
    hexLength: 256,
    badge: 'Defense Grade',
    description:
      'Maximum-strength output with Harmonic Lock — a domain-separated layer that cannot be cross-validated against lower tiers. Designed for critical infrastructure.',
    useCases: [
      'Critical infrastructure',
      'Defense systems',
      'National records integrity',
      'Long-term evidence preservation',
    ],
    highlight: false,
    ctaLabel: 'Contact Sales',
    ctaHref: '/support',
  },
]

/**
 * SecurityTiersPanel - Three-tier security model: Commercial, Enterprise, Government.
 * Communicates output size, use case, and compliance positioning.
 */
export default function SecurityTiersPanel() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Three Security Tiers
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Choose the output strength that matches your compliance requirements.
            All tiers run the same CodexHarmonicHash core.
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
          {tiers.map((tier, index) => (
            <TierCard key={index} tier={tier} />
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-slate-600 mt-10">
          All tiers are quantum-resistant and include TIU time-binding and hash chaining.
        </p>
      </div>
    </section>
  )
}

function TierCard({ tier }: { tier: Tier }) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-8 transition-all ${
        tier.highlight
          ? 'border-hash-primary/50 bg-hash-primary/10 shadow-lg shadow-hash-primary/10'
          : 'border-white/10 bg-white/5'
      }`}
    >
      {/* Popular badge */}
      {tier.highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 rounded-full text-xs font-semibold bg-hash-primary text-white shadow-md">
            {tier.badge}
          </span>
        </div>
      )}

      {/* Tier name + badge */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
          {!tier.highlight && (
            <span className="text-xs font-medium text-slate-500 mt-0.5 block">{tier.badge}</span>
          )}
        </div>
        <TierIcon name={tier.name} />
      </div>

      {/* Bit length */}
      <div className="mb-6 p-4 rounded-xl bg-black/20 border border-white/5">
        <div className="text-4xl font-bold text-hash-primary">{tier.bitLength}-bit</div>
        <div className="text-xs text-slate-500 mt-1">{tier.hexLength} hex characters per hash</div>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-sm leading-relaxed mb-6">
        {tier.description}
      </p>

      {/* Use cases */}
      <ul className="space-y-2 mb-8 flex-1">
        {tier.useCases.map((useCase, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
            <svg className="w-4 h-4 text-hash-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {useCase}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href={tier.ctaHref}
        className={`w-full text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all ${
          tier.highlight
            ? 'bg-hash-primary text-white hover:bg-hash-primary/90 hover:shadow-lg hover:shadow-hash-primary/25'
            : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
        }`}
      >
        {tier.ctaLabel}
      </Link>
    </div>
  )
}

function TierIcon({ name }: { name: string }) {
  if (name === 'Commercial') {
    return (
      <div className="p-2 rounded-lg bg-hash-primary/10 border border-hash-primary/20 text-hash-primary">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016 2.993 2.993 0 002.25-1.016 3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
        </svg>
      </div>
    )
  }
  if (name === 'Enterprise') {
    return (
      <div className="p-2 rounded-lg bg-hash-primary/10 border border-hash-primary/20 text-hash-primary">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
      </div>
    )
  }
  // Government
  return (
    <div className="p-2 rounded-lg bg-hash-primary/10 border border-hash-primary/20 text-hash-primary">
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    </div>
  )
}
