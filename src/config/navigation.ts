/**
 * CodexAuth Dev Portal Navigation Configuration
 */
import { url } from "@/lib/urls";

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  external?: boolean;
  icon?: string;
}

// Main navigation for Dev Portal header
export const mainNavigation: NavItem[] = [
  { label: "Home", href: "/" },
  { 
    label: "Documentation", 
    href: "/docs",
    children: [
      { label: "Getting Started", href: "/docs/getting-started" },
      { label: "Installation", href: "/docs/installation" },
      { label: "API Reference", href: "/docs/api-reference" },
      { label: "Examples", href: "/docs/examples" },
    ]
  },
  { label: "Getting Started", href: "/getting-started" },
  { 
    label: "SDKs", 
    href: "/sdks",
    children: [
      { label: "JavaScript / TypeScript", href: "/sdks/javascript" },
    ]
  },
  { label: "API Explorer", href: "/api-explorer" },
  { label: "Harmonic Hashing", href: "/harmonic" },
];

// Footer navigation sections
export const footerNavigation = {
  documentation: [
    { label: "Getting Started", href: "/docs/getting-started" },
    { label: "Installation", href: "/docs/installation" },
    { label: "API Reference", href: "/docs/api-reference" },
    { label: "Examples", href: "/docs/examples" },
  ],
  sdks: [
    { label: "JavaScript SDK", href: "/sdks/javascript" },
  ],
  resources: [
    { label: "GitHub", href: "https://github.com/web3codex/codexauth", external: true },
    { label: "Changelog", href: "/changelog" },
    { label: "Support", href: "/support" },
    { label: "Status", href: "https://status.codexauth.io", external: true },
  ],
  company: [
    { label: "About Web3Connected", href: url("/about"), external: true },
    { label: "Blog", href: url("/blog"), external: true },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

// Docs sidebar navigation
export const docsNavigation: NavItem[] = [
  {
    label: "Getting Started",
    href: "/docs/getting-started",
    children: [
      { label: "Introduction", href: "/docs/getting-started" },
      { label: "Quick Start", href: "/docs/getting-started/quick-start" },
      { label: "Authentication", href: "/docs/getting-started/authentication" },
    ]
  },
  {
    label: "Installation",
    href: "/docs/installation",
    children: [
      { label: "JavaScript", href: "/docs/installation/javascript" },
      { label: "Python", href: "/docs/installation/python" },
      { label: "Go", href: "/docs/installation/go" },
    ]
  },
  {
    label: "API Reference",
    href: "/docs/api-reference",
    children: [
      { label: "Overview", href: "/docs/api-reference" },
      { label: "Hash Functions", href: "/docs/api-reference/hash" },
      { label: "Verify Functions", href: "/docs/api-reference/verify" },
      { label: "Temporal Anchoring", href: "/docs/api-reference/temporal" },
    ]
  },
  {
    label: "Examples",
    href: "/docs/examples",
    children: [
      { label: "Basic Hashing", href: "/docs/examples/basic-hashing" },
      { label: "File Hashing", href: "/docs/examples/file-hashing" },
      { label: "Verification", href: "/docs/examples/verification" },
    ]
  },
];

// Legacy exports for backward compatibility
export const CODEXHASH_NAV_ITEMS = mainNavigation;

export const CODEXHASH_FOOTER_LINKS = {
  left: footerNavigation.documentation,
  right: [...footerNavigation.resources, ...footerNavigation.company.slice(2)],
};

export const CODEXHASH_SOCIAL_LINKS = {
  github: 'https://github.com/web3codex/codexauth',
  twitter: 'https://twitter.com/web3codex',
  discord: 'https://discord.gg/web3codex',
};

export default mainNavigation;
