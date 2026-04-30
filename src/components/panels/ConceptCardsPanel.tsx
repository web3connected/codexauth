'use client'

import React from 'react'
import BgMosaic from '@/assets/images/abstract-design-shape-pattern-background-vibrant-blue-texture-and-geometric-mosaic_9969503.webp'

interface ConceptCard {
  icon: React.ReactNode
  title: string
  tagline: string
  description: string
  stat: string
  statLabel: string
  accentColor: string
}

const conceptCards: ConceptCard[] = [
  {
    icon: <QuantumIcon />,
    title: 'Quantum Resistant',
    tagline: 'HMAC-SHA3-512 · 16 entropy rounds',
    description:
      'CodexHarmonicHash uses physics-based entropy mixing across 16 iterative rounds on top of SHA3-512. The result is a hash that cannot be reversed or collision-forged — even by quantum computers.',
    stat: '65,000×',
    statLabel: 'more collision-resistant than SHA-256',
    accentColor: 'auth-primary',
  },
  {
    icon: <ClockIcon />,
    title: 'Time-Bound',
    tagline: 'TIU temporal anchor · replay-proof',
    description:
      'Every hash embeds a TIU (Time Interval Unit) from CodexTime. The hash changes as time progresses — so a hash from five minutes ago will not validate now. Backdating and replay attacks are mathematically impossible.',
    stat: 'Zero',
    statLabel: 'valid replays from past TIU windows',
    accentColor: 'auth-accent',
  },
  {
    icon: <ChainIcon />,
    title: 'Chain Verified',
    tagline: 'Tamper-evident event chains',
    description:
      'Each event links to the previous via a chained formula: SHA256(payload + prev_hash + context). Alter any single event and every downstream hash breaks instantly — no blockchain, no consensus required.',
    stat: '1 bit',
    statLabel: 'of change detected across entire chain',
    accentColor: 'auth-secondary',
  },
]

/**
 * ConceptCardsPanel - Three core concept cards explaining what makes CodexAuth unique.
 * Sits below the hero to communicate product identity at a glance.
 */
export default function ConceptCardsPanel() {
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      {/* Background mosaic image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BgMosaic.src}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
        aria-hidden="true"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/55 via-slate-900/45 to-slate-900/55" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {conceptCards.map((card, index) => (
            <ConceptCard key={index} card={card} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ConceptCard({ card }: { card: ConceptCard }) {
  return (
    <div className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 transition-all hover:bg-white/10 hover:border-auth-primary/30">
      {/* Top accent line */}
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-auth-primary/40 to-transparent" />

      {/* Icon */}
      <div className="mb-6 p-4 inline-flex rounded-2xl bg-auth-primary/10 border border-auth-primary/20 text-auth-primary w-fit">
        {card.icon}
      </div>

      {/* Title + Tagline */}
      <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-auth-primary transition-colors">
        {card.title}
      </h3>
      <p className="text-xs font-mono text-auth-primary/70 mb-4 tracking-wide uppercase">
        {card.tagline}
      </p>

      {/* Description */}
      <p className="text-slate-400 text-sm leading-relaxed flex-1">
        {card.description}
      </p>

      {/* Stat */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <span className="text-3xl font-bold text-auth-primary">{card.stat}</span>
        <p className="text-xs text-slate-500 mt-1">{card.statLabel}</p>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-auth-primary/0 via-auth-primary/3 to-auth-primary/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  )
}

// Icon Components

function QuantumIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636" />
      <circle cx="12" cy="12" r="3.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ChainIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
  )
}
