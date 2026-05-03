'use client';

import React from 'react';
import Link from 'next/link';

export interface CtaButton {
  label: string;
  href: string;
  external?: boolean;
  primary?: boolean;
}

export interface CenteredCtaPanelProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  buttons: CtaButton[];
}

export const CenteredCtaPanel: React.FC<CenteredCtaPanelProps> = ({
  eyebrow,
  title,
  subtitle,
  buttons,
}) => {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-hash-primary/5 via-transparent to-hash-secondary/5 pointer-events-none" />
      <div className="container mx-auto px-4 text-center">
        {eyebrow && (
          <p className="text-xs font-mono text-hash-primary/60 tracking-widest uppercase mb-4">{eyebrow}</p>
        )}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
        {subtitle && (
          <p className="text-slate-400 mb-10 max-w-xl mx-auto text-lg">{subtitle}</p>
        )}
        <div className="flex justify-center gap-4 flex-wrap">
          {buttons.map((btn) =>
            btn.external ? (
              <a
                key={btn.label}
                href={btn.href}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  btn.primary
                    ? 'group inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-hash-primary text-white font-semibold transition-all hover:bg-hash-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-hash-primary/25'
                    : 'inline-flex items-center px-8 py-4 rounded-lg border border-white/20 text-white font-semibold transition-all hover:bg-white/5'
                }
              >
                {btn.label}
              </a>
            ) : (
              <Link
                key={btn.label}
                href={btn.href}
                className={
                  btn.primary
                    ? 'group inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-hash-primary text-white font-semibold transition-all hover:bg-hash-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-hash-primary/25'
                    : 'inline-flex items-center px-8 py-4 rounded-lg border border-white/20 text-white font-semibold transition-all hover:bg-white/5'
                }
              >
                {btn.label}
                {btn.primary && (
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                )}
              </Link>
            )
          )}
        </div>
      </div>
    </section>
  );
};
