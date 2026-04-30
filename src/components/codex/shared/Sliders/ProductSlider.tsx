"use client";

import React from 'react';
import { ProductSlide } from './types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Add keyframe animation for pulse
const pulseKeyframes = `
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

// Generate a tiny placeholder SVG data-uri when an image fails to load.
const makePlaceholderDataUri = (label = 'image') => {
  const bg = '#0f172a';
  const fg = '#ffffff';
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'>
    <rect width='100%' height='100%' fill='${bg}' />
    <text x='50%' y='50%' font-family='Inter, Arial, sans-serif' font-size='36' fill='${fg}' text-anchor='middle' dominant-baseline='middle'>${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// ProductSlide type is defined in ./types.ts and imported above

interface ProductSliderProps {
  /**
   * Array of product slides to display
   */
  slides: ProductSlide[];
  
  /**
   * Enable autoplay (default: true)
   */
  autoplay?: boolean;
  
  /**
   * Autoplay delay in milliseconds (default: 5000)
   */
  autoplayDelay?: number;
  
  /**
   * Show navigation arrows (default: true)
   */
  showNavigation?: boolean;
  
  /**
   * Show pagination dots (default: true)
   */
  showPagination?: boolean;
  
  /**
   * Enable fade effect (default: false, uses slide)
   */
  useFadeEffect?: boolean;
  
  /**
   * Height of the slider (default: '500px')
   */
  height?: string;
  
  /**
   * Callback when CTA button is clicked
   */
  onCtaClick?: (slide: ProductSlide) => void;
  
  /**
   * Additional className
   */
  className?: string;
}

export const ProductSlider: React.FC<ProductSliderProps> = ({
  slides,
  autoplay = true,
  autoplayDelay = 5000,
  showNavigation = true,
  showPagination = true,
  useFadeEffect = false,
  height = '500px',
  onCtaClick,
  className = '',
}) => {
  const handleCtaClick = (slide: ProductSlide) => {
    if (onCtaClick) {
      onCtaClick(slide);
    } else if (slide.ctaLink) {
      window.location.href = slide.ctaLink;
    }
  };

  // Render a slide with completely different Bootstrap-style grid structures
  const renderSlideContent = (slide: ProductSlide) => {
    switch (slide.layout) {
      case 'split-right':
        // LAYOUT 1: Classic 2-Column Grid (Content | Image) - 1fr 1fr
        // Square badges, left-aligned, sharp buttons - Professional corporate feel
        return (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '2rem', 
            alignItems: 'center',
            width: '100%', 
            height: '100%',
            padding: '2rem 3rem'
          }}>
            {/* Content Column */}
            <div>
              {slide.tag && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <span style={{ 
                    display: 'inline-block', 
                    padding: '0.5rem 1rem', 
                    borderRadius: '0.25rem', // Sharp square corners
                    fontSize: '0.75rem', 
                    fontWeight: 600, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.1em', 
                    backgroundColor: slide.tagColor || '#3b82f6', 
                    color: '#ffffff'
                  }}>
                    {slide.tag}
                  </span>
                </div>
              )}
              <h2 style={{ 
                fontSize: 'clamp(2rem, 3vw, 3.5rem)', 
                fontWeight: 700, 
                marginBottom: '1.5rem', 
                lineHeight: 1.2, 
                textAlign: 'left',
                color: slide.textColor || '#ffffff'
              }}>
                {slide.title}
              </h2>
              <p style={{ 
                fontSize: 'clamp(1rem, 1.25vw, 1.25rem)', 
                marginBottom: '2rem', 
                lineHeight: 1.7, 
                fontWeight: 400, 
                textAlign: 'left',
                color: 'rgba(255,255,255,0.85)'
              }}>
                {slide.description}
              </p>
              {slide.ctaText && (
                <button onClick={() => handleCtaClick(slide)} style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  padding: '0.875rem 2rem', 
                  backgroundColor: '#ffffff', 
                  color: '#111827', 
                  fontWeight: 700, 
                  fontSize: '1rem', 
                  borderRadius: '0.375rem', // Sharp corners
                  border: 'none', 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  {slide.ctaText}
                  <svg style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              )}
            </div>

            {/* Image Column */}
            <div style={{ height: '100%', minHeight: '400px' }}>
              {slide.image && (
                <img
                  src={slide.image}
                  alt={slide.imageAlt || slide.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.5rem' }}
                  onError={(e) => {
                    const t = e.currentTarget as HTMLImageElement;
                    t.onerror = null;
                    t.src = makePlaceholderDataUri(slide.title || 'image');
                  }}
                />
              )}
            </div>
          </div>
        );

      case 'split-left':
        // LAYOUT 2: Asymmetric 3-Column Grid (Image | Content | Sidebar) - 2fr 2.25fr 0.75fr
        // Ribbon banners, centered content, round pill buttons - Modern magazine feel
        return (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '2fr 2.25fr 0.75fr', 
            gap: '1.5rem', 
            alignItems: 'center',
            width: '100%', 
            height: '100%',
            padding: '2rem 3rem'
          }}>
            {/* Image Column */}
            <div style={{ height: '100%', minHeight: '400px' }}>
              {slide.image && (
                <img
                  src={slide.image}
                  alt={slide.imageAlt || slide.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.75rem' }}
                  onError={(e) => {
                    const t = e.currentTarget as HTMLImageElement;
                    t.onerror = null;
                    t.src = makePlaceholderDataUri(slide.title || 'image');
                  }}
                />
              )}
            </div>

            {/* Content Column (Middle) */}
            <div style={{ textAlign: 'center' }}>
              {slide.tag && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <span style={{ 
                    display: 'inline-block', 
                    padding: '0.625rem 1.75rem', 
                    transform: 'skewX(-10deg)', // Ribbon effect
                    fontSize: '0.875rem', 
                    fontWeight: 700, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em', 
                    backgroundColor: slide.tagColor || '#3b82f6', 
                    color: '#ffffff'
                  }}>
                    <span style={{ display: 'inline-block', transform: 'skewX(10deg)' }}>{slide.tag}</span>
                  </span>
                </div>
              )}
              <h2 style={{ 
                fontSize: 'clamp(1.875rem, 2.75vw, 3rem)', 
                fontWeight: 700, 
                marginBottom: '1.25rem', 
                lineHeight: 1.25, 
                textAlign: 'center',
                color: slide.textColor || '#ffffff'
              }}>
                {slide.title}
              </h2>
              <p style={{ 
                fontSize: 'clamp(0.95rem, 1.15vw, 1.15rem)', 
                marginBottom: '2rem', 
                lineHeight: 1.65, 
                fontWeight: 400, 
                textAlign: 'center',
                color: 'rgba(255,255,255,0.85)'
              }}>
                {slide.description}
              </p>
              {slide.ctaText && (
                <button onClick={() => handleCtaClick(slide)} style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  padding: '0.875rem 2.25rem', 
                  backgroundColor: slide.tagColor || '#3b82f6', 
                  color: '#ffffff', 
                  fontWeight: 600, 
                  fontSize: '1rem', 
                  borderRadius: '9999px', // Full round pill
                  border: 'none', 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  {slide.ctaText}
                  <svg style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              )}
            </div>

            {/* Sidebar Column */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {Array.isArray((slide as any).stats) && (slide as any).stats.slice(0, 2).map((s: any, idx: number) => (
                <div key={idx} style={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  padding: '1rem', 
                  borderRadius: '0.5rem',
                  textAlign: 'center',
                  width: '100%'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: slide.textColor || '#ffffff' }}>{s.value}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'overlay':
        // LAYOUT 3: Stacked Row Grid (Title Bar + Full Image + Bottom CTA) - auto 1fr auto rows
        // Top bar design, large dramatic titles, full-width CTA bar - Cinematic hero feel
        return (
          <div style={{ 
            display: 'grid', 
            gridTemplateRows: 'auto 1fr auto', 
            width: '100%', 
            height: '100%',
            position: 'relative'
          }}>
            {/* Background Image */}
            {slide.image && (
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                zIndex: 0 
              }}>
                <img
                  src={slide.image}
                  alt={slide.imageAlt || slide.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    const t = e.currentTarget as HTMLImageElement;
                    t.onerror = null;
                    t.src = makePlaceholderDataUri(slide.title || 'image');
                  }}
                />
                <div style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4), rgba(0,0,0,0.7))' 
                }} />
              </div>
            )}

            {/* Top Title Bar */}
            <div style={{ 
              position: 'relative', 
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '2rem 3rem',
              background: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(10px)'
            }}>
              {slide.tag && (
                <span style={{ 
                  display: 'inline-block', 
                  padding: '0.5rem 1.25rem', 
                  borderRadius: '9999px', 
                  fontSize: '0.875rem', 
                  fontWeight: 600, 
                  textTransform: 'uppercase', 
                  backgroundColor: slide.tagColor || '#3b82f6', 
                  color: '#ffffff'
                }}>
                  {slide.tag}
                </span>
              )}
              <h2 style={{ 
                fontSize: 'clamp(2.5rem, 4vw, 4.5rem)', 
                fontWeight: 900, 
                lineHeight: 1.1, 
                color: slide.textColor || '#ffffff',
                marginLeft: slide.tag ? '2rem' : '0'
              }}>
                {slide.title}
              </h2>
            </div>

            {/* Middle Content (Overlaid on Image) */}
            <div style={{ 
              position: 'relative', 
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 3rem'
            }}>
              <p style={{ 
                fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)', 
                lineHeight: 1.5, 
                fontWeight: 300, 
                textAlign: 'center',
                maxWidth: '900px',
                color: 'rgba(255,255,255,0.95)'
              }}>
                {slide.description}
              </p>
            </div>

            {/* Bottom CTA Bar */}
            {slide.ctaText && (
              <div style={{ 
                position: 'relative', 
                zIndex: 1,
                padding: '2rem 3rem',
                background: slide.tagColor || '#3b82f6',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <button onClick={() => handleCtaClick(slide)} style={{ 
                  padding: '1.25rem 0', 
                  width: '80%',
                  maxWidth: '600px',
                  backgroundColor: 'rgba(255,255,255,0.95)', 
                  color: '#111827', 
                  fontWeight: 700, 
                  fontSize: '1.25rem', 
                  borderRadius: '0.5rem',
                  border: 'none', 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center'
                }}>
                  {slide.ctaText}
                </button>
              </div>
            )}
          </div>
        );

      case 'centered':
        // LAYOUT 4: Single Column Stacked - Vertical flex layout
        // Centered pills, large balanced typography, medium-rounded buttons - Minimal clean feel
        return (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%', 
            padding: '0 3rem', 
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {slide.tag && (
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ 
                  display: 'inline-block', 
                  padding: '0.5rem 1.5rem', 
                  borderRadius: '9999px', // Full pill
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.1em', 
                  backgroundColor: slide.tagColor || '#3b82f6', 
                  color: '#ffffff'
                }}>
                  {slide.tag}
                </span>
              </div>
            )}
            <h2 style={{ 
              fontSize: 'clamp(2.25rem, 3.5vw, 4rem)', 
              fontWeight: 800, 
              marginBottom: '1.5rem', 
              lineHeight: 1.2, 
              textAlign: 'center',
              color: slide.textColor || '#ffffff'
            }}>
              {slide.title}
            </h2>
            <p style={{ 
              fontSize: 'clamp(1.125rem, 1.5vw, 1.75rem)', 
              marginBottom: '2.5rem', 
              lineHeight: 1.6, 
              fontWeight: 300, 
              textAlign: 'center',
              color: 'rgba(255,255,255,0.9)'
            }}>
              {slide.description}
            </p>
            {slide.ctaText && (
              <button onClick={() => handleCtaClick(slide)} style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                padding: '1rem 2.5rem', 
                backgroundColor: '#ffffff', 
                color: '#111827', 
                fontWeight: 700, 
                fontSize: '1.125rem', 
                borderRadius: '0.5rem', // Medium round
                border: 'none', 
                cursor: 'pointer',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease'
              }}>
                {slide.ctaText}
                <svg style={{ width: '1.25rem', height: '1.25rem', marginLeft: '0.75rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            )}
          </div>
        );

      case 'diagonal':
        // LAYOUT 5: Narrow Sidebar + Wide Main Grid - 1fr 3fr (25% | 75%)
        // Rotated sidebar badges, italic titles, skewed buttons - Dynamic creative feel
        return (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 3fr', 
            gap: '2rem', 
            alignItems: 'center',
            width: '100%', 
            height: '100%',
            padding: '2rem 3rem'
          }}>
            {/* Narrow Sidebar Column */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.5rem',
              alignItems: 'center',
              transform: 'rotate(-3deg)'
            }}>
              {slide.tag && (
                <div style={{ 
                  padding: '1.5rem', 
                  borderRadius: '0.5rem',
                  backgroundColor: slide.tagColor || '#3b82f6',
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  width: '100%'
                }}>
                  {slide.tag}
                </div>
              )}
              {slide.image && (
                <img
                  src={slide.image}
                  alt={slide.imageAlt || slide.title}
                  style={{ 
                    width: '100%', 
                    aspectRatio: '1/1', 
                    objectFit: 'cover', 
                    borderRadius: '0.5rem' 
                  }}
                  onError={(e) => {
                    const t = e.currentTarget as HTMLImageElement;
                    t.onerror = null;
                    t.src = makePlaceholderDataUri(slide.title || 'image');
                  }}
                />
              )}
            </div>

            {/* Wide Main Column */}
            <div>
              <h2 style={{ 
                fontSize: 'clamp(2rem, 3vw, 3.5rem)', 
                fontWeight: 800, 
                marginBottom: '1.5rem', 
                lineHeight: 1.15, 
                textAlign: 'left',
                fontStyle: 'italic', // Italic for dynamic feel
                color: slide.textColor || '#ffffff'
              }}>
                {slide.title}
              </h2>
              <p style={{ 
                fontSize: 'clamp(1.0625rem, 1.35vw, 1.5rem)', 
                marginBottom: '2rem', 
                lineHeight: 1.7, 
                fontWeight: 400, 
                textAlign: 'left',
                maxWidth: '700px',
                color: 'rgba(255,255,255,0.85)'
              }}>
                {slide.description}
              </p>
              {slide.ctaText && (
                <button onClick={() => handleCtaClick(slide)} style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  padding: '1rem 2.5rem', 
                  backgroundColor: slide.tagColor || '#3b82f6', 
                  color: '#ffffff', 
                  fontWeight: 700, 
                  fontSize: '1.125rem', 
                  borderRadius: '0.5rem',
                  border: 'none', 
                  cursor: 'pointer',
                  transform: 'skewX(-5deg)', // Skewed button
                  transition: 'all 0.3s ease'
                }}>
                  <span style={{ transform: 'skewX(5deg)', display: 'flex', alignItems: 'center' }}>
                    {slide.ctaText}
                    <svg style={{ width: '1.25rem', height: '1.25rem', marginLeft: '0.75rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </button>
              )}
            </div>
          </div>
        );

      case 'grid':
        // LAYOUT 6: Hero + Bottom Stats Grid - Row layout with 3-column grid below
        // Corner badges, glass-morphism stat cards - Data-focused dashboard feel
        return (
          <div style={{ 
            display: 'grid', 
            gridTemplateRows: '1fr auto', 
            gap: '2rem',
            width: '100%', 
            height: '100%',
            padding: '2rem 3rem'
          }}>
            {/* Hero Section */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {slide.tag && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <span style={{ 
                    display: 'inline-block', 
                    padding: '0.5rem 1rem', 
                    borderRadius: '0.25rem', // Minimal round
                    fontSize: '0.75rem', 
                    fontWeight: 600, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.1em', 
                    backgroundColor: slide.tagColor || '#3b82f6', 
                    color: '#ffffff'
                  }}>
                    {slide.tag}
                  </span>
                </div>
              )}
              <h2 style={{ 
                fontSize: 'clamp(1.75rem, 2.5vw, 3rem)', 
                fontWeight: 700, 
                marginBottom: '1rem', 
                lineHeight: 1.3, 
                textAlign: 'left',
                color: slide.textColor || '#ffffff'
              }}>
                {slide.title}
              </h2>
              <p style={{ 
                fontSize: 'clamp(1rem, 1.25vw, 1.25rem)', 
                marginBottom: '1.5rem', 
                lineHeight: 1.7, 
                fontWeight: 400, 
                textAlign: 'left',
                maxWidth: '700px',
                color: 'rgba(255,255,255,0.85)'
              }}>
                {slide.description}
              </p>
              {slide.ctaText && (
                <button onClick={() => handleCtaClick(slide)} style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  alignSelf: 'flex-start',
                  padding: '0.875rem 2rem', 
                  backgroundColor: '#ffffff', 
                  color: '#111827', 
                  fontWeight: 600, 
                  fontSize: '1rem', 
                  borderRadius: '0.375rem',
                  border: 'none', 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  {slide.ctaText}
                  <svg style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              )}
            </div>

            {/* Bottom Stats Grid (3 columns) */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '1rem'
            }}>
              {Array.isArray((slide as any).stats) ? (
                (slide as any).stats.slice(0, 3).map((s: any, idx: number) => (
                  <div key={idx} style={{ 
                    background: 'rgba(255,255,255,0.08)', 
                    padding: '1.5rem', 
                    borderRadius: '0.75rem',
                    backdropFilter: 'blur(10px)', // Glass-morphism
                    border: '1px solid rgba(255,255,255,0.1)',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      fontSize: '2rem', 
                      fontWeight: 800, 
                      marginBottom: '0.5rem', 
                      color: slide.textColor || '#ffffff' 
                    }}>
                      {s.value}
                    </div>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      color: 'rgba(255,255,255,0.75)', 
                      fontWeight: 500 
                    }}>
                      {s.label}
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div style={{ 
                    background: 'rgba(255,255,255,0.08)', 
                    padding: '1.5rem', 
                    borderRadius: '0.75rem',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>
                      Add stats data
                    </div>
                  </div>
                  <div style={{ 
                    background: 'rgba(255,255,255,0.08)', 
                    padding: '1.5rem', 
                    borderRadius: '0.75rem',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>
                      to display here
                    </div>
                  </div>
                  <div style={{ 
                    background: 'rgba(255,255,255,0.08)', 
                    padding: '1.5rem', 
                    borderRadius: '0.75rem',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>
                      in grid layout
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        );

      default:
        // Fallback to centered layout
        return renderSlideContent({ ...slide, layout: 'centered' });
    }
  };

  return (
    <>
      <style>{pulseKeyframes}</style>
      <div className={`product-slider w-full h-full ${className}`} style={{ height }}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={showNavigation}
        pagination={showPagination ? { clickable: true } : false}
        autoplay={autoplay ? {
          delay: autoplayDelay,
          disableOnInteraction: false,
        } : false}
        effect={useFadeEffect ? 'fade' : 'slide'}
        loop={slides.length > 1}
        className="h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="h-full">
            <div
              className="relative w-full h-full flex items-center justify-center overflow-hidden"
              style={{
                background: slide.backgroundColor || '#1e293b',
                color: slide.textColor || '#ffffff',
                minHeight: '100%',
              }}
            >
              {renderSlideContent(slide)}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .product-slider .swiper-button-next,
          .product-slider .swiper-button-prev {
            color: #ffffff;
            background: rgba(0, 0, 0, 0.5);
            width: 50px;
            height: 50px;
            border-radius: 50%;
            transition: all 0.3s ease;
          }

          .product-slider .swiper-button-next:hover,
          .product-slider .swiper-button-prev:hover {
            background: rgba(0, 0, 0, 0.8);
            transform: scale(1.1);
          }

          .product-slider .swiper-button-next:after,
          .product-slider .swiper-button-prev:after {
            font-size: 20px;
          }

          .product-slider .swiper-pagination-bullet {
            background: #ffffff;
            opacity: 0.5;
            width: 12px;
            height: 12px;
          }

          .product-slider .swiper-pagination-bullet-active {
            opacity: 1;
            background: #3b82f6;
          }
        `
      }} />
    </div>
    </>
  );
};

export default ProductSlider;
