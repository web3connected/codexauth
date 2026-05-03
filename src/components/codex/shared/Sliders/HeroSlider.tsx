'use client';

import React, { useState, useEffect } from 'react';

export interface HeroSlide {
  id: string | number;
  title: string;
  subtitle?: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  /** Tailwind gradient classes e.g. 'from-cyan-600/20 via-blue-600/20 to-purple-600/20' */
  gradient?: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
  autoPlayInterval?: number;
}

const HERO_SLIDER_STYLES = `
  @keyframes heroFadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes heroMoveGrid {
    0%   { transform: translate(0, 0); }
    100% { transform: translate(50px, 50px); }
  }
  .hero-slider-fadein {
    animation: heroFadeInUp 0.8s ease-out forwards;
    opacity: 0;
  }
  .hero-slider-grid {
    background-image: linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: heroMoveGrid 20s linear infinite;
  }
`;

export default function HeroSlider({ slides, autoPlayInterval = 5000 }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length, autoPlayInterval]);

  const goToSlide = (index: number) => { setCurrentSlide(index); setIsAutoPlaying(false); };
  const nextSlide = () => { setCurrentSlide((prev) => (prev + 1) % slides.length); setIsAutoPlaying(false); };
  const prevSlide = () => { setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length); setIsAutoPlaying(false); };

  if (slides.length === 0) return null;

  const slide = slides[currentSlide];

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#0a0f1e]">
      <style>{HERO_SLIDER_STYLES}</style>

      {/* Background image */}
      {slide.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${slide.backgroundImage})`, opacity: 0.3 }}
        />
      )}

      {/* Gradient overlay */}
      {slide.gradient && (
        <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-all duration-1000`} />
      )}

      {/* Animated grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 hero-slider-grid" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1
            key={`title-${slide.id}`}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight hero-slider-fadein"
          >
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {slide.title}
            </span>
          </h1>

          {slide.subtitle && (
            <h2
              key={`subtitle-${slide.id}`}
              className="text-2xl md:text-4xl font-semibold text-yellow-400 mb-8 hero-slider-fadein"
              style={{ animationDelay: '0.2s' }}
            >
              {slide.subtitle}
            </h2>
          )}

          <p
            key={`desc-${slide.id}`}
            className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed hero-slider-fadein"
            style={{ animationDelay: '0.4s' }}
          >
            {slide.description}
          </p>

          {slide.ctaText && slide.ctaLink && (
            <div
              key={`cta-${slide.id}`}
              className="hero-slider-fadein"
              style={{ animationDelay: '0.6s' }}
            >
              <a
                href={slide.ctaLink}
                className="inline-flex items-center px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-600/50"
              >
                {slide.ctaText}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Prev arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 text-white transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 group"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 text-white transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'w-12 h-3 bg-cyan-400'
                : 'w-3 h-3 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play toggle */}
      <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute bottom-8 right-8 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300"
        aria-label={isAutoPlaying ? 'Pause auto-play' : 'Resume auto-play'}
      >
        {isAutoPlaying ? (
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </section>
  );
}
