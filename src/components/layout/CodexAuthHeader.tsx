'use client';

import React, { useState, useRef, useEffect } from 'react';
import GlobalHeader from '@/components/codex/shared/Header/GlobalHeader';
import ApplicationLogo from '@/components/codex/shared/widgets/ApplicationLogo';
import DateGreeterWidget from '@/components/codex/shared/widgets/DateGreeterWidget';
import HeaderActions from '@/components/codex/shared/widgets/HeaderActions';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Documentation', href: '/docs' },
  { label: 'Getting Started', href: '/getting-started' },
];

const sdkItems = [
  { label: 'JavaScript / TypeScript', href: 'https://github.com/web3codex/codexauth', external: true },
];

const CodexAuthNav: React.FC = () => {
  const [sdkOpen, setSdkOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSdkOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className="flex items-center gap-6">
      {navLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="text-sm text-white/70 hover:text-white transition-colors"
        >
          {link.label}
        </a>
      ))}

      {/* SDK dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setSdkOpen((o) => !o)}
          className="flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors"
        >
          SDK
          <svg
            className={`w-3 h-3 transition-transform ${sdkOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {sdkOpen && (
          <div className="absolute top-full right-0 mt-2 w-52 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 py-1">
            {sdkItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                onClick={() => setSdkOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                {item.label}
                {item.external && (
                  <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default function CodexAuthHeader() {
  return (
    <GlobalHeader
      topbarWidgets={[
        {
          slot: 'widget_01',
          name: 'DateGreeter',
          component: DateGreeterWidget,
        },
        {
          slot: 'widget_03',
          name: 'HeaderActions',
          component: HeaderActions,
          props: {
            githubUrl: 'https://github.com/web3codex/codexauth',
            getStartedUrl: 'https://web3connected.com/getting-started/codexauth',
          },
        },
      ]}
      logoWidget={{
        name: 'ApplicationLogo',
        component: ApplicationLogo,
        props: { logo: 'CodexAuth', showIcon: true },
      }}
      navWidget={{
        name: 'CodexAuthNav',
        component: CodexAuthNav,
      }}
    />
  );
}
