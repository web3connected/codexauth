'use client';

import React from 'react';

export interface SecurityTierItem {
  name: string;
  badge: string;
  bits: number;
  bytes: number;
  hexChars: number;
  rounds: number;
  useCases: string[];
  example: string;
  highlight?: boolean;
}

export interface SecurityTiersPanelProps {
  title: string;
  subtitle?: string;
  tiers: SecurityTierItem[];
  tableTitle?: string;
}

export const SecurityTiersPanel: React.FC<SecurityTiersPanelProps> = ({
  title,
  subtitle,
  tiers,
  tableTitle = 'Tier Comparison',
}) => {
  return (
    <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
        {subtitle && <p className="text-xl text-slate-300">{subtitle}</p>}
      </div>

      {/* Tier cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const highlight = tier.highlight;
          return (
            <div
              key={tier.name}
              className={`rounded-lg p-6 border flex flex-col gap-4 ${
                highlight
                  ? 'bg-gradient-to-br from-hash-primary/10 to-hash-secondary/10 border-hash-primary/40 ring-1 ring-hash-primary/30'
                  : 'bg-slate-800/50 border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      highlight ? 'bg-hash-primary text-white' : 'bg-slate-600 text-slate-300'
                    }`}
                  >
                    {tier.badge}
                  </span>
                </div>
                <div className={`text-4xl font-black mb-1 ${highlight ? 'text-hash-primary' : 'text-white'}`}>
                  {tier.bits}-bit
                </div>
                <p className="text-slate-400 text-xs font-mono">
                  {tier.bytes} bytes · {tier.hexChars} hex chars · {tier.rounds} rounds
                </p>
              </div>

              <ul className="space-y-1 text-sm text-slate-300">
                {tier.useCases.map((uc) => (
                  <li key={uc} className="flex items-start gap-2">
                    <span className="text-hash-primary mt-0.5">✓</span>
                    {uc}
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <p className="text-xs text-slate-500 mb-1">Example output</p>
                <code className="block text-xs text-slate-400 font-mono break-all bg-black/40 rounded px-2 py-1">
                  {tier.example}
                </code>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick comparison table */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">{tableTitle}</h3>
        <div className="overflow-x-auto">
          <table className="w-full bg-slate-800/50 rounded-lg text-sm">
            <thead>
              <tr className="border-b border-slate-600 text-left text-slate-400">
                <th className="p-4">Tier</th>
                <th className="p-4">Bit Length</th>
                <th className="p-4">Hex Chars</th>
                <th className="p-4">Mixing Rounds</th>
                <th className="p-4">Base Algorithm</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier) => (
                <tr key={tier.name} className="border-b border-slate-700">
                  <td className="p-4 font-semibold text-white">{tier.name}</td>
                  <td className="p-4 text-slate-300">{tier.bits}-bit</td>
                  <td className="p-4 text-slate-300">{tier.hexChars}</td>
                  <td className="p-4 text-slate-300">{tier.rounds}</td>
                  <td className="p-4 text-slate-300">SHA3-512</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Domain separation note */}
      <div className="bg-slate-800/40 rounded-lg border border-slate-600 p-5">
        <p className="text-slate-300 text-sm">
          <span className="text-white font-semibold">Domain separation:</span>{' '}
          Each tier uses a unique domain tag (<code className="text-hash-secondary font-mono text-xs">CODEXHASH|ENTERPRISE|</code>)
          prepended to every hash computation. Tiers cannot be cross-validated — an Enterprise hash cannot accidentally pass
          Government verification.
        </p>
      </div>
    </div>
  );
};

export default SecurityTiersPanel;
