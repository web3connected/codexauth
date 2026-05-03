'use client';

import React from 'react';

export interface OverlayGridCard {
  symbol: string;
  tag: string;
  name: string;
  description: string;
  stat: string;
  statLabel: string;
}

export interface BgOverlayCardGridPanelProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  cards: OverlayGridCard[];
  backgroundImageSrc?: string;
}

export const BgOverlayCardGridPanel: React.FC<BgOverlayCardGridPanelProps> = ({
  eyebrow,
  title,
  subtitle,
  cards,
  backgroundImageSrc,
}) => {
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      {backgroundImageSrc && (
        <img
          src={backgroundImageSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
          aria-hidden="true"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/55 via-slate-900/45 to-slate-900/55" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-14">
          {eyebrow && (
            <p className="text-xs font-mono text-hash-primary/60 tracking-widest uppercase mb-3">{eyebrow}</p>
          )}
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
          )}
          {subtitle && (
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {cards.map((card) => (
            <div
              key={card.name}
              className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 transition-all hover:bg-white/10 hover:border-hash-primary/30"
            >
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-hash-primary/40 to-transparent" />
              <div className="mb-6 p-4 inline-flex rounded-2xl bg-hash-primary/10 border border-hash-primary/20 text-hash-primary w-fit">
                <span className="text-2xl font-bold font-mono leading-none">{card.symbol}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-hash-primary transition-colors">
                {card.name}
              </h3>
              <p className="text-xs font-mono text-hash-primary/70 mb-4 tracking-wide uppercase">{card.tag}</p>
              <p className="text-slate-400 text-sm leading-relaxed flex-1">{card.description}</p>
              <div className="mt-8 pt-6 border-t border-white/10">
                <span className="text-2xl font-bold text-hash-primary font-mono">{card.stat}</span>
                <p className="text-xs text-slate-500 mt-1">{card.statLabel}</p>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-hash-primary/0 via-hash-primary/3 to-hash-primary/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
