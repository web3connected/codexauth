'use client';

import React, { useState } from 'react';

export interface QuickStartLanguage {
  /** Unique key — must match a key in `codeExamples` */
  id: string;
  /** Display label on the tab, e.g. "JavaScript" */
  name: string;
  /** Short badge shown in the tab, e.g. "JS" */
  icon: string;
}

export interface InstallCommand {
  /** Package manager label, e.g. "npm" */
  manager: string;
  /** Full install command string */
  command: string;
}

export interface CodeBlockQuickStartProps {
  title?: string;
  subtitle?: string;
  /** Map of language id → code snippet string */
  codeExamples: Record<string, string>;
  /** Ordered list of language tabs */
  languages: QuickStartLanguage[];
  /** Install command pills shown below the code block */
  installCommands: InstallCommand[];
}

export const CodeBlockQuickStart: React.FC<CodeBlockQuickStartProps> = ({
  title = 'Quick Start',
  subtitle = 'Get up and running in minutes with our easy-to-use SDKs',
  codeExamples,
  languages,
  installCommands,
}) => {
  const [selectedLang, setSelectedLang] = useState<string>(languages[0]?.id ?? '');
  const [codeCopied, setCodeCopied] = useState(false);

  const handleCodeCopy = async () => {
    const code = codeExamples[selectedLang] ?? '';
    await navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <section className="py-20 lg:py-28 bg-slate-800">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">{subtitle}</p>
          </div>

          {/* Code Block */}
          <div className="rounded-2xl border border-white/10 bg-[#0d1117] overflow-hidden">
            {/* Language Tabs + Copy */}
            <div className="flex items-center gap-1 px-4 pt-4 border-b border-white/10 bg-[#161b22]">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLang(lang.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    selectedLang === lang.id
                      ? 'bg-[#0d1117] text-hash-primary border-t border-x border-white/10 -mb-px'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang.name}
                </button>
              ))}

              <button
                onClick={handleCodeCopy}
                className="ml-auto px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"
              >
                {codeCopied ? (
                  <>
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

            {/* Code Content */}
            <div className="p-6 overflow-x-auto">
              <pre className="text-sm leading-relaxed font-mono">
                <code className="text-slate-300">{codeExamples[selectedLang]}</code>
              </pre>
            </div>
          </div>

          {/* Install Command Pills */}
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {installCommands.map((cmd) => (
              <InstallPill key={cmd.manager} manager={cmd.manager} command={cmd.command} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

function InstallPill({ manager, command }: { manager: string; command: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white/5 border border-white/10 group">
      <span className="text-xs text-hash-primary font-semibold uppercase shrink-0">{manager}</span>
      <code className="text-xs text-slate-400 truncate flex-1">{command}</code>
      <button
        onClick={handleCopy}
        aria-label={`Copy ${manager} install command`}
        className="text-slate-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
      >
        {copied ? (
          <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default CodeBlockQuickStart;
