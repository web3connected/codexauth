'use client';

import React from 'react';

export interface ApiParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface ApiEndpointItem {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  description: string;
  parameters: ApiParam[];
}

export interface ApiEndpointTablePanelProps {
  title: string;
  subtitle?: string;
  endpoints: ApiEndpointItem[];
}

const methodColors: Record<string, string> = {
  GET:    'bg-blue-600',
  POST:   'bg-green-600',
  PUT:    'bg-yellow-600',
  PATCH:  'bg-orange-600',
  DELETE: 'bg-red-600',
};

export const ApiEndpointTablePanel: React.FC<ApiEndpointTablePanelProps> = ({
  title,
  subtitle,
  endpoints,
}) => {
  return (
    <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
        {subtitle && <p className="text-xl text-slate-300">{subtitle}</p>}
      </div>

      <div className="space-y-8">
        {endpoints.map((ep, i) => (
          <div key={i} className="bg-slate-800/50 rounded-lg border border-slate-600">
            {/* Method + endpoint header */}
            <div className="p-6 border-b border-slate-600">
              <div className="flex items-center gap-4 mb-3">
                <span className={`px-3 py-1 rounded text-sm font-bold text-white ${methodColors[ep.method] ?? 'bg-slate-600'}`}>
                  {ep.method}
                </span>
                <code className="text-hash-secondary font-mono text-lg">{ep.endpoint}</code>
              </div>
              <p className="text-slate-300">{ep.description}</p>
            </div>

            {/* Parameters table */}
            <div className="p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Parameters</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-600 text-left text-slate-400">
                      <th className="pb-2 pr-4">Name</th>
                      <th className="pb-2 pr-4">Type</th>
                      <th className="pb-2 pr-4">Required</th>
                      <th className="pb-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ep.parameters.map((p, pi) => (
                      <tr key={pi} className="border-b border-slate-700">
                        <td className="py-2 pr-4 font-mono text-hash-secondary">{p.name}</td>
                        <td className="py-2 pr-4 text-purple-400">{p.type}</td>
                        <td className="py-2 pr-4">
                          <span className={`px-2 py-0.5 rounded text-xs text-white ${p.required ? 'bg-red-600' : 'bg-slate-600'}`}>
                            {p.required ? 'Required' : 'Optional'}
                          </span>
                        </td>
                        <td className="py-2 text-slate-300">{p.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiEndpointTablePanel;
