'use client';

import React from 'react';

export interface SecurityStatCard {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  /** Tailwind gradient classes e.g. "from-green-600/20 to-blue-600/20" */
  gradientClass?: string;
  /** Tailwind border class e.g. "border-green-500/30" */
  borderClass?: string;
  /** Tailwind color for value e.g. "text-green-400" */
  valueColor?: string;
}

export interface AttackVectorRow {
  attack: string;
  level: string;
  /** Tailwind color class for the level value e.g. "text-green-400" */
  colorClass: string;
  description: string;
}

export interface AttackVectorPanelProps {
  title: string;
  subtitle?: string;
  statCards: SecurityStatCard[];
  attackTitle?: string;
  attackVectors: AttackVectorRow[];
  recommendationsTitle?: string;
  recommendations?: string[];
}

export const AttackVectorPanel: React.FC<AttackVectorPanelProps> = ({
  title,
  subtitle,
  statCards,
  attackTitle = 'Attack Vector Analysis',
  attackVectors,
  recommendationsTitle = 'Security Recommendations',
  recommendations = [],
}) => {
  return (
    <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
        {subtitle && <p className="text-xl text-slate-300">{subtitle}</p>}
      </div>

      {/* Stat cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${card.gradientClass ?? 'from-slate-700/20 to-slate-600/20'} rounded-lg p-6 border ${card.borderClass ?? 'border-slate-600'}`}
          >
            <div className="mb-4">{card.icon}</div>
            <h3 className="text-lg font-semibold text-white mb-2">{card.title}</h3>
            <div className={`text-3xl font-bold mb-2 ${card.valueColor ?? 'text-white'}`}>{card.value}</div>
            <p className="text-slate-300">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Attack vectors */}
      <div>
        <h3 className="text-2xl font-semibold text-white mb-4">{attackTitle}</h3>
        <div className="space-y-3">
          {attackVectors.map((v, i) => (
            <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-white">{v.attack}</h4>
                <span className={`font-bold ${v.colorClass}`}>{v.level}</span>
              </div>
              <p className="text-slate-300 text-sm">{v.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-lg p-6 border border-orange-500/30">
          <h3 className="text-xl font-semibold text-white mb-3">{recommendationsTitle}</h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            {recommendations.map((rec, i) => (
              <li key={i}>• {rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AttackVectorPanel;
