'use client';

import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter, faDiscord } from '@fortawesome/free-brands-svg-icons';

const footerLinks = {
  documentation: [
    { label: 'Getting Started', href: '/docs' },
    { label: 'API Reference', href: '/docs' },
    { label: 'Examples', href: '/docs' },
    { label: 'Harmonic Hashing', href: '/docs' },
  ],
  sdks: [
    { label: 'JavaScript / TypeScript', href: 'https://github.com/web3codex/codexauth', external: true },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: 'https://web3connected.com/blog' },
  ],
  legal: [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
};

const socialLinks = {
  github: 'https://github.com/web3codex',
  twitter: 'https://twitter.com/web3codex',
  discord: 'https://discord.gg/web3codex',
};

export default function CodexAuthFooter() {
  return (
    <footer className="bg-auth-bg border-t border-auth-primary/10">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2 mb-8 lg:mb-0">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-auth flex items-center justify-center">
                <span className="text-auth-bg font-brand font-bold text-lg">#</span>
              </div>
              <span className="font-brand text-2xl font-semibold text-auth-primary">
                CodexAuth
              </span>
            </Link>
            <p className="text-foreground/60 text-sm mb-6 max-w-xs">
              Quantum-resistant hashing for the future of secure applications.
            </p>
            <div className="flex items-center gap-4">
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer"
                className="text-foreground/50 hover:text-auth-primary transition-colors" aria-label="GitHub">
                <FontAwesomeIcon icon={faGithub} className="w-5 h-5" />
              </a>
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                className="text-foreground/50 hover:text-auth-primary transition-colors" aria-label="Twitter">
                <FontAwesomeIcon icon={faTwitter} className="w-5 h-5" />
              </a>
              <a href={socialLinks.discord} target="_blank" rel="noopener noreferrer"
                className="text-foreground/50 hover:text-auth-primary transition-colors" aria-label="Discord">
                <FontAwesomeIcon icon={faDiscord} className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Documentation */}
          <div>
            <h3 className="text-foreground font-semibold mb-4 text-sm uppercase tracking-wider">
              Documentation
            </h3>
            <ul className="space-y-3">
              {footerLinks.documentation.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}
                    className="text-foreground/60 hover:text-auth-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SDKs */}
          <div>
            <h3 className="text-foreground font-semibold mb-4 text-sm uppercase tracking-wider">
              SDKs
            </h3>
            <ul className="space-y-3">
              {footerLinks.sdks.map((link) => (
                <li key={link.href}>
                  {'external' in link && link.external ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer"
                      className="text-foreground/60 hover:text-auth-primary transition-colors text-sm">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href}
                      className="text-foreground/60 hover:text-auth-primary transition-colors text-sm">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-foreground font-semibold mb-4 text-sm uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-foreground/60 hover:text-auth-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-foreground font-semibold mb-4 text-sm uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-foreground/60 hover:text-auth-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-foreground/40 text-sm">
            © {new Date().getFullYear()} CodexAuth. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-foreground/40 hover:text-foreground/70 transition-colors text-sm">
              Terms
            </Link>
            <Link href="/privacy" className="text-foreground/40 hover:text-foreground/70 transition-colors text-sm">
              Privacy
            </Link>
            <p className="text-foreground/40 text-sm">
              Part of the{' '}
              <a href="https://web3connected.com" target="_blank" rel="noopener noreferrer"
                className="text-auth-primary/70 hover:text-auth-primary transition-colors">
                Web3Codex
              </a>{' '}
              platform
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
