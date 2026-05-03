'use client';

import React from 'react';

export interface DataConstant {
  name: string;
  value: string;
  usage: string;
}

export interface DataConstantCallout {
  title: string;
  description: string;
  formula?: string;
}

export interface DataConstantsPanelProps {
  title: string;
  subtitle?: string;
  constants: DataConstant[];
  /** Optional highlighted callout box below the grid */
  callout?: DataConstantCallout;
  /** Tailwind accent color for the value text e.g. "text-hash-secondary" */
  valueColor?: string;
}

export const DataConstantsPanel: React.FC<DataConstantsPanelProps> = ({
  title,
  subtitle,
  constants,
  callout,
  valueColor = 'text-hash-secondary',
}) => {
  return (
    <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
        {subtitle && <p className="text-xl text-slate-300">{subtitle}</p>}
      </div>

      {/* 2-col data grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {constants.map((c, i) => (
          <div key={i} className="bg-slate-800/50 rounded-lg p-6 border border-slate-600">
            <h4 className="text-lg font-semibold text-white mb-1">{c.name}</h4>
            <div className={`font-mono text-lg mb-2 ${valueColor}`}>{c.value}</div>
            <p className="text-slate-300 text-sm">{c.usage}</p>
          </div>
        ))}
      </div>

      {/* Optional callout */}
      {callout && (
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-6 border border-purple-500/30">
          <h3 className="text-xl font-semibold text-white mb-3">{callout.title}</h3>
          <p className="text-slate-300 mb-4">{callout.description}</p>
          {callout.formula && (
            <div className="bg-black/50 rounded p-4 font-mono text-hash-primary text-sm">
              {callout.formula}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataConstantsPanel;
