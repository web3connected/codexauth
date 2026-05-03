'use client';

import React from 'react';

export interface ChainStep {
  step: number;
  title: string;
  formula?: string;
  description: string;
}

export interface ChainBreaker {
  cause: string;
  explanation: string;
}

export interface HashChainingPanelProps {
  title: string;
  subtitle?: string;
  description?: string;
  chainFormula?: string;
  chainSteps: ChainStep[];
  chainBreakers?: ChainBreaker[];
  breakersTitle?: string;
}

export const HashChainingPanel: React.FC<HashChainingPanelProps> = ({
  title,
  subtitle,
  description,
  chainFormula = 'event_hash = SHA256(payload_hash + prev_event_hash + context)',
  chainSteps,
  chainBreakers = [],
  breakersTitle = 'What Breaks the Chain',
}) => {
  return (
    <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
        {subtitle && <p className="text-xl text-slate-300 mb-2">{subtitle}</p>}
        {description && <p className="text-slate-300">{description}</p>}
      </div>

      {/* Chain formula */}
      <div className="bg-slate-800/60 rounded-lg border border-slate-600 p-6">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Core Formula</h3>
        <pre className="text-hash-primary font-mono text-base overflow-x-auto">{chainFormula}</pre>
      </div>

      {/* Visual chain */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">How the Chain Links</h3>
        <div className="relative space-y-0">
          {chainSteps.map((step, i) => (
            <div key={step.step} className="flex gap-4">
              {/* Connector line */}
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-hash-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {step.step}
                </div>
                {i < chainSteps.length - 1 && (
                  <div className="w-0.5 h-full bg-hash-primary/30 my-1 min-h-[2rem]" />
                )}
              </div>
              {/* Content */}
              <div className="pb-6">
                <h4 className="font-semibold text-white mb-1">{step.title}</h4>
                {step.formula && (
                  <div className="bg-black rounded px-3 py-2 font-mono text-hash-secondary text-sm mb-2 overflow-x-auto">
                    {step.formula}
                  </div>
                )}
                <p className="text-slate-300 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What breaks the chain */}
      {chainBreakers.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">{breakersTitle}</h3>
          <div className="space-y-2">
            {chainBreakers.map((b, i) => (
              <div key={i} className="bg-red-900/10 border border-red-500/20 rounded-lg p-4 flex gap-4">
                <span className="text-red-400 mt-0.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
                <div>
                  <span className="font-semibold text-white">{b.cause}</span>
                  <span className="text-slate-300"> — {b.explanation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No-blockchain callout */}
      <div className="bg-gradient-to-r from-hash-primary/10 to-hash-secondary/10 rounded-lg border border-hash-primary/20 p-5">
        <p className="text-slate-300 text-sm">
          <span className="text-white font-semibold">No blockchain required.</span>{' '}
          Hash chaining provides tamper-evident continuity through pure cryptographic binding — no consensus, no tokens, no wallets.
          Any tampering is instantly detectable by anyone who re-runs the verification.
        </p>
      </div>
    </div>
  );
};

export default HashChainingPanel;
