'use client';

import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter, faDiscord, faLinkedin } from '@fortawesome/free-brands-svg-icons';

export interface GlobalFooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface GlobalFooterProps {
  /** Object keys become column headings, values are the link lists */
  links: Record<string, GlobalFooterLink[]>;
  socialLinks?: {
    github?: string;
    twitter?: string;
    discord?: string;
    linkedin?: string;
  };
  /** Content rendered inside the logo square, e.g. <span>#</span> */
  brandLogoContent: React.ReactNode;
  brandName: string;
  brandTagline: string;
  brandHref?: string;
  /** Copyright owner name, e.g. "CodexHash" */
  serviceName?: string;
  platformName?: string;
  platformHref?: string;
  year?: number;
  /** Tailwind class for footer background, e.g. "bg-hash-bg" */
  bgClass?: string;
  /** Tailwind class for top border, e.g. "border-hash-primary/10" */
  borderClass?: string;
  /** Tailwind class for logo square bg, e.g. "bg-gradient-hash" */
  logoBgClass?: string;
  /** Tailwind class for logo text/icon colour, e.g. "text-hash-bg" */
  logoTextClass?: string;
  /** Full hover class for link accent, e.g. "hover:text-hash-primary" */
  accentHoverClass?: string;
  /** Text class for platform link, e.g. "text-hash-primary" */
  accentTextClass?: string;
}

export function GlobalFooter({
  links,
  socialLinks = {},
  brandLogoContent,
  brandName,
  brandTagline,
  brandHref = '/',
  serviceName,
  platformName = 'Web3Codex',
  platformHref = 'https://web3connected.com',
  year = new Date().getFullYear(),
  bgClass = 'bg-background',
  borderClass = 'border-primary/10',
  logoBgClass = 'bg-primary',
  logoTextClass = 'text-primary-foreground',
  accentHoverClass = 'hover:text-primary',
  accentTextClass = 'text-primary',
}: GlobalFooterProps) {
  const columns = Object.entries(links);
  const copyright = serviceName ?? brandName;

  return (
    <footer className={`${bgClass} border-t ${borderClass}`}>
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2 mb-8 lg:mb-0">
            <Link href={brandHref as any} className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg ${logoBgClass} flex items-center justify-center`}>
                <span className={`${logoTextClass} font-bold text-lg`}>{brandLogoContent}</span>
              </div>
              <span className="font-brand text-2xl font-semibold text-foreground">
                {brandName}
              </span>
            </Link>
            <p className="text-foreground/60 text-sm mb-6 max-w-xs leading-relaxed">
              {brandTagline}
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.github && (
                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer"
                  className={`text-foreground/50 ${accentHoverClass} transition-colors`} aria-label="GitHub">
                  <FontAwesomeIcon icon={faGithub} className="w-5 h-5" />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                  className={`text-foreground/50 ${accentHoverClass} transition-colors`} aria-label="Twitter">
                  <FontAwesomeIcon icon={faTwitter} className="w-5 h-5" />
                </a>
              )}
              {socialLinks.discord && (
                <a href={socialLinks.discord} target="_blank" rel="noopener noreferrer"
                  className={`text-foreground/50 ${accentHoverClass} transition-colors`} aria-label="Discord">
                  <FontAwesomeIcon icon={faDiscord} className="w-5 h-5" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                  className={`text-foreground/50 ${accentHoverClass} transition-colors`} aria-label="LinkedIn">
                  <FontAwesomeIcon icon={faLinkedin} className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Dynamic link columns */}
          {columns.map(([heading, items]) => (
            <div key={heading}>
              <h3 className="text-foreground font-semibold mb-4 text-sm uppercase tracking-wider">
                {heading}
              </h3>
              <ul className="space-y-3">
                {items.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer"
                        className={`text-foreground/60 ${accentHoverClass} transition-colors text-sm`}>
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href as any}
                        className={`text-foreground/60 ${accentHoverClass} transition-colors text-sm`}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Copyright bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-foreground/40 text-sm">
            &copy; {year} {copyright}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href={'/terms' as any} className="text-foreground/40 hover:text-foreground/70 transition-colors text-sm">
              Terms
            </Link>
            <Link href={'/privacy' as any} className="text-foreground/40 hover:text-foreground/70 transition-colors text-sm">
              Privacy
            </Link>
            <p className="text-foreground/40 text-sm">
              Part of the{' '}
              <a href={platformHref} target="_blank" rel="noopener noreferrer"
                className={`${accentTextClass} opacity-70 ${accentHoverClass} transition-colors`}>
                {platformName}
              </a>{' '}
              platform
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { GlobalFooter as Footer };
export type { GlobalFooterProps as FooterProps };
export default GlobalFooter;
