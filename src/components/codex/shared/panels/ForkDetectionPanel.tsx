'use client';

import React from 'react';

export interface ForkMethod {
  name: string;
  description: string;
  code: string;
}

export interface RecoveryOption {
  strategy: string;
  when: string;
  action: string;
}

export interface ForkDetectionPanelProps {
  title: string;
  subtitle?: string;
  forkMethods: ForkMethod[];
  recoveryOptions: RecoveryOption[];
  recoveryTitle?: string;
}

export const ForkDetectionPanel: React.FC<ForkDetectionPanelProps> = ({
  title,
  subtitle,
  forkMethods,
  recoveryOptions,
  recoveryTitle = 'Recovery Strategies',
}) => {
  return (
    <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
        {subtitle && <p className="text-xl text-slate-300">{subtitle}</p>}
      </div>

      {/* What is a fork */}
      <div className="bg-yellow-900/10 rounded-lg border border-yellow-500/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-3">What Is a Fork?</h3>
        <p className="text-slate-300 text-sm mb-4">
          A fork occurs when a single event history splits into two (or more) valid but different chains. Both branches are
          cryptographically valid — they represent conflicting versions of the same history.
        </p>
        {/* ASCII chain diagram */}
        <pre className="bg-black/50 rounded p-4 text-xs font-mono text-slate-300 overflow-x-auto">{`Shared origin:    Event_1 → HASH_001

Branch A (main):  Event_2_A → Event_3_A → Event_4_A
                  Hash_002_A → Hash_003_A → Hash_004_A

Branch B (fork):  Event_2_B → Event_3_B → Event_4_B
                  Hash_002_B → Hash_003_B → Hash_004_B

Both are cryptographically valid — but represent different realities.`}</pre>
      </div>

      {/* Causes */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-3">Common Causes</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          {[
            'Backup restore overwrites recent events',
            'Two systems write concurrently to the same chain',
            'Attacker creates an alternative history branch',
            'Timestamp reset causes time reversal in TIU sequence',
            'Multiple sources of truth claiming authority',
          ].map((cause, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-yellow-400 mt-0.5">⚠</span>
              {cause}
            </li>
          ))}
        </ul>
      </div>

      {/* Detection methods */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Detection Methods</h3>
        <div className="space-y-6">
          {forkMethods.map((method, i) => (
            <div key={i} className="bg-slate-800/50 rounded-lg border border-slate-600 overflow-hidden">
              <div className="p-4 border-b border-slate-600">
                <h4 className="font-semibold text-white">{method.name}</h4>
                <p className="text-slate-300 text-sm mt-1">{method.description}</p>
              </div>
              <div className="p-4">
                <pre className="bg-black rounded p-3 text-hash-primary font-mono text-xs overflow-x-auto">{method.code}</pre>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recovery options */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">{recoveryTitle}</h3>
        <div className="space-y-3">
          {recoveryOptions.map((opt, i) => (
            <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-white">{opt.strategy}</span>
                <span className="text-xs text-slate-400 bg-slate-700 px-2 py-0.5 rounded">{opt.when}</span>
              </div>
              <p className="text-slate-300 text-sm">{opt.action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key point */}
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg border border-blue-500/20 p-5">
        <p className="text-slate-300 text-sm">
          <span className="text-white font-semibold">CodexHash detects forks — it doesn't resolve them.</span>{' '}
          Detection is deterministic and objective: two valid chains with the same origin hash means a fork exists.
          Resolution requires a policy decision about which version of history to accept.
        </p>
      </div>
    </div>
  );
};

export default ForkDetectionPanel;
