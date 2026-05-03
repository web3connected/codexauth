'use client';

import React from 'react';
import Link from 'next/link';

export interface TierCard {
  name: string;
  /** Icon displayed top-right of the card */
  icon: React.ReactNode;
  /** Primary stat value e.g. "256-bit" */
  stat: string;
  /** Label under stat e.g. "64 hex characters per hash" */
  statLabel: string;
  /** Small label shown alongside the card name e.g. "Standard" */
  badge: string;
  description: string;
  useCases: string[];
  /** Makes this card the highlighted / featured card */
  highlight: boolean;
  ctaLabel: string;
  ctaHref: string;
}

export interface TierComparisonGridProps {
  title?: string;
  subtitle?: string;
  /** Small footnote shown below the grid */
  footnote?: string;
  tiers: TierCard[];
}

export const TierComparisonGrid: React.FC<TierComparisonGridProps> = ({
  title = 'Three Security Tiers',
  subtitle,
  footnote,
  tiers,
}) => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>

        {/* Tiers Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
          {tiers.map((tier, index) => (
            <TierCardItem key={index} tier={tier} />
          ))}
        </div>

        {/* Footnote */}
        {footnote && (
          <p className="text-center text-xs text-slate-600 mt-10">{footnote}</p>
        )}
      </div>
    </section>
  );
};

function TierCardItem({ tier }: { tier: TierCard }) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-8 transition-all ${
        tier.highlight
          ? 'border-hash-primary/50 bg-hash-primary/10 shadow-lg shadow-hash-primary/10'
          : 'border-white/10 bg-white/5'
      }`}
    >
      {/* Popular badge */}
      {tier.highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 rounded-full text-xs font-semibold bg-hash-primary text-white shadow-md">
            {tier.badge}
          </span>
        </div>
      )}

      {/* Tier name + icon */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
          {!tier.highlight && (
            <span className="text-xs font-medium text-slate-500 mt-0.5 block">{tier.badge}</span>
          )}
        </div>
        <div className="p-2 rounded-lg bg-hash-primary/10 border border-hash-primary/20 text-hash-primary">
          {tier.icon}
        </div>
      </div>

      {/* Stat box */}
      <div className="mb-6 p-4 rounded-xl bg-black/20 border border-white/5">
        <div className="text-4xl font-bold text-hash-primary">{tier.stat}</div>
        <div className="text-xs text-slate-500 mt-1">{tier.statLabel}</div>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-sm leading-relaxed mb-6">{tier.description}</p>

      {/* Use cases */}
      <ul className="space-y-2 mb-8 flex-1">
        {tier.useCases.map((useCase, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
            <svg
              className="w-4 h-4 text-hash-primary shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {useCase}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href={tier.ctaHref}
        className={`w-full text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all ${
          tier.highlight
            ? 'bg-hash-primary text-white hover:bg-hash-primary/90 hover:shadow-lg hover:shadow-hash-primary/25'
            : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
        }`}
      >
        {tier.ctaLabel}
      </Link>
    </div>
  );
}

export default TierComparisonGrid;
