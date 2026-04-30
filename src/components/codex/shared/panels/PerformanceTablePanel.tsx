'use client';

import React from 'react';

export interface PerformanceKpi {
  icon: React.ReactNode;
  value: string;
  label: string;
}

export interface PerformanceTableRow {
  /** First column — e.g. "256-bit" */
  label: string;
  /** Tailwind color class for the label */
  labelColor?: string;
  cells: string[];
}

export interface OptimizationList {
  title: string;
  items: string[];
}

export interface PerformanceTablePanelProps {
  title: string;
  subtitle?: string;
  kpis: PerformanceKpi[];
  tableTitle?: string;
  tableHeaders: string[];
  tableRows: PerformanceTableRow[];
  optimizations?: OptimizationList[];
}

export const PerformanceTablePanel: React.FC<PerformanceTablePanelProps> = ({
  title,
  subtitle,
  kpis,
  tableTitle = 'Performance by Configuration',
  tableHeaders,
  tableRows,
  optimizations = [],
}) => {
  return (
    <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
        {subtitle && <p className="text-xl text-slate-300">{subtitle}</p>}
      </div>

      {/* KPI cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-slate-800/50 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">{kpi.icon}</div>
            <div className="text-2xl font-bold text-white mb-1">{kpi.value}</div>
            <p className="text-slate-300 text-sm">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div>
        <h3 className="text-2xl font-semibold text-white mb-4">{tableTitle}</h3>
        <div className="overflow-x-auto">
          <table className="w-full bg-slate-800/50 rounded-lg text-sm">
            <thead>
              <tr className="border-b border-slate-600 text-left text-slate-400">
                {tableHeaders.map((h, i) => (
                  <th key={i} className="p-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, ri) => (
                <tr key={ri} className="border-b border-slate-700">
                  <td className={`p-4 font-semibold ${row.labelColor ?? 'text-white'}`}>{row.label}</td>
                  {row.cells.map((cell, ci) => (
                    <td key={ci} className="p-4 text-slate-300">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optimization lists */}
      {optimizations.length > 0 && (
        <div className={`grid md:grid-cols-${optimizations.length} gap-6`}>
          {optimizations.map((opt, i) => (
            <div key={i} className="bg-slate-800/50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-3">{opt.title}</h4>
              <ul className="space-y-2 text-slate-300 text-sm">
                {opt.items.map((item, ii) => (
                  <li key={ii}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PerformanceTablePanel;
