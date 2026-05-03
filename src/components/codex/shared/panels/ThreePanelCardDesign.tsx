'use client';

import React from 'react';

export interface PanelCard {
  /** Icon rendered inside the card — pass any React node (SVG, emoji, etc.) */
  icon: React.ReactNode;
  title: string;
  /** Small monospace tagline shown below the title */
  tagline: string;
  description: string;
  stat: string;
  statLabel: string;
}

export interface ThreePanelCardDesignProps {
  cards: [PanelCard, PanelCard, PanelCard];
  /** Optional URL to a background image. Falls back to a dark gradient. */
  backgroundImageSrc?: string;
  className?: string;
}

export const ThreePanelCardDesign: React.FC<ThreePanelCardDesignProps> = ({
  cards,
  backgroundImageSrc,
  className = '',
}) => {
  return (
    <section className={`relative py-16 lg:py-24 overflow-hidden ${className}`}>
      {/* Optional background image */}
      {backgroundImageSrc && (
        <img
          src={backgroundImageSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
          aria-hidden="true"
        />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/55 via-slate-900/45 to-slate-900/55" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {cards.map((card, index) => (
            <Card key={index} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
};

function Card({ card }: { card: PanelCard }) {
  return (
    <div className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 transition-all hover:bg-white/10 hover:border-hash-primary/30">
      {/* Top accent line */}
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-hash-primary/40 to-transparent" />

      {/* Icon */}
      <div className="mb-6 p-4 inline-flex rounded-2xl bg-hash-primary/10 border border-hash-primary/20 text-hash-primary w-fit">
        {card.icon}
      </div>

      {/* Title + Tagline */}
      <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-hash-primary transition-colors">
        {card.title}
      </h3>
      <p className="text-xs font-mono text-hash-primary/70 mb-4 tracking-wide uppercase">
        {card.tagline}
      </p>

      {/* Description */}
      <p className="text-slate-400 text-sm leading-relaxed flex-1">
        {card.description}
      </p>

      {/* Stat */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <span className="text-3xl font-bold text-hash-primary">{card.stat}</span>
        <p className="text-xs text-slate-500 mt-1">{card.statLabel}</p>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-hash-primary/0 via-hash-primary/3 to-hash-primary/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}

export default ThreePanelCardDesign;
