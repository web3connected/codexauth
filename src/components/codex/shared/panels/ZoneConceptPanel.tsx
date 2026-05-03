import React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Pillar {
  icon: string;
  label: string;
  description: string;
}

export interface ZoneConceptPanelProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  body: string[];
  pillars: Pillar[];
}

// ─── Icon map (inline SVGs, no extra dep) ────────────────────────────────────

function PillarIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    layers: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    shield: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    'git-branch': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 3v12M18 9a3 3 0 100-6 3 3 0 000 6zM6 21a3 3 0 100-6 3 3 0 000 6zM18 9c0 3.314-5.373 6-12 6" />
      </svg>
    ),
    zap: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  };
  return <>{icons[name] ?? icons['zap']}</>;
}

// ─── Nested zone visualiser ───────────────────────────────────────────────────

function ZoneNestDiagram() {
  const outerZones = [
    { badge: 'Z4', color: '#00E4FF', label: 'Protected' },
    { badge: 'Z8', color: '#A78BFA', label: 'Payments' },
    { badge: 'Z12', color: '#F59E0B', label: 'Admin' },
  ];
  const innerBadges = ['Z1', 'Z4', 'Z6', 'Z8', 'Z12'];

  return (
    <div className="flex flex-col gap-4">
      {outerZones.map((outer) => (
        <div
          key={outer.badge}
          className="rounded-xl border p-4"
          style={{ borderColor: `${outer.color}40`, backgroundColor: `${outer.color}08` }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs font-black font-mono px-2 py-0.5 rounded border"
              style={{ color: outer.color, borderColor: `${outer.color}50`, backgroundColor: `${outer.color}15` }}
            >
              {outer.badge}
            </span>
            <span className="text-xs text-slate-400">{outer.label} — its own internal framework:</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {innerBadges.map((b) => (
              <span
                key={b}
                className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border"
                style={{ color: outer.color, borderColor: `${outer.color}30`, backgroundColor: `${outer.color}10` }}
              >
                {b}
              </span>
            ))}
            <span className="text-[10px] text-slate-500 ml-1">+ more…</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function ZoneConceptPanel({ eyebrow, title, subtitle, body, pillars }: ZoneConceptPanelProps) {
  return (
    <section
      className="py-20 px-4 relative"
      style={{
        backgroundColor: '#060B16',
        backgroundImage: 'url(/assets/images/blue-digital-grid-background-network-connection-structure-blue-background-3d-rendering_698341-237.avif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(6,11,22,0.68)' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#2DF4A1' }}>
            {eyebrow}
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-3"
            style={{ fontFamily: 'var(--font-poppins, Poppins, sans-serif)' }}
          >
            {title}
          </h2>
          <p className="text-slate-400 text-lg">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start mb-14">
          <div className="space-y-5">
            {body.map((para, i) => (
              <p key={i} className="text-slate-300 text-sm leading-relaxed">
                {para}
              </p>
            ))}
          </div>
          <ZoneNestDiagram />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((p) => (
            <div
              key={p.label}
              className="rounded-xl border p-5 flex flex-col gap-3"
              style={{
                borderColor: 'rgba(96,165,250,0.25)',
                backgroundColor: 'rgba(59,130,246,0.07)',
                backdropFilter: 'blur(6px)',
              }}
            >
              <span
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(45,244,161,0.12)', color: '#2DF4A1' }}
              >
                <PillarIcon name={p.icon} />
              </span>
              <div>
                <p className="font-semibold text-white text-sm mb-1">{p.label}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
