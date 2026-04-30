'use client'

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { footerNavigation, CODEXHASH_SOCIAL_LINKS } from '@/config/navigation';

export default function CodexHashFooter() {
  return (
    <footer className="bg-hash-bg border-t border-hash-primary/10">
      <div className="container mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-hash flex items-center justify-center">
                <span className="text-hash-bg font-brand font-bold text-lg">#</span>
              </div>
              <span className="font-brand text-2xl font-semibold text-hash-primary">
                CodexHash
              </span>
            </Link>
            <p className="text-foreground/60 text-sm mb-6 max-w-xs">
              Quantum-resistant hashing for the future of secure applications.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href={CODEXHASH_SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/50 hover:text-hash-primary transition-colors"
                aria-label="GitHub"
              >
                <FontAwesomeIcon icon={faGithub} className="w-5 h-5" />
              </a>
              <a
                href={CODEXHASH_SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/50 hover:text-hash-primary transition-colors"
                aria-label="Twitter"
              >
                <FontAwesomeIcon icon={faTwitter} className="w-5 h-5" />
              </a>
              <a
                href={CODEXHASH_SOCIAL_LINKS.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/50 hover:text-hash-primary transition-colors"
                aria-label="Discord"
              >
                <FontAwesomeIcon icon={faDiscord} className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Documentation Links */}
          <div>
            <h3 className="text-foreground font-semibold mb-4 text-sm uppercase tracking-wider">
              Documentation
            </h3>
            <ul className="space-y-3">
              {footerNavigation.documentation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-foreground/60 hover:text-hash-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SDKs Links */}
          <div>
            <h3 className="text-foreground font-semibold mb-4 text-sm uppercase tracking-wider">
              SDKs
            </h3>
            <ul className="space-y-3">
              {footerNavigation.sdks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-foreground/60 hover:text-hash-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-foreground font-semibold mb-4 text-sm uppercase tracking-wider">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerNavigation.resources.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/60 hover:text-hash-primary transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-foreground/60 hover:text-hash-primary transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-foreground font-semibold mb-4 text-sm uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-3">
              {footerNavigation.company.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/60 hover:text-hash-primary transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-foreground/60 hover:text-hash-primary transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-hash-primary/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-foreground/50 text-sm">
            © {new Date().getFullYear()} Web3Connected. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-foreground/50 hover:text-hash-primary transition-colors text-sm"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-foreground/50 hover:text-hash-primary transition-colors text-sm"
            >
              Terms
            </Link>
            <a
              href="https://status.codexhash.io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground/50 hover:text-hash-primary transition-colors text-sm"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Status
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
