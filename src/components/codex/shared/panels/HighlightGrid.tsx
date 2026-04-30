'use client';

import React from 'react';

export interface HighlightCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  /** Optional pill badge e.g. "Future-proof security" or "<10ms generation" */
  highlight?: string;
}

export interface HighlightGridProps {
  title?: string;
  subtitle?: string;
  cards: HighlightCard[];
  /** Tailwind bg class for the section e.g. "bg-orange-950/40" */
  background?: string;
  /** Tailwind color classes for icon container e.g. "bg-orange-900/30 border-orange-700/30 text-orange-500" */
  iconColor?: string;
  /** Tailwind color classes for card hover border e.g. "hover:border-orange-600/30" */
  cardHoverBorder?: string;
  /** Tailwind color for title hover e.g. "group-hover:text-orange-500" */
  titleHoverColor?: string;
  /** Tailwind color classes for highlight badge e.g. "bg-orange-900/30 text-orange-400 border-orange-700/30" */
  badgeColor?: string;
}

export const HighlightGrid: React.FC<HighlightGridProps> = ({
  title = 'Why Choose Us?',
  subtitle,
  cards,
  background = 'bg-orange-950/40',
  iconColor = 'bg-orange-900/30 border-orange-700/30 text-orange-500',
  cardHoverBorder = 'hover:border-orange-600/30',
  titleHoverColor = 'group-hover:text-orange-500',
  badgeColor = 'bg-orange-900/30 text-orange-400 border-orange-700/30',
}) => {
  return (
    <section className={`py-20 lg:py-28 ${background}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {cards.map((card, index) => (
            <HighlightCard
              key={index}
              card={card}
              iconColor={iconColor}
              cardHoverBorder={cardHoverBorder}
              titleHoverColor={titleHoverColor}
              badgeColor={badgeColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

function HighlightCard({
  card,
  iconColor,
  cardHoverBorder,
  titleHoverColor,
  badgeColor,
}: {
  card: HighlightCard;
  iconColor: string;
  cardHoverBorder: string;
  titleHoverColor: string;
  badgeColor: string;
}) {
  return (
    <div
      className={`group relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 ${cardHoverBorder}`}
    >
      {/* Icon */}
      <div className={`mb-4 p-3 inline-flex rounded-xl border ${iconColor}`}>
        {card.icon}
      </div>

      {/* Content */}
      <h3 className={`text-xl font-semibold text-white mb-2 transition-colors ${titleHoverColor}`}>
        {card.title}
      </h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">{card.description}</p>

      {/* Highlight Badge */}
      {card.highlight && (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${badgeColor}`}>
          {card.highlight}
        </span>
      )}

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-600/0 via-orange-600/5 to-orange-600/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}

export default HighlightGrid;
