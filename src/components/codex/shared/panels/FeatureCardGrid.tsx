'use client';

import React from 'react';

export interface SDKCard {
  name: string;
  /** Language/platform label e.g. "JavaScript / TypeScript" */
  language: string;
  /** Any React node — SVG icon, emoji, etc. */
  icon: React.ReactNode;
  description: string;
  version: string;
  href: string;
  /** Tailwind classes for the version badge e.g. "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" */
  badgeColor: string;
}

export interface FeatureCardGridProps {
  title?: string;
  subtitle?: string;
  sdks: SDKCard[];
  /** Text + link for the "View all" CTA at the bottom */
  viewAllLabel?: string;
  viewAllHref?: string;
}

export const FeatureCardGrid: React.FC<FeatureCardGridProps> = ({
  title = 'SDKs & Tools',
  subtitle = 'Official libraries for every major platform and language',
  sdks,
  viewAllLabel = 'View all SDKs & Documentation',
  viewAllHref = '/sdks',
}) => {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-transparent via-hash-primary/5 to-transparent">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* SDK Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {sdks.map((sdk) => (
            <SDKCardItem key={sdk.name} sdk={sdk} />
          ))}
        </div>

        {/* View All CTA */}
        {viewAllHref && (
          <div className="text-center mt-12">
            <a
              href={viewAllHref}
              className="inline-flex items-center gap-2 text-hash-primary hover:text-hash-primary/80 font-medium transition-colors"
            >
              {viewAllLabel}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

function SDKCardItem({ sdk }: { sdk: SDKCard }) {
  return (
    <a
      href={sdk.href}
      className="group block p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-hash-primary/30 hover:scale-[1.02]"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-hash-primary/20 transition-colors shrink-0">
          {sdk.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white group-hover:text-hash-primary transition-colors">
            {sdk.name}
          </h3>
          <p className="text-sm text-slate-500">{sdk.language}</p>
        </div>
      </div>

      <p className="text-sm text-slate-400 mb-4 line-clamp-2">{sdk.description}</p>

      <div className="flex items-center justify-between">
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${sdk.badgeColor}`}>
          v{sdk.version}
        </span>
        <span className="text-sm text-slate-500 group-hover:text-hash-primary transition-colors flex items-center gap-1">
          Learn more
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </a>
  );
}

export default FeatureCardGrid;
