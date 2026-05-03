import Link from 'next/link';
import React from 'react';

interface ApplicationLogoProps {
    logo: keyof typeof LogoBrands;
    showIcon?: boolean;
    showText?: boolean;
    href?: string;
    size?: 'sm' | 'md' | 'lg';
}

const LogoBrands = {
    Web3Connected:  { pre: 'Web3',    post: 'Connected', glow: '#06b6d4' },
    CodexTime:      { pre: 'Codex',   post: 'Time',      glow: '#a855f7' },
    CodexPulse:     { pre: 'Codex',   post: 'Pulse',     glow: '#f59e0b' },
    CodexHash:      { pre: 'Codex',   post: 'Hash',      glow: '#f59e0b' },
    CodexIdentity:  { pre: 'Codex',   post: 'Identity',  glow: '#22c55e' },
    CodexAuth:      { pre: 'Codex',   post: 'Auth',      glow: '#3b82f6' },
    CodexSecure:    { pre: 'Codex',   post: 'Secure',    glow: '#ef4444' },
    CodexMind:      { pre: 'Codex',   post: 'Mind',      glow: '#22d3ee' },
    ChappieWallet:  { pre: 'Chappie', post: 'Wallet',    glow: '#818cf8' },
} as const;

const sizeMap = {
    sm: { disc: 32, text: 'text-lg'   },
    md: { disc: 44, text: 'text-2xl'  },
    lg: { disc: 56, text: 'text-3xl'  },
};

/** Inline SVG — circuit chip (QFP package style) on a 40×40 viewBox.
 *  Uses currentColor for all glowing elements so the parent's `color`
 *  CSS property drives the brand accent. */
function CircuitChipSVG() {
    return (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '100%' }}>

            {/* ── Ambient glow behind chip ─────────────────────────────── */}
            <circle cx="20" cy="20" r="9.5" fill="currentColor" opacity="0.14" />

            {/* ── Chip body ────────────────────────────────────────────── */}
            <rect x="12" y="12" width="16" height="16" rx="1.5" fill="#0b1424" />
            <rect x="12" y="12" width="16" height="16" rx="1.5"
                stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />

            {/* Pin 1 orientation dot (top-left corner of chip) */}
            <circle cx="13.6" cy="13.6" r="0.65" fill="currentColor" opacity="0.65" />

            {/* ── QFP Pin leads (dark metallic) ────────────────────────── */}
            {/* Left  — 3 pins */}
            <rect x="7.5"  y="15.1"  width="4.5" height="1.3" rx="0.4" fill="#1a2d45" />
            <rect x="7.5"  y="19.35" width="4.5" height="1.3" rx="0.4" fill="#1a2d45" />
            <rect x="7.5"  y="23.6"  width="4.5" height="1.3" rx="0.4" fill="#1a2d45" />
            {/* Right — 3 pins */}
            <rect x="28"   y="15.1"  width="4.5" height="1.3" rx="0.4" fill="#1a2d45" />
            <rect x="28"   y="19.35" width="4.5" height="1.3" rx="0.4" fill="#1a2d45" />
            <rect x="28"   y="23.6"  width="4.5" height="1.3" rx="0.4" fill="#1a2d45" />
            {/* Top   — 3 pins */}
            <rect x="15.1"  y="7.5"  width="1.3" height="4.5" rx="0.4" fill="#1a2d45" />
            <rect x="19.35" y="7.5"  width="1.3" height="4.5" rx="0.4" fill="#1a2d45" />
            <rect x="23.6"  y="7.5"  width="1.3" height="4.5" rx="0.4" fill="#1a2d45" />
            {/* Bottom — 3 pins */}
            <rect x="15.1"  y="28"   width="1.3" height="4.5" rx="0.4" fill="#1a2d45" />
            <rect x="19.35" y="28"   width="1.3" height="4.5" rx="0.4" fill="#1a2d45" />
            <rect x="23.6"  y="28"   width="1.3" height="4.5" rx="0.4" fill="#1a2d45" />

            {/* ── Internal circuit traces (lit in brand color) ──────────── */}

            {/* Outer ring trace connecting corner nodes */}
            <rect x="15.5" y="15.5" width="9" height="9" rx="0.5"
                fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />

            {/* Corner nodes */}
            <circle cx="15.5" cy="15.5" r="0.9" fill="currentColor" opacity="0.78" />
            <circle cx="24.5" cy="15.5" r="0.9" fill="currentColor" opacity="0.78" />
            <circle cx="15.5" cy="24.5" r="0.9" fill="currentColor" opacity="0.78" />
            <circle cx="24.5" cy="24.5" r="0.9" fill="currentColor" opacity="0.78" />

            {/* Center hub — brightest point */}
            <circle cx="20" cy="20" r="1.5" fill="currentColor" opacity="1" />

            {/* Diagonal traces: corners → center */}
            <line x1="16.15" y1="16.15" x2="18.85" y2="18.85"
                stroke="currentColor" strokeWidth="0.5" opacity="0.45" />
            <line x1="23.85" y1="16.15" x2="21.15" y2="18.85"
                stroke="currentColor" strokeWidth="0.5" opacity="0.45" />
            <line x1="16.15" y1="23.85" x2="18.85" y2="21.15"
                stroke="currentColor" strokeWidth="0.5" opacity="0.45" />
            <line x1="23.85" y1="23.85" x2="21.15" y2="21.15"
                stroke="currentColor" strokeWidth="0.5" opacity="0.45" />

            {/* Short traces from corner nodes to chip body edge (pin routing) */}
            <line x1="15.5" y1="15.5" x2="12" y2="15.75"
                stroke="currentColor" strokeWidth="0.4" opacity="0.3" />
            <line x1="24.5" y1="15.5" x2="28" y2="15.75"
                stroke="currentColor" strokeWidth="0.4" opacity="0.3" />
            <line x1="15.5" y1="24.5" x2="12" y2="24.25"
                stroke="currentColor" strokeWidth="0.4" opacity="0.3" />
            <line x1="24.5" y1="24.5" x2="28" y2="24.25"
                stroke="currentColor" strokeWidth="0.4" opacity="0.3" />
        </svg>
    );
}

