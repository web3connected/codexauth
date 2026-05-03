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

  // Render title text with specific words highlighted in custom colors (used by app-showcase layout)
  const renderAccentedTitle = (title: string, accents?: { word: string; color: string }[]) => {
    if (!accents || accents.length === 0) return <>{title}</>;
    let parts: (string | React.ReactElement)[] = [title];
    accents.forEach(({ word, color }, ai) => {
      const next: (string | React.ReactElement)[] = [];
      parts.forEach((part, pi) => {
        if (typeof part !== 'string') { next.push(part); return; }
        const segs = part.split(word);
        segs.forEach((seg, si) => {
          if (seg) next.push(seg);
          if (si < segs.length - 1) {
            next.push(<span key={`a${ai}-${pi}-${si}`} style={{ color }}>{word}</span>);
          }
        });
      });
      parts = next;
    });
    return <>{parts}</>;
  };

  // Render title where the first word gets a CSS gradient (used by comparison-cards layout)
  const renderGradientTitle = (title: string, gradient?: { from: string; to: string }) => {
    if (!gradient) return <>{title}</>;
    const spaceIdx = title.indexOf(' ');
    if (spaceIdx === -1) {
      return (
        <span style={{
          background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>{title}</span>
      );
    }
    const firstWord = title.slice(0, spaceIdx);
    const rest = title.slice(spaceIdx);
    return (
      <>
        <span style={{
          background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>{firstWord}</span>
        {rest}
      </>
    );
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
                padding: '1.75rem 3rem',
                background: 'rgba(0,0,0,0.45)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <button onClick={() => handleCtaClick(slide)} style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.875rem 2.5rem', 
                  backgroundColor: slide.tagColor || '#3b82f6', 
                  color: '#ffffff', 
                  fontWeight: 700, 
                  fontSize: '1.125rem', 
                  borderRadius: '0.5rem',
                  border: 'none', 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.025em'
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
            padding: '2rem 3rem',
            position: 'relative'
          }}>
            {/* Background Image */}
            {slide.image && (
              <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
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
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.75) 40%, rgba(0,0,0,0.45))' }} />
              </div>
            )}
            {/* Hero Section */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1, marginTop: '40px' }}>
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
              gap: '1rem',
              position: 'relative',
              zIndex: 1
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

      case 'partnership-collab':
        // LAYOUT 10: Partnership / Collab Announcement
        // Full-bleed dark bg, 3 soft glow blob circles (Venn-style), wide-tracked eyebrow top-center,
        // two brand logos + connector symbol center stage, footer URLs pinned bottom corners.
        return (
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            backgroundColor: slide.backgroundColor || '#0A0E23',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            {/* Three overlapping glow blobs — left (teal), center (dark), right (purple) */}
            {/* Left blob */}
            <div style={{
              position: 'absolute',
              width: '42%',
              aspectRatio: '1/1',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${slide.tagColor ? slide.tagColor + '30' : 'rgba(14,116,144,0.22)'} 0%, transparent 70%)`,
              top: '10%',
              left: '8%',
              filter: 'blur(40px)',
              pointerEvents: 'none',
            }} />
            {/* Center blob */}
            <div style={{
              position: 'absolute',
              width: '38%',
              aspectRatio: '1/1',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(30,20,60,0.6) 0%, transparent 70%)',
              top: '5%',
              left: '31%',
              filter: 'blur(32px)',
              pointerEvents: 'none',
            }} />
            {/* Right blob */}
            <div style={{
              position: 'absolute',
              width: '42%',
              aspectRatio: '1/1',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(88,28,220,0.2) 0%, transparent 70%)',
              top: '10%',
              right: '6%',
              filter: 'blur(40px)',
              pointerEvents: 'none',
            }} />

            {/* Eyebrow — wide letter-spacing, top center (uses slide.tag) */}
            <div style={{
              position: 'relative',
              zIndex: 1,
              paddingTop: '2.25rem',
              textAlign: 'center',
            }}>
              {slide.tag && (
                <span style={{
                  fontSize: 'clamp(0.7rem, 1.1vw, 1rem)',
                  fontWeight: 400,
                  letterSpacing: '0.35em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.65)',
                }}>
                  {slide.tag}
                </span>
              )}
            </div>

            {/* Center stage: Logo — connector — Logo */}
            <div style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(2rem, 5vw, 5rem)',
              flex: 1,
            }}>
              {(slide.partnerLogos ?? []).slice(0, 2).map((partner, idx) => (
                <React.Fragment key={idx}>
                  {/* Logo block */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {partner.logoSrc ? (
                      <img
                        src={partner.logoSrc}
                        alt={partner.name}
                        style={{
                          height: 'clamp(48px, 7vw, 90px)',
                          width: 'auto',
                          maxWidth: '320px',
                          objectFit: 'contain',
                          filter: 'brightness(0) invert(1)',
                        }}
                        onError={(e) => {
                          const t = e.currentTarget as HTMLImageElement;
                          t.style.display = 'none';
                          const fallback = t.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'block';
                        }}
                      />
                    ) : null}
                    {/* Fallback: brand name as large text */}
                    <span style={{
                      display: partner.logoSrc ? 'none' : 'block',
                      fontSize: 'clamp(2.5rem, 6vw, 6rem)',
                      fontWeight: 900,
                      color: '#ffffff',
                      letterSpacing: '-0.02em',
                      lineHeight: 1,
                    }}>
                      {partner.name}
                    </span>
                  </div>

                  {/* Connector symbol between logos (only after first logo) */}
                  {idx === 0 && (
                    <div style={{
                      width: 'clamp(36px, 4vw, 56px)',
                      height: 'clamp(36px, 4vw, 56px)',
                      borderRadius: '50%',
                      backgroundColor: slide.tagColor || '#7C3AED',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: `0 0 24px ${slide.tagColor || '#7C3AED'}80`,
                    }}>
                      <span style={{
                        fontSize: 'clamp(1rem, 1.8vw, 1.5rem)',
                        fontWeight: 700,
                        color: '#ffffff',
                        lineHeight: 1,
                      }}>
                        {slide.connector ?? '×'}
                      </span>
                    </div>
                  )}
                </React.Fragment>
              ))}

              {/* Fallback if no partnerLogos provided */}
              {(!slide.partnerLogos || slide.partnerLogos.length === 0) && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3rem',
                  opacity: 0.3,
                }}>
                  <span style={{ fontSize: '4rem', fontWeight: 900, color: '#ffffff' }}>Brand A</span>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#fff', fontWeight: 700 }}>×</span>
                  </div>
                  <span style={{ fontSize: '4rem', fontWeight: 900, color: '#ffffff' }}>Brand B</span>
                </div>
              )}
            </div>

            {/* Footer: URLs pinned bottom-left and bottom-right */}
            <div style={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem 3.5rem',
            }}>
              {(slide.footerLinks ?? slide.partnerLogos?.filter(p => p.url).map(p => ({ label: p.url!, url: p.url })) ?? []).slice(0, 2).map((link, idx) => (
                <span key={idx} style={{
                  fontSize: 'clamp(0.7rem, 0.9vw, 0.875rem)',
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.05em',
                  fontStyle: 'italic',
                }}>
                  {link.label}
                </span>
              ))}
            </div>
          </div>
        );

      case 'feature-checklist':
        // LAYOUT 9: Feature Checklist — full-bleed gradient bg, large headline + bullet points left,
        // device/phone mockup image right. No gutters, no card borders — background fills edge to edge.
        return (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {/* Background image layer */}
            {slide.backgroundImage && (
              <img
                src={slide.backgroundImage}
                alt=""
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  zIndex: 0,
                  opacity: 0.75,
                  pointerEvents: 'none',
                }}
              />
            )}
            {/* Full-bleed background gradient — overrides the slide backgroundColor */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: slide.backgroundColor
                ? `linear-gradient(135deg, ${slide.backgroundColor}cc 0%, ${slide.tagColor || '#1a40c4'}66 60%, transparent 100%)`
                : 'linear-gradient(135deg, #0D1F6Ecc 0%, #1A40C466 60%, transparent 100%)',
              zIndex: 1,
            }} />

            {/* Left: Headline + bullets */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              padding: '3rem 3rem 3rem 4rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
            }}>
              <h2 style={{
                fontSize: 'clamp(2.5rem, 4.5vw, 5rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                marginBottom: '2.5rem',
                color: slide.textColor || '#ffffff',
                letterSpacing: '-0.02em',
              }}>
                {slide.titleGradient
                  ? renderGradientTitle(slide.title, slide.titleGradient)
                  : slide.titleAccents
                  ? renderAccentedTitle(slide.title, slide.titleAccents)
                  : slide.title}
              </h2>

              {/* Bullet points */}
              {slide.bulletPoints && slide.bulletPoints.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {slide.bulletPoints.map((bp, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                      {/* Check icon — image if provided, else filled circle with checkmark */}
                      {bp.icon ? (
                        <img
                          src={bp.icon}
                          alt=''
                          style={{ width: '32px', height: '32px', flexShrink: 0, marginTop: '2px' }}
                        />
                      ) : (
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: slide.tagColor || '#2563EB',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '2px',
                        }}>
                          <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#ffffff' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
                            <polyline points='20 6 9 17 4 12' />
                          </svg>
                        </div>
                      )}
                      <p style={{
                        fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)',
                        lineHeight: 1.65,
                        color: 'rgba(255,255,255,0.85)',
                        margin: 0,
                      }}>
                        {bp.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA */}
              {slide.ctaText && (
                <div style={{ marginTop: '2.5rem' }}>
                  <button
                    onClick={() => handleCtaClick(slide)}
                    style={{
                      padding: '0.875rem 2rem',
                      backgroundColor: '#ffffff',
                      color: slide.tagColor || '#1A40C4',
                      fontWeight: 700,
                      fontSize: '1rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    {slide.ctaText}
                  </button>
                </div>
              )}
            </div>

            {/* Right: Device mockup — full-height, no padding, image bleeds to edge */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
              {slide.image ? (
                <img
                  src={slide.image}
                  alt={slide.imageAlt || slide.title}
                  style={{
                    height: '100%',
                    width: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center bottom',
                    filter: 'drop-shadow(0 32px 64px rgba(0,0,0,0.5))',
                  }}
                  onError={(e) => {
                    const t = e.currentTarget as HTMLImageElement;
                    t.onerror = null;
                    t.src = makePlaceholderDataUri(slide.title || 'image');
                  }}
                />
              ) : (
                <div style={{
                  width: '60%',
                  aspectRatio: '9/16',
                  borderRadius: '2rem',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)' }}>Device mockup</span>
                </div>
              )}
            </div>
          </div>
        );

      case 'comparison-cards':
        // LAYOUT 8: Comparison Cards — 1/3 content left + two dark comparison cards center+right
        // First word of title gets a gradient. Cards have a label tab header + item rows + icon strip.
        // Right card gets an accent border glow for emphasis. Web2 vs Web3 / Before vs After feel.
        return (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '2rem',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            padding: '2rem 3.5rem',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Background image with dark overlay */}
            {slide.image && (
              <>
                <img
                  src={slide.image}
                  alt=""
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    zIndex: 0,
                    opacity: 0.55,
                    pointerEvents: 'none',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(135deg, ${slide.backgroundColor || '#070D1F'}ee 0%, ${slide.backgroundColor || '#070D1F'}99 55%, transparent 100%)`,
                  zIndex: 0,
                  pointerEvents: 'none',
                }} />
              </>
            )}
            {/* Left: Content */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{
                fontSize: 'clamp(2.25rem, 3.5vw, 4rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: '1.25rem',
                color: slide.textColor || '#ffffff',
              }}>
                {renderGradientTitle(slide.title, slide.titleGradient)}
              </h2>
              {slide.description && (
                <p style={{
                  fontSize: 'clamp(0.9rem, 1.1vw, 1.05rem)',
                  lineHeight: 1.75,
                  marginBottom: '2rem',
                  color: 'rgba(255,255,255,0.65)',
                }}>
                  {slide.description}
                </p>
              )}
              {slide.ctaText && (
                <button
                  onClick={() => handleCtaClick(slide)}
                  style={{
                    padding: '0.875rem 2rem',
                    backgroundColor: slide.tagColor || '#6366f1',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  {slide.ctaText}
                </button>
              )}
            </div>

            {/* Center + Right: Comparison cards */}
            {(slide.comparisonCards ?? []).slice(0, 2).map((card, idx) => {
              const isAccented = !!card.accentColor;
              return (
                <div
                  key={idx}
                  style={{
                    position: 'relative',
                    borderRadius: '1rem',
                    background: 'rgba(18, 22, 48, 0.85)',
                    border: isAccented
                      ? `1.5px solid ${card.accentColor}`
                      : '1px solid rgba(255,255,255,0.1)',
                    boxShadow: isAccented
                      ? `0 0 32px ${card.accentColor}40, 0 16px 48px rgba(0,0,0,0.5)`
                      : '0 16px 48px rgba(0,0,0,0.45)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  {/* Card header label tab */}
                  <div style={{
                    padding: '0.625rem 1.25rem',
                    borderBottom: isAccented
                      ? `1px solid ${card.accentColor}60`
                      : '1px solid rgba(255,255,255,0.08)',
                    background: isAccented
                      ? `${card.accentColor}18`
                      : 'rgba(255,255,255,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: isAccented ? card.accentColor : 'rgba(255,255,255,0.5)',
                    }}>
                      {card.label}
                    </span>
                  </div>

                  {/* Card body: item rows */}
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                    {card.items.map((item, ii) => (
                      <div
                        key={ii}
                        style={{
                          padding: '0.625rem 0.875rem',
                          borderRadius: '0.5rem',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          fontSize: '0.875rem',
                          color: 'rgba(255,255,255,0.75)',
                          fontFamily: item.startsWith('0x') ? 'monospace' : 'inherit',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Card footer: icon strip */}
                  {card.icons && card.icons.length > 0 && (
                    <div style={{
                      padding: '0.875rem 1.25rem',
                      borderTop: '1px solid rgba(255,255,255,0.07)',
                      display: 'flex',
                      gap: '0.625rem',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {card.icons.map((icon, ii) => (
                        <img
                          key={ii}
                          src={icon}
                          alt=''
                          style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );

      case 'app-showcase':
        // LAYOUT 7: App Showcase — 50/50 grid, accent-colored headline words, dual CTA buttons, floating UI card right
        // Designed for product launch / service hero slides — Web3 / SaaS product feel
        return (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            padding: '2rem 4rem',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Subtle dot-grid background overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
              zIndex: 0,
              pointerEvents: 'none',
            }} />

            {/* Left: Content column */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              {slide.tag && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.4rem 1rem',
                    borderRadius: '9999px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    backgroundColor: slide.tagColor || '#2563EB',
                    color: '#ffffff',
                  }}>
                    {slide.tag}
                  </span>
                </div>
              )}

              <h2 style={{
                fontSize: 'clamp(2rem, 3.5vw, 3.75rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: '1.25rem',
                color: slide.textColor || '#ffffff',
              }}>
                {renderAccentedTitle(slide.title, slide.titleAccents)}
              </h2>

              {slide.description && (
                <p style={{
                  fontSize: 'clamp(0.95rem, 1.2vw, 1.15rem)',
                  lineHeight: 1.7,
                  marginBottom: '2rem',
                  color: 'rgba(255,255,255,0.72)',
                  maxWidth: '520px',
                }}>
                  {slide.description}
                </p>
              )}

              {/* Dual CTA row: filled primary + ghost secondary */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {slide.ctaText && (
                  <button
                    onClick={() => handleCtaClick(slide)}
                    style={{
                      padding: '0.875rem 2rem',
                      backgroundColor: slide.tagColor || '#2563EB',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '1rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    {slide.ctaText}
                  </button>
                )}
                {slide.ctaSecondary && (
                  <button
                    onClick={() => {
                      if (slide.ctaSecondary?.link) window.location.href = slide.ctaSecondary.link;
                    }}
                    style={{
                      padding: '0.875rem 2rem',
                      backgroundColor: 'transparent',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '1rem',
                      borderRadius: '0.5rem',
                      border: '1.5px solid rgba(255,255,255,0.5)',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s ease',
                    }}
                  >
                    {slide.ctaSecondary.text}
                  </button>
                )}
              </div>
            </div>

            {/* Right: Floating UI mockup card with ambient glow */}
            <div style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {slide.image ? (
                <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
                  {/* Ambient glow behind card */}
                  <div style={{
                    position: 'absolute',
                    inset: '-15%',
                    background: `radial-gradient(ellipse at center, ${slide.tagColor ? slide.tagColor + '28' : 'rgba(37,99,235,0.18)'} 0%, transparent 70%)`,
                    filter: 'blur(32px)',
                    zIndex: 0,
                    pointerEvents: 'none',
                  }} />
                  <img
                    src={slide.image}
                    alt={slide.imageAlt || slide.title}
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      width: '100%',
                      borderRadius: '1rem',
                      boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)',
                    }}
                    onError={(e) => {
                      const t = e.currentTarget as HTMLImageElement;
                      t.onerror = null;
                      t.src = makePlaceholderDataUri(slide.title || 'image');
                    }}
                  />
                </div>
              ) : (
                // No image — render a glassmorphism placeholder card
                <div style={{
                  width: '100%',
                  maxWidth: '420px',
                  padding: '2.5rem',
                  borderRadius: '1rem',
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}>
                  {slide.stats?.slice(0, 3).map((s, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      background: 'rgba(255,255,255,0.06)',
                    }}>
                      <div style={{ flex: 1, fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>{s.label}</div>
                      <div style={{ fontWeight: 700, color: slide.tagColor || '#2563EB' }}>{s.value}</div>
                    </div>
                  ))}
                  {(!slide.stats || slide.stats.length === 0) && (
                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem', padding: '2rem 0' }}>
                      Add image or stats to populate this panel
                    </div>
                  )}
                </div>
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
