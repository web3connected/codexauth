'use client'

import React, { useState, useEffect, useCallback } from 'react'
import SlideQuantumThreat from './slides/SlideQuantumThreat'
import SlideHashMath from './slides/SlideHashMath'
import SlideForDevelopers from './slides/SlideForDevelopers'

// ─────────────────────────────────────────────
// Slide registry — each component owns its own full design.
// To add a slide: create a file in ./slides/ and append it here.
// ─────────────────────────────────────────────
const AUTOPLAY_MS = 6000

const SLIDES = [SlideQuantumThreat, SlideHashMath, SlideForDevelopers]

export default function DevPortalHero() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [animating, setAnimating] = useState(false)

  const go = useCallback(
    (next: number) => {
      if (animating) return
      setAnimating(true)
      setCurrent((next + SLIDES.length) % SLIDES.length)
      setTimeout(() => setAnimating(false), 400)
    },
    [animating]
  )

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => go(current + 1), AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [current, paused, go])

  return (
    <section
      className="relative overflow-hidden min-h-screen"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* All slides stacked — each manages its own visibility, bg, badge, layout */}
      {SLIDES.map((Slide, i) => (
        <Slide key={i} isActive={i === current} paused={paused} autoplayMs={AUTOPLAY_MS} />
      ))}

      {/* Progress bar — global chrome */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/5 z-20">
        <div
          key={current}
          className="h-full bg-auth-primary"
          style={{ animation: paused ? 'none' : `progress ${AUTOPLAY_MS}ms linear forwards` }}
        />
      </div>

      {/* Nav controls — overlaid above all slides */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex items-center justify-center gap-6">
        <button
          onClick={() => go(current - 1)}
          aria-label="Previous slide"
          className="p-2 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-8 h-2 bg-auth-primary' : 'w-2 h-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => go(current + 1)}
          aria-label="Next slide"
          className="p-2 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes progress { from { width: 0% } to { width: 100% } }
      `}</style>
    </section>
  )
}



