'use client';

import React, { useState } from 'react';
import type { ZoneEntry } from './ZoneAccordionPanel';

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

function ZoneItem({
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
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <span
          className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xs font-black font-mono border"
          style={{
            color: zone.tierColor,
            borderColor: `${zone.tierColor}50`,
            backgroundColor: `${zone.tierColor}12`,
          }}
        >
          {zone.badge}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white text-sm">{zone.name}</span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-medium border"
              style={{
                color: zone.tierColor,
                borderColor: `${zone.tierColor}40`,
                backgroundColor: `${zone.tierColor}15`,
              }}
            >
              {zone.tier}
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5 truncate">{zone.tagline}</p>
        </div>

        <span
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 border"
          style={{
            borderColor: isOpen ? `${zone.tierColor}50` : 'rgba(71,85,105,0.5)',
            backgroundColor: isOpen ? `${zone.tierColor}20` : 'rgba(30,41,59,0.5)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <svg
            className="w-3.5 h-3.5"
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
        <div className="px-4 pb-4 border-t" style={{ borderColor: `${zone.tierColor}20` }}>
          <div className="pt-4 space-y-4">
            <p className="text-slate-300 text-xs leading-relaxed">{zone.description}</p>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Methods</p>
                <div className="flex flex-wrap gap-1.5">
                  {zone.methods.map((m) => (
                    <MethodPill key={m} method={m} />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Requirements</p>
                <div className="flex flex-wrap gap-1.5">
                  {zone.requirements.map((req) => (
                    <RequirementTag key={req.label} label={req.label} met={req.met} />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Example Routes</p>
                <ul className="space-y-1">
                  {zone.useCases.slice(0, 3).map((uc) => (
                    <li key={uc} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: zone.tierColor }} />
                      <code className="text-[10px] font-mono text-slate-300 bg-slate-800/60 px-1.5 py-0.5 rounded">{uc}</code>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ZoneColumn({ zones }: { zones: ZoneEntry[] }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const toggle = (id: number) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="space-y-2">
      {zones.map((zone) => (
        <ZoneItem
          key={zone.id}
          zone={zone}
          isOpen={openId === zone.id}
          onToggle={() => toggle(zone.id)}
        />
      ))}
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export interface ZoneDualAccordionPanelProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  zones: ZoneEntry[];
}

export function ZoneDualAccordionPanel({ eyebrow, title, subtitle, zones }: ZoneDualAccordionPanelProps) {
  const firstHalf = zones.slice(0, Math.ceil(zones.length / 2));
  const secondHalf = zones.slice(Math.ceil(zones.length / 2));

  return (
    <section
      className="py-20 px-4 relative"
      style={{
        backgroundColor: '#080D1A',
        backgroundImage: 'url(/assets/images/blue-digital-grid-background-network-connection-structure-blue-background-3d-rendering_698341-237.avif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(8,13,26,0.62)' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#00E4FF' }}>
            {eyebrow}
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-poppins, Poppins, sans-serif)' }}
          >
            {title}
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ZoneColumn zones={firstHalf} />
          <ZoneColumn zones={secondHalf} />
        </div>
      </div>
    </section>
  );
}
