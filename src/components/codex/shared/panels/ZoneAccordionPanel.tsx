'use client';

import React, { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ZoneEntry {
  id: number;
  badge: string;
  name: string;
  tier: string;
  tierColor: string;
  tagline: string;
  description: string;
  methods: string[];
  requirements: { label: string; met: boolean }[];
  useCases: string[];
  defaultOpen?: boolean;
}

export interface ZoneAccordionPanelProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  zones: ZoneEntry[];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MethodPill({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: 'bg-emerald-900/60 text-emerald-300 border-emerald-700',
    POST: 'bg-blue-900/60 text-blue-300 border-blue-700',
    PUT: 'bg-yellow-900/60 text-yellow-300 border-yellow-700',
    PATCH: 'bg-orange-900/60 text-orange-300 border-orange-700',
    DELETE: 'bg-red-900/60 text-red-300 border-red-700',
    HEAD: 'bg-slate-800 text-slate-400 border-slate-600',
    OPTIONS: 'bg-slate-800 text-slate-400 border-slate-600',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold border ${colors[method] ?? 'bg-slate-800 text-slate-400 border-slate-600'}`}
    >
      {method}
    </span>
  );
}

function RequirementTag({ label, met }: { label: string; met: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
        met
          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
          : 'bg-slate-800/60 text-slate-500 border-slate-700 line-through decoration-slate-600'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${met ? 'bg-emerald-400' : 'bg-slate-600'}`} />
      {label}
    </span>
  );
}

function ZoneAccordionItem({
  zone,
  isOpen,
  onToggle,
}: {
  zone: ZoneEntry;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="rounded-xl border transition-all duration-200"
      style={{
        borderColor: isOpen ? `${zone.tierColor}60` : 'rgba(96,165,250,0.25)',
        backgroundColor: isOpen ? `${zone.tierColor}12` : 'rgba(59,130,246,0.08)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 text-left group"
      >
        <span
          className="shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-sm font-black font-mono border"
          style={{
            color: zone.tierColor,
            borderColor: `${zone.tierColor}50`,
            backgroundColor: `${zone.tierColor}12`,
          }}
        >
          {zone.badge}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-white text-base">{zone.name}</span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium border"
              style={{
                color: zone.tierColor,
                borderColor: `${zone.tierColor}40`,
                backgroundColor: `${zone.tierColor}15`,
              }}
            >
              {zone.tier}
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-0.5 truncate">{zone.tagline}</p>
        </div>

        <span
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border"
          style={{
            borderColor: isOpen ? `${zone.tierColor}50` : 'rgba(71,85,105,0.5)',
            backgroundColor: isOpen ? `${zone.tierColor}20` : 'rgba(30,41,59,0.5)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <svg
            className="w-4 h-4"
            style={{ color: isOpen ? zone.tierColor : '#94a3b8' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 border-t" style={{ borderColor: `${zone.tierColor}20` }}>
          <div className="pt-5 grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p className="text-slate-300 text-sm leading-relaxed">{zone.description}</p>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Example Routes</p>
                <ul className="space-y-1">
                  {zone.useCases.map((uc) => (
                    <li key={uc} className="flex items-start gap-2 text-sm text-slate-400">
                      <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: zone.tierColor }} />
                      <code className="font-mono text-xs text-slate-300 bg-slate-800/60 px-1.5 py-0.5 rounded">{uc}</code>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Allowed Methods</p>
                <div className="flex flex-wrap gap-2">
                  {zone.methods.map((m) => (
                    <MethodPill key={m} method={m} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Requirements</p>
                <div className="flex flex-wrap gap-2">
                  {zone.requirements.map((req) => (
                    <RequirementTag key={req.label} label={req.label} met={req.met} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function ZoneAccordionPanel({ eyebrow, title, subtitle, zones }: ZoneAccordionPanelProps) {
  const defaultOpen = zones.find((z) => z.defaultOpen)?.id ?? 1;
  const [openId, setOpenId] = useState<number | null>(defaultOpen);
  const toggle = (id: number) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section
      className="py-20 px-4 relative"
      style={{
        backgroundColor: '#080D1A',
        backgroundImage: 'url(/assets/images/blue-digital-grid-background-network-connection-structure-blue-background-3d-rendering_698341-237.avif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(8,13,26,0.60)' }} />
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#2DF4A1' }}>
            {eyebrow}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-poppins, Poppins, sans-serif)' }}>
            {title}
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
        </div>

        <div className="space-y-3">
          {zones.map((zone) => (
            <ZoneAccordionItem
              key={zone.id}
              zone={zone}
              isOpen={openId === zone.id}
              onToggle={() => toggle(zone.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
