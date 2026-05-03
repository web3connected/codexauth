'use client';

import React from 'react';
import Link from 'next/link';

export interface DocSection {
  title: string;
  body: string;
}

export interface DocNavLink {
  label: string;
  href: string;
  /** True for external links */
  external?: boolean;
}

export interface DocumentSectionsPanelProps {
  eyebrow?: string;
  title: string;
  lastUpdated?: string;
  sections: DocSection[];
  navLinks?: DocNavLink[];
}

export const DocumentSectionsPanel: React.FC<DocumentSectionsPanelProps> = ({
  eyebrow = 'Legal',
  title,
  lastUpdated,
  sections,
  navLinks,
}) => {
  return (
    <section className="min-h-screen bg-hash-bg text-foreground">
      <div className="container mx-auto px-4 py-20 max-w-3xl">

        {/* Header */}
        <div className="mb-12 pt-16">
          <p className="text-xs font-mono text-hash-primary/60 tracking-widest uppercase mb-3">
            {eyebrow}
          </p>
          <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
          {lastUpdated && (
            <p className="text-foreground/60 text-sm">
              Last updated: <span className="text-foreground/80">{lastUpdated}</span>
            </p>
          )}
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-semibold text-white mb-3">{section.title}</h2>
              <p className="text-foreground/70 leading-relaxed text-sm">{section.body}</p>
            </div>
          ))}
        </div>

        {/* Footer nav */}
        {navLinks && navLinks.length > 0 && (
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap gap-6 text-sm">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-hash-primary/70 hover:text-hash-primary transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-hash-primary/70 hover:text-hash-primary transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        )}

      </div>
    </section>
  );
};
