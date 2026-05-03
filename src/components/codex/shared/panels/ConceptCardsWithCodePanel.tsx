'use client';

import React from 'react';

export interface ConceptCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface BulletItem {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export interface ConceptCardsWithCodePanelProps {
  title: string;
  subtitle?: string;
  conceptCards: ConceptCard[];
  /** Pre-formatted code / text block */
  codeBlockContent: string;
  /** Section title above the bullet list */
  bulletTitle?: string;
  bulletItems?: BulletItem[];
}

export const ConceptCardsWithCodePanel: React.FC<ConceptCardsWithCodePanelProps> = ({
  title,
  subtitle,
  conceptCards,
  codeBlockContent,
  bulletTitle,
  bulletItems = [],
}) => {
  return (
    <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
        {subtitle && <p className="text-xl text-slate-300">{subtitle}</p>}
      </div>

      {/* Concept cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {conceptCards.map((card, i) => (
          <div key={i} className="bg-slate-800/50 rounded-lg p-6">
            <div className="mb-4">{card.icon}</div>
            <h3 className="text-lg font-semibold text-white mb-2">{card.title}</h3>
            <p className="text-slate-300">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Code block */}
      <div className="bg-black rounded-lg p-6">
        <pre className="text-hash-primary text-sm overflow-x-auto whitespace-pre-wrap">{codeBlockContent}</pre>
      </div>

      {/* Bullet list */}
      {bulletItems.length > 0 && (
        <div className="bg-slate-800/50 rounded-lg p-6">
          {bulletTitle && <h3 className="text-xl font-semibold text-white mb-4">{bulletTitle}</h3>}
          <ul className="space-y-2 text-slate-300">
            {bulletItems.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="shrink-0">{item.icon}</span>
                <span className="font-medium text-white">{item.label}:</span>
                {item.value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ConceptCardsWithCodePanel;
