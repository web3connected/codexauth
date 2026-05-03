'use client';

import React from 'react';

export interface OverviewStatCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface FeatureOverviewPanelProps {
  title: string;
  description: string;
  statCards: OverviewStatCard[];
  /** Checklist section title */
  checklistTitle?: string;
  checklistItems: string[];
}

export const FeatureOverviewPanel: React.FC<FeatureOverviewPanelProps> = ({
  title,
  description,
  statCards,
  checklistTitle = 'Key Features',
  checklistItems,
}) => {
  return (
    <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
        <p className="text-xl text-slate-300">{description}</p>
      </div>

      {/* Stat cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="bg-slate-800/50 rounded-lg p-6">
            <div className="mb-4">{card.icon}</div>
            <h3 className="text-lg font-semibold text-white mb-2">{card.title}</h3>
            <p className="text-slate-300">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Feature checklist */}
      <div className="bg-gradient-to-r from-hash-primary/10 via-hash-accent/10 to-hash-secondary/10 rounded-lg p-6 border border-hash-primary/20">
        <h3 className="text-xl font-semibold text-white mb-4">{checklistTitle}</h3>
        <ul className="grid md:grid-cols-2 gap-3 text-slate-300">
          {checklistItems.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <svg className="w-4 h-4 text-hash-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FeatureOverviewPanel;
