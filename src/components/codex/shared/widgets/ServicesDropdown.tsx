'use client';

import React, { useState } from 'react';
import { SERVICES_CONFIG } from '../config/services.config';

interface ServicesDropdownProps {
  /** The id of the current site so it renders a "Current" badge. Matches SERVICES_CONFIG ids. */
  currentService?: string;
}

/**
 * ServicesDropdown — hover-activated nav item that lists every Codex platform service.
 * Drop this as the 3rd item in any portal nav to give users a quick switcher.
 *
 * Usage:
 *   <ServicesDropdown currentService="codex-hash" />
 */
const ServicesDropdown: React.FC<ServicesDropdownProps> = ({ currentService }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Brand dot colours keyed by service id
  const dotColors: Record<string, string> = {
    'web3connected':   '#06b6d4',
    'codex-hash':      '#f59e0b',
    'codex-time':      '#a855f7',
    'codex-secure':    '#ef4444',
    'codex-identity':  '#22c55e',
    'codex-auth':      '#3b82f6',
    'codex-mind':      '#22d3ee',
    'codex-voice':     '#f472b6',
    'codex-trader':    '#10b981',
    'chappie-wallet':  '#818cf8',
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger */}
      <button
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
      >
        Services
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-72 rounded-xl border border-white/10 shadow-2xl z-50 overflow-hidden"
          style={{ background: 'rgba(10,12,20,0.96)', backdropFilter: 'blur(16px)' }}
        >
          <div className="px-3 py-2 border-b border-white/10">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
              Codex Ecosystem
            </span>
          </div>

          <div className="py-1.5">
            {SERVICES_CONFIG.map((service) => {
              const isCurrent = service.id === currentService;
              const dot = dotColors[service.id] || '#6b7280';
              return (
                <a
                  key={service.id}
                  href={service.url}
                  target={isCurrent ? undefined : '_blank'}
                  rel={isCurrent ? undefined : 'noopener noreferrer'}
                  className={`flex items-center gap-3 px-3 py-2 mx-1.5 rounded-lg transition-all duration-150 group ${
                    isCurrent
                      ? 'bg-white/8 cursor-default'
                      : 'hover:bg-white/6'
                  }`}
                >
                  {/* Brand dot */}
                  <span
                    className="flex-shrink-0 w-2 h-2 rounded-full"
                    style={{ background: dot, boxShadow: `0 0 6px ${dot}88` }}
                  />

                  {/* Icon + text */}
                  <span className="text-lg leading-none select-none">{service.icon}</span>
                  <span className="flex-1 min-w-0">
                    <span className={`block text-sm font-medium leading-tight ${
                      isCurrent ? 'text-white' : 'text-white/75 group-hover:text-white'
                    } transition-colors`}>
                      {service.name}
                      {isCurrent && (
                        <span className="ml-2 text-[10px] font-normal text-white/40 align-middle">
                          ← here
                        </span>
                      )}
                    </span>
                    <span className="block text-xs text-white/35 group-hover:text-white/50 transition-colors leading-tight mt-0.5">
                      {service.description}
                    </span>
                  </span>

                  {/* External arrow */}
                  {!isCurrent && (
                    <svg
                      className="flex-shrink-0 w-3 h-3 text-white/20 group-hover:text-white/50 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  )}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesDropdown;