const ApplicationLogo: React.FC<ApplicationLogoProps> = ({
    logo,
    showIcon = true,
    showText = true,
    href = '/',
    size = 'md',
}) => {
    const brand = LogoBrands[logo];
    const { disc: discSize, text: textSize } = sizeMap[size];

    if (!brand) {
        return <div className="text-red-500">Invalid logo: {logo}</div>;
    }

    const { glow } = brand;

    return (
        <Link href={href} className="flex items-center gap-3 group">

            {/* ── Glass disc container ─────────────────────────────────── */}
            {showIcon && (
                <div
                    className="rounded-full flex items-center justify-center shrink-0 relative overflow-hidden
                                transition-all duration-500 group-hover:scale-105"
                    style={{
                        width:  discSize,
                        height: discSize,
                        /* Sets currentColor for the child SVG */
                        color: glow,
                        /* Tinted glass background — radial, offset toward top-left */
                        background: `radial-gradient(circle at 38% 32%,
                            ${glow}28 0%,
                            ${glow}0c 50%,
                            rgba(0,0,0,0.55) 100%)`,
                        border: '1px solid rgba(255,255,255,0.16)',
                        boxShadow: [
                            `0 0 20px ${glow}38`,   /* outer ambient glow   */
                            `0 0 6px  ${glow}22`,   /* close halo           */
                            'inset 0 1px 0 rgba(255,255,255,0.13)',  /* top rim light */
                            'inset 0 -1px 0 rgba(0,0,0,0.35)',       /* bottom shadow */
                        ].join(', '),
                    }}
                >
                    {/* Glass specular highlight (top-left ellipse) */}
                    <div
                        className="absolute pointer-events-none"
                        style={{
                            top:    '4%',
                            left:   '7%',
                            width:  '58%',
                            height: '46%',
                            background: 'radial-gradient(ellipse at 42% 32%, rgba(255,255,255,0.18) 0%, transparent 68%)',
                            borderRadius: '50%',
                        }}
                    />

                    {/* Circuit chip SVG with glow drop-shadow */}
                    <div
                        style={{
                            width:  discSize * 0.84,
                            height: discSize * 0.84,
                            filter: `drop-shadow(0 0 ${Math.round(discSize * 0.09)}px ${glow})
                                     drop-shadow(0 0 ${Math.round(discSize * 0.04)}px ${glow}99)`,
                        }}
                    >
                        <CircuitChipSVG />
                    </div>
                </div>
            )}

            {/* ── Brand text ───────────────────────────────────────────── */}
            {showText && (
                <div className={`brand-text ${textSize} font-bold leading-none`}>
                    <span className="text-trinary">{brand.pre}</span>
                    <span className="text-brand-codex">{brand.post}</span>
                </div>
            )}
        </Link>
    );
};

export default ApplicationLogo;
