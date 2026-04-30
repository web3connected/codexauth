// src/config/menu.config.ts
export type Role = 'guest' | 'user' | 'admin'

export type MenuItem = {
  label: string
  href?: string
  icon?: string                 // e.g. 'ti ti-briefcase'
  external?: boolean
  badge?: { text: string; tone?: 'primary' | 'neutral' | 'danger' }
  children?: MenuItem[]         // dropdown / nested
  roles?: Role[]                // visible to these roles (default: all)
  cta?: boolean                 // style as button
}

export type MenuColumn = {
  title?: string
  items: MenuItem[]
}

export type SocialLink = {
  label: string
  href: string
  icon: string                  // e.g. 'ti ti-brand-x'
}

export type WalletOpt = { id: string; name: string; icon: string }

export type AppMenuConfig = {
  brand: { name: string; href: string; logo: string; accent?: string }
  header: {
    primary: MenuItem[]         // main nav
    secondary?: MenuItem[]      // right-side actions (Login, Dashboard, etc.)
    socials?: SocialLink[]
  }
  footer: {
    columns: MenuColumn[]       // multi-column footer
    bottom: MenuItem[]          // small row (terms/privacy/etc.)
    socials?: SocialLink[]
  }
  wallets: WalletOpt[]
}

export const MENU: AppMenuConfig = {
  brand: {
    name: 'WEB3CODEX',
    accent: 'CODEX',
    href: '/',
    logo: '/assets/images/fav.png',
  },

  header: {
    primary: [
      {
        label: 'Services', href: '/services', icon: 'ti ti-briefcase',
        children: [
          { label: 'CodexTime', href: '/services/codextime' },
          { label: 'CodexIdentity', href: '/services/codexidentity' },
          { label: 'DeFi Integration', href: '/services/defi' },
          { label: 'Wallet Services', href: '/services/wallets' },
        ]
      },
      { label: 'Developers', href: '/developers', icon: 'ti ti-code' },
      { label: 'Products', href: '/products', icon: 'ti ti-package' },
      { label: 'Solutions', href: '/solutions', icon: 'ti ti-puzzle' },
      { label: 'Technology', href: '/technology', icon: 'ti ti-cpu' },
      { label: 'Blog', href: '/blog', icon: 'ti ti-notes' },
      { label: 'Contact', href: '/contact', icon: 'ti ti-mail' },
    ],
    secondary: [
      { label: 'Docs', href: 'https://docs.web3codex.io', external: true, icon: 'ti ti-book' },
      { label: 'Launch App', href: '/app', cta: true, icon: 'ti ti-rocket' },
    ],
    socials: [
      { label: 'X', href: 'https://x.com/web3codex', icon: 'ti ti-brand-x' },
      { label: 'GitHub', href: 'https://github.com/web3codex', icon: 'ti ti-brand-github' },
      { label: 'Discord', href: 'https://discord.gg/web3codex', icon: 'ti ti-brand-discord' },
    ],
  },

  footer: {
    columns: [
      {
        title: 'Company',
        items: [
          { label: 'About Us', href: '/about' },
          { label: 'Careers', href: '/careers', badge: { text: 'Hiring', tone: 'primary' } },
          { label: 'Contact', href: '/contact' },
        ],
      },
      {
        title: 'Products',
        items: [
          { label: 'CodexTime', href: '/products/codextime' },
          { label: 'CodexIdentity', href: '/products/codexidentity' },
          { label: 'CodexAuth', href: '/products/codexauth' },
        ],
      },
      {
        title: 'Resources',
        items: [
          { label: 'Docs', href: 'https://docs.web3codex.io', external: true },
          { label: 'Developers', href: '/developers' },
          { label: 'FAQ', href: '/faq' },
        ],
      },
      {
        title: 'Account',
        items: [
          { label: 'Profile', href: '/profile', roles: ['user', 'admin'] },
          { label: 'Settings', href: '/settings', roles: ['user', 'admin'] },
          { label: 'Security', href: '/security', roles: ['user', 'admin'] },
          { label: 'Two-Factor Auth', href: '/2fa', roles: ['user', 'admin'] },
          { label: 'Login', href: '/login', roles: ['guest'] },
          { label: 'Register', href: '/register', roles: ['guest'] },
        ],
      },
    ],
    bottom: [
      { label: 'Terms & Conditions', href: '/terms', icon: 'ti ti-file-text' },
      { label: 'Privacy Policy', href: '/privacy', icon: 'ti ti-shield' },
      { label: 'Status', href: 'https://status.web3codex.io', external: true, icon: 'ti ti-activity' },
    ],
    socials: [
      { label: 'X', href: 'https://x.com/web3codex', icon: 'ti ti-brand-x' },
      { label: 'GitHub', href: 'https://github.com/web3codex', icon: 'ti ti-brand-github' },
      { label: 'YouTube', href: 'https://youtube.com/@web3codex', icon: 'ti ti-brand-youtube' },
    ],
  },

  wallets: [
    { id: 'metamask', name: 'Metamask', icon: '/assets/images/metamask.png' },
    { id: 'walletconnect', name: 'WalletConnect', icon: '/assets/images/walletconnect.png' },
    { id: 'coinbase', name: 'Coinbase', icon: '/assets/images/coinbase.png' },
    { id: 'safepal', name: 'Safepal', icon: '/assets/images/safepal.png' },
    { id: 'trustwallet', name: 'Trust Wallet', icon: '/assets/images/trustwallet.png' },
    { id: 'ledger', name: 'Ledger', icon: '/assets/images/ledger.png' },
  ],
}
