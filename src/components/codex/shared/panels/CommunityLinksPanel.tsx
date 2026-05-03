'use client';

import React from 'react';
import Link from 'next/link';

export interface CommunityLink {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  /** Opens in new tab with noopener */
  external?: boolean;
}

export interface CommunityCtaButton {
  label: string;
  href: string;
  /** Primary style (filled) vs secondary (outlined) */
  primary?: boolean;
}

export interface CommunityLinksPanelProps {
  title?: string;
  subtitle?: string;
  links: CommunityLink[];
  /** Optional background image URL shown at low opacity behind the section */
  backgroundImageSrc?: string;
  /** CTA banner title */
  ctaTitle?: string;
  /** CTA banner subtitle */
  ctaSubtitle?: string;
  /** Up to 2 CTA buttons */
  ctaButtons?: CommunityCtaButton[];
}

export const CommunityLinksPanel: React.FC<CommunityLinksPanelProps> = ({
  title = 'Join Our Community',
  subtitle,
  links,
  backgroundImageSrc,
  ctaTitle,
  ctaSubtitle,
  ctaButtons = [],
}) => {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Optional background image */}
      {backgroundImageSrc && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backgroundImageSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/50 to-slate-900/65" />
        </>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
            {subtitle && (
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">{subtitle}</p>
            )}
          </div>

          {/* Community Links Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {links.map((link, index) => (
              <CommunityCard key={index} link={link} />
            ))}
          </div>

          {/* CTA Banner */}
          {(ctaTitle || ctaButtons.length > 0) && (
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-hash-primary/10 via-hash-accent/10 to-hash-secondary/10 p-8 md:p-12">
              <div className="absolute top-0 right-0 w-64 h-64 bg-hash-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  {ctaTitle && (
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{ctaTitle}</h3>
                  )}
                  {ctaSubtitle && (
                    <p className="text-slate-400 max-w-lg">{ctaSubtitle}</p>
                  )}
                </div>
                {ctaButtons.length > 0 && (
                  <div className="flex flex-col sm:flex-row gap-4">
                    {ctaButtons.map((btn, i) => (
                      <Link
                        key={i}
                        href={btn.href}
                        className={
                          btn.primary
                            ? 'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-hash-primary text-white font-semibold transition-all hover:bg-hash-primary/90 hover:scale-105'
                            : 'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-white/20 text-white font-medium transition-all hover:bg-white/5'
                        }
                      >
                        {btn.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

function CommunityCard({ link }: { link: CommunityLink }) {
  const externalProps = link.external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Link
      href={link.href}
      {...externalProps}
      className="group flex flex-col items-center text-center p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-hash-primary/30 hover:scale-105"
    >
      <div className="mb-4 p-3 rounded-full bg-white/5 border border-white/10 text-slate-400 group-hover:text-hash-primary group-hover:border-hash-primary/20 transition-colors">
        {link.icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-hash-primary transition-colors">
        {link.title}
      </h3>
      <p className="text-sm text-slate-500">{link.description}</p>
      {link.external && (
        <svg
          className="w-4 h-4 mt-3 text-slate-600 group-hover:text-hash-primary transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      )}
    </Link>
  );
}

export default CommunityLinksPanel;
