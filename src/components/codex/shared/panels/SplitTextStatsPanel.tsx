'use client';

import React from 'react';

export interface StatCard {
  value: string;
  label: string;
  color?: string;
}

export interface SplitTextStatsPanelProps {
  eyebrow?: string;
  title?: string;
  paragraphs: string[];
  /** Optional word/phrase in paragraphs to highlight with hash-primary color */
  highlight?: string;
  statCards: StatCard[];
}

export const SplitTextStatsPanel: React.FC<SplitTextStatsPanelProps> = ({
  eyebrow,
  title,
  paragraphs,
  highlight,
  statCards,
}) => {
  return (
    <section className="py-20 lg:py-28 bg-hash-bg">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            {eyebrow && (
              <p className="text-xs font-mono text-hash-primary/60 tracking-widest uppercase mb-3">{eyebrow}</p>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{title}</h2>
            )}
            {paragraphs.map((para, i) => {
              if (highlight && para.includes(highlight)) {
                const [before, after] = para.split(highlight);
                return (
                  <p key={i} className="text-slate-400 leading-relaxed mb-4">
                    {before}
                    <span className="text-hash-primary font-medium">{highlight}</span>
                    {after}
                  </p>
                );
              }
              return (
                <p key={i} className="text-slate-400 leading-relaxed mb-4">{para}</p>
              );
            })}
          </div>

          <div className="space-y-4">
            {statCards.map((card) => (
              <div
                key={card.value}
                className="group relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/8 hover:border-hash-primary/30 transition-all"
              >
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-hash-primary/40 to-transparent" />
                <div className={`text-3xl font-bold font-mono mb-1 ${card.color ?? 'text-hash-primary'}`}>
                  {card.value}
                </div>
                <p className="text-sm text-slate-500">{card.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
