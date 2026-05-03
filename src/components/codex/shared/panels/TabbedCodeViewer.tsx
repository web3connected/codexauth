'use client';

import React, { useState } from 'react';

export interface TabCodeExample {
  id: string;
  title: string;
  language: string;
  code: string;
}

export interface TabbedCodeViewerProps {
  title: string;
  subtitle?: string;
  examples: TabCodeExample[];
}

export const TabbedCodeViewer: React.FC<TabbedCodeViewerProps> = ({
  title,
  subtitle,
  examples,
}) => {
  const [selected, setSelected] = useState(examples[0]?.id ?? '');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const active = examples.find((e) => e.id === selected) ?? examples[0];

  const copy = () => {
    if (!active) return;
    navigator.clipboard.writeText(active.code);
    setCopiedId(active.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
        {subtitle && <p className="text-xl text-slate-300">{subtitle}</p>}
      </div>

      {/* Tab selector */}
      <div className="flex flex-wrap gap-2">
        {examples.map((ex) => (
          <button
            key={ex.id}
            onClick={() => setSelected(ex.id)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              selected === ex.id
                ? 'bg-hash-primary text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Active example */}
      {active && (
        <div className="bg-slate-800/50 rounded-lg border border-slate-600">
          <div className="flex items-center justify-between p-4 border-b border-slate-600">
            <h3 className="text-lg font-semibold text-white">{active.title}</h3>
            <button
              onClick={copy}
              className="flex items-center gap-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded transition-colors text-slate-300 text-sm"
            >
              {copiedId === active.id ? (
                <>
                  <svg className="w-4 h-4 text-hash-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
          <div className="p-4">
            <pre className="bg-black rounded p-4 overflow-x-auto">
              <code className="text-sm text-hash-primary">{active.code}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabbedCodeViewer;
