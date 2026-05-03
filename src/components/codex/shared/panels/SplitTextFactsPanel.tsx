'use client';

import React from 'react';

export interface FactCard {
  label: string;
  value: string;
  mono?: boolean;
}

export interface SplitTextFactsPanelProps {
  eyebrow?: string;
  title?: string;
  paragraphs: string[];
  factCards: FactCard[];
  /** Optional: override section background Tailwind class */
  background?: string;
}

export const SplitTextFactsPanel: React.FC<SplitTextFactsPanelProps> = ({
  eyebrow,
  title,
  paragraphs,
  factCards,
  background = 'bg-slate-800',
}) => {
  return (
    <section className={`py-20 lg:py-28 ${background}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            {eyebrow && (
              <p className="text-xs font-mono text-hash-primary/60 tracking-widest uppercase mb-3">{eyebrow}</p>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{title}</h2>
            )}
            {paragraphs.map((para, i) => (
              <p key={i} className="text-slate-400 leading-relaxed mb-4">{para}</p>
            ))}
          </div>

          <div className="space-y-6">
            {factCards.map((row) => (
              <div
                key={row.label}
                className="group relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-hash-primary/30 transition-all"
              >
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-hash-primary/40 to-transparent" />
                <p className="text-xs font-mono text-hash-primary/60 tracking-widest uppercase mb-2">{row.label}</p>
                <p className={`text-white text-sm ${row.mono ? 'font-mono' : ''}`}>{row.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
