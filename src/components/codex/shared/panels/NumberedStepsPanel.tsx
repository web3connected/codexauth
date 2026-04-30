'use client';

import React from 'react';

export interface NumberedStep {
  step: number;
  title: string;
  description: string;
  detail: string;
}

export interface NumberedStepsPanelProps {
  title: string;
  subtitle?: string;
  steps: NumberedStep[];
  /** Optional formula lines rendered in a code block */
  formulaTitle?: string;
  formulaLines?: string[];
}

export const NumberedStepsPanel: React.FC<NumberedStepsPanelProps> = ({
  title,
  subtitle,
  steps,
  formulaTitle = 'Formula',
  formulaLines,
}) => {
  return (
    <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
        {subtitle && <p className="text-xl text-slate-300">{subtitle}</p>}
      </div>

      {/* Numbered steps */}
      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.step} className="bg-slate-800/50 rounded-lg p-6 border border-slate-600">
            <div className="flex items-start gap-4">
              <div className="bg-auth-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0 text-sm">
                {step.step}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{step.title}</h3>
                <p className="text-slate-300 mb-2">{step.description}</p>
                <p className="text-sm text-slate-400">{step.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Optional formula block */}
      {formulaLines && formulaLines.length > 0 && (
        <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-600">
          <h3 className="text-xl font-semibold text-white mb-4">{formulaTitle}</h3>
          <div className="bg-black rounded-lg p-4 font-mono text-auth-primary text-sm overflow-x-auto space-y-1">
            {formulaLines.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NumberedStepsPanel;
