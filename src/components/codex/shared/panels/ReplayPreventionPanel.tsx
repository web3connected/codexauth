'use client';

import React from 'react';

export interface ContextInput {
  field: string;
  required: boolean;
  example: string;
  purpose: string;
}

export interface ReplayPreventionPanelProps {
  title: string;
  subtitle?: string;
  contextInputs: ContextInput[];
  codeExample?: string;
}

export const ReplayPreventionPanel: React.FC<ReplayPreventionPanelProps> = ({
  title,
  subtitle,
  contextInputs,
  codeExample,
}) => {
  return (
    <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
        {subtitle && <p className="text-xl text-slate-300">{subtitle}</p>}
      </div>

      {/* What is a replay attack */}
      <div className="bg-red-900/10 rounded-lg border border-red-500/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-3">What Is a Replay Attack?</h3>
        <p className="text-slate-300 text-sm mb-4">
          An attacker captures a valid hash and reuses it in a different context to trick the system into accepting invalid data.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Legitimate</p>
            <pre className="bg-black/50 rounded p-3 text-green-400 text-xs overflow-x-auto">{`Event:  "Alice approves $100"
TIU:    0.618034
Hash:   HASH_001 ✅`}</pre>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Replay Attempt</p>
            <pre className="bg-black/50 rounded p-3 text-red-400 text-xs overflow-x-auto">{`Event:  "Bob approves $100"
TIU:    0.618034   ← same TIU
Hash:   HASH_001   ← reused ❌`}</pre>
          </div>
        </div>
      </div>

      {/* What to include in hash input */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">What to Include in Hash Input</h3>
        <p className="text-slate-400 text-sm mb-4">
          CodexHash doesn't prevent replay by itself — it detects it when you include the right context fields:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full bg-slate-800/50 rounded-lg text-sm">
            <thead>
              <tr className="border-b border-slate-600 text-left text-slate-400">
                <th className="p-4">Field</th>
                <th className="p-4">Required</th>
                <th className="p-4">Example</th>
                <th className="p-4">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {contextInputs.map((input) => (
                <tr key={input.field} className="border-b border-slate-700">
                  <td className="p-4 font-mono text-hash-secondary text-xs">{input.field}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-xs ${input.required ? 'bg-red-600 text-white' : 'bg-slate-600 text-slate-300'}`}>
                      {input.required ? 'Required' : 'Optional'}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-400 text-xs">{input.example}</td>
                  <td className="p-4 text-slate-300">{input.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hash computation structure */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-3">Hash Computation Structure</h3>
        <pre className="bg-black rounded-lg p-4 text-hash-primary font-mono text-sm overflow-x-auto">{`hash = SHA3-512(
    domain_tag      // CODEXHASH|ENTERPRISE|
  + context_tag     // CONTEXT|transfer|USD|
  + prev_hash       // links to prior event
  + event_data      // the actual payload
  + tiu             // time integrity unit
)`}</pre>
      </div>

      {/* Custom code example */}
      {codeExample && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Example</h3>
          <pre className="bg-black rounded-lg p-4 text-hash-primary font-mono text-sm overflow-x-auto">{codeExample}</pre>
        </div>
      )}

      {/* Why it works */}
      <div className="bg-green-900/10 rounded-lg border border-green-500/20 p-5">
        <h4 className="font-semibold text-white mb-2">Why replay fails</h4>
        <p className="text-slate-300 text-sm">
          The <code className="text-hash-secondary font-mono text-xs">context_tag</code> and{' '}
          <code className="text-hash-secondary font-mono text-xs">tiu</code> fields change the hash output even for identical
          event data. A hash computed for <code className="text-slate-400 font-mono text-xs">"CONTEXT|transfer|USD|"</code> cannot
          be reused in a <code className="text-slate-400 font-mono text-xs">"CONTEXT|transfer|JPY|"</code> context — the resulting
          hash is entirely different.
        </p>
      </div>
    </div>
  );
};

export default ReplayPreventionPanel;
