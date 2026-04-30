'use client';

import React from 'react';

export interface HeroBgImagePanelProps {
  badge?: string;
  eyebrow?: string;
  title: string;
  titleHighlight: string;
  /** Tailwind classes for the highlighted title word. Defaults to a auth-primary → auth-secondary gradient.
   *  Override per service to match brand colors, e.g. 'text-transparent bg-clip-text bg-gradient-to-r from-secure-secondary to-secure-accent' */
  titleHighlightClassName?: string;
  subtitle: string;
  backgroundImageSrc?: string;
}

export const HeroBgImagePanel: React.FC<HeroBgImagePanelProps> = ({
  badge = 'Web3Codex',
  eyebrow,
  title,
  titleHighlight,
  titleHighlightClassName = 'text-transparent bg-clip-text bg-gradient-to-r from-auth-primary to-auth-secondary',
  subtitle,
  backgroundImageSrc,
}) => {
  return (
    <section className="relative overflow-hidden min-h-[70vh] flex flex-col justify-center">
      {backgroundImageSrc && (
        <img
          src={backgroundImageSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          aria-hidden="true"
        />
      )}
      <div className="absolute inset-0 bg-black/75" />
      <div className="absolute inset-0 bg-gradient-to-br from-auth-primary/10 via-transparent to-auth-secondary/10 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 pt-36 pb-24">
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-auth-primary/10 border border-auth-primary/30 text-auth-primary text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-auth-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-auth-primary" />
            </span>
            {badge}
          </div>
        </div>
        <div className="max-w-3xl mx-auto text-center">
          {eyebrow && (
            <p className="text-xs font-mono text-auth-primary/60 tracking-widest uppercase mb-4">
              {eyebrow}
            </p>
          )}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">{title}</span>
            <br />
            <span className={titleHighlightClassName}>
              {titleHighlight}
            </span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
};
