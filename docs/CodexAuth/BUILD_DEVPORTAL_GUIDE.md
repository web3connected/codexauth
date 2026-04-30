# CodexHash Dev Portal Build Guide

## Developer Portal - SDK Downloads, Documentation & Getting Started

This guide provides step-by-step instructions to build the **CodexHash Developer Portal** - a hub for developers to download SDKs from GitHub, read documentation, and get started with CodexHash integration.

---

## Table of Contents

1. [Dev Portal Overview](#dev-portal-overview)
2. [Architecture Overview](#architecture-overview)
3. [Theme System](#theme-system)
4. [Global Assets Setup](#global-assets-setup)
5. [Project Structure](#project-structure)
6. [Step-by-Step Implementation](#step-by-step-implementation)
7. [Dev Portal Pages](#dev-portal-pages)
8. [Component Integration](#component-integration)
9. [Styling Guidelines](#styling-guidelines)
10. [Deployment Configuration](#deployment-configuration)
11. [Data Configuration](#data-configuration)
12. [Next Steps](#next-steps)

---

## Dev Portal Overview

### What We're Building

A **Developer Portal** focused on:

```
┌─────────────────────────────────────────────────────────────┐
│                   CODEXHASH DEV PORTAL                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  🏠 HOME                                                     │
│     • Hero with quick start CTA                             │
│     • SDK language selector                                  │
│     • Key features overview                                  │
│                                                              │
│  📚 DOCUMENTATION                                            │
│     • Getting Started guides                                 │
│     • API Reference                                          │
│     • Code examples                                          │
│     • Tutorials                                              │
│                                                              │
│  📦 SDKs & DOWNLOADS                                         │
│     • GitHub repository links                                │
│     • NPM / PyPI packages                                    │
│     • Installation commands                                  │
│     • Version info & changelogs                              │
│                                                              │
│  🔧 API EXPLORER                                             │
│     • Interactive API testing                                │
│     • Request/Response examples                              │
│     • Authentication guide                                   │
│                                                              │
│  💡 EXAMPLES                                                 │
│     • Code samples by language                               │
│     • Use case implementations                               │
│     • Integration patterns                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Dev Portal Page Structure

```
/                           → Home (Hero + Quick Start)
/docs                       → Documentation Index
/docs/getting-started       → Getting Started Guide
/docs/installation          → Installation Instructions  
/docs/api-reference         → API Reference
/docs/examples              → Code Examples
/sdks                       → SDK Downloads Page
/sdks/javascript            → JavaScript/TypeScript SDK
/sdks/python                → Python SDK
/sdks/go                    → Go SDK
/api-explorer               → Interactive API Testing
/changelog                  → Version History
/support                    → Support & Community
```

---

## Architecture Overview

### Web3Connected Design Principles

The Web3Connected design follows these core principles:

```
┌─────────────────────────────────────────────────────────────┐
│                    DESIGN ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────┤
│  1. CSS Custom Properties (Design Tokens)                   │
│  2. Tailwind CSS (Utility Classes)                          │
│  3. Component-Based Design System                           │
│  4. Theme Configuration (TypeScript)                        │
│  5. Global Assets (Shared Images, Icons, Fonts)             │
│  6. Site-Specific Theme Overrides                           │
└─────────────────────────────────────────────────────────────┘
```

### Key Files Structure

```
web3connected/
├── codex_theme.json           # Brand configuration (colors, fonts)
├── tailwind.config.js         # Tailwind customizations
├── styles/
│   ├── globals.css            # Base design tokens & utilities
│   ├── master.css             # Additional SCSS build output
│   └── web3connected-theme.css # Site-specific theme overrides
├── config/
│   └── theme.ts               # TypeScript theme configuration
├── components/
│   ├── Layout.tsx             # Main layout wrapper
│   ├── Header.tsx             # Header component
│   ├── Footer.tsx             # Footer component
│   ├── GlobalHeader.tsx       # Unified header from SDK
│   └── ParticleBackground.tsx # Background effects
├── public/
│   └── assets/
│       ├── images/            # Site-specific images
│       ├── fonts/             # Custom fonts
│       └── css/               # Additional CSS
└── pages/
    ├── _app.tsx               # App wrapper with providers
    └── _document.tsx          # Document structure with fonts
```

---

## Theme System

### 1. Design Tokens (CSS Custom Properties)

**Location**: `styles/globals.css` or `styles/tokens.css`

```css
:root {
  /* === BRAND COLORS === */
  --color-primary-theme: #1c2430;
  --color-secondary-theme: #1146a3;
  --color-trinary: #d9e631;
  --color-background: #0a0f1c;
  --color-foreground: #f7fafc;

  /* === BRAND IDENTITY COLORS === */
  --color-brand-codex: rgb(175, 71, 11);      /* Connected orange */
  --color-brand-identity: #4f7096;            /* Identity blue */
  --color-brand-secure: #405168;              /* Secure blue-gray */
  --color-brand-hash: #2DF4A1;                /* Hash green (CodexHash) */
  --color-brand-time: #4c5b7c;                /* Time blue-gray */
  --color-brand-mind: #b8860b;                /* Mind golden */

  /* === GRADIENTS === */
  --gradient-primary: linear-gradient(135deg, var(--color-primary-theme), var(--color-secondary-theme));
  --gradient-brand: linear-gradient(135deg, var(--color-brand-codex), var(--color-trinary));
  --gradient-glass: linear-gradient(135deg, rgba(28, 36, 48, 0.95), rgba(17, 70, 163, 0.95));

  /* === GLASS MORPHISM === */
  --glass-background: rgba(255, 255, 255, 0.1);
  --glass-backdrop: blur(12px);
  --glass-border: 1px solid rgba(255, 255, 255, 0.2);

  /* === TYPOGRAPHY === */
  --font-brand: 'Orbitron', 'Courier New', monospace;
  --font-heading: 'Poppins', system-ui, -apple-system, sans-serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;

  /* === SPACING === */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;

  /* === BORDERS === */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
}
```

### 2. codex_theme.json

**Purpose**: Brand configuration file for consistent identity.

```json
{
  "web3_codex": {
    "colors": {
      "primary": "#d9e631",
      "secondary": "#1146a3",
      "background": "#0a0f1c",
      "brand": "rgb(175, 71, 11)"
    },
    "fonts": {
      "brand": "Orbitron",
      "heading": "Poppins",
      "body": "Inter"
    }
  },
  "codexhash": {
    "colors": {
      "primary": "#2DF4A1",
      "secondary": "#00E4FF",
      "background": "#0F172A",
      "accent": "#FF6B35"
    },
    "fonts": {
      "brand": "Orbitron",
      "heading": "Poppins",
      "body": "Inter"
    }
  }
}
```

### 3. TypeScript Theme Configuration

**Location**: `config/theme.ts`

```typescript
/**
 * CodexHash Theme Configuration
 */
export const codexHashTheme = {
  // Site identity
  siteName: 'CodexHash',
  siteDescription: 'Quantum-Resistant Hashing System',
  
  // Brand colors (CSS custom properties)
  colors: {
    primary: 'var(--color-brand-hash)',
    secondary: 'var(--color-secondary-theme)',
    accent: 'var(--color-trinary)',
    background: 'var(--color-background)',
    foreground: 'var(--color-foreground)',
  },
  
  // Typography
  fonts: {
    brand: 'var(--font-brand)',
    heading: 'var(--font-heading)',
    body: 'var(--font-body)',
    mono: 'var(--font-mono)',
  },
  
  // Component variants
  components: {
    button: {
      primary: 'hash-primary-button',
      secondary: 'hash-secondary-button',
      ghost: 'hash-ghost-button',
    },
    card: {
      default: 'hash-card',
      glass: 'hash-glass-card',
      elevated: 'hash-elevated-card',
    }
  },
  
  // Layout settings
  layout: {
    maxWidth: '1200px',
    navigation: {
      height: '70px',
      sticky: true,
      blur: true,
    }
  },
  
  // Feature flags
  features: {
    darkModeToggle: false,
    codeHighlighting: true,
    docsIntegration: true,
  }
};
```

---

## Global Assets Setup

### 1. Shared Assets Directory Structure

```
public/
├── assets/
│   ├── images/
│   │   ├── brands/               # Brand logos
│   │   │   ├── codexhash-logo.svg
│   │   │   ├── codexhash-icon.png
│   │   │   └── web3codex-logo.svg
│   │   ├── icons/                # UI icons
│   │   │   ├── codexIcon.png
│   │   │   └── hash-icon.svg
│   │   ├── backgrounds/          # Background images
│   │   │   └── grid-pattern.svg
│   │   └── hero/                 # Hero section images
│   │       └── quantum-visual.png
│   ├── fonts/
│   │   └── (custom fonts if needed)
│   └── css/
│       └── (additional CSS if needed)
├── shared-template/
│   └── images/                   # Shared template images
├── favicon.ico
└── favicon.svg
```

### 2. Asset Integration in Components

```tsx
// Using Next.js Image component for optimization
import Image from 'next/image';

const Logo = () => (
  <Image 
    src="/assets/images/brands/codexhash-logo.svg"
    alt="CodexHash"
    width={120}
    height={40}
    priority
  />
);
```

---

## Project Structure

### CodexHash Dev Portal Target Structure

```
codexhash/
├── .env.example
├── .env.local
├── package.json
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── codex_theme.json                    # Brand configuration
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout
│   │   ├── globals.css                 # Global styles
│   │   ├── page.tsx                    # Home (Hero + Quick Start)
│   │   │
│   │   ├── docs/                       # Documentation Section
│   │   │   ├── page.tsx                # Docs index
│   │   │   ├── layout.tsx              # Docs sidebar layout
│   │   │   ├── getting-started/
│   │   │   │   └── page.tsx            # Getting started guide
│   │   │   ├── installation/
│   │   │   │   └── page.tsx            # Installation instructions
│   │   │   ├── api-reference/
│   │   │   │   └── page.tsx            # API reference docs
│   │   │   ├── examples/
│   │   │   │   └── page.tsx            # Code examples
│   │   │   └── tutorials/
│   │   │       └── page.tsx            # Step-by-step tutorials
│   │   │
│   │   ├── sdks/                       # SDK Downloads Section
│   │   │   ├── page.tsx                # All SDKs overview
│   │   │   ├── javascript/
│   │   │   │   └── page.tsx            # JS/TS SDK page
│   │   │   ├── python/
│   │   │   │   └── page.tsx            # Python SDK page
│   │   │   └── go/
│   │   │       └── page.tsx            # Go SDK page
│   │   │
│   │   ├── api-explorer/
│   │   │   └── page.tsx                # Interactive API testing
│   │   │
│   │   ├── changelog/
│   │   │   └── page.tsx                # Version history
│   │   │
│   │   └── support/
│   │       └── page.tsx                # Support & community
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── DevPortalHeader.tsx     # Dev portal header
│   │   │   ├── DevPortalFooter.tsx     # Dev portal footer
│   │   │   └── DocsSidebar.tsx         # Documentation sidebar
│   │   │
│   │   ├── codex/                      # Shared Codex components
│   │   │   ├── panels/
│   │   │   │   ├── GlobalHeader.tsx
│   │   │   │   └── index.ts
│   │   │   └── widgets/
│   │   │       ├── ApplicationLogo.tsx
│   │   │       ├── Navigation.tsx
│   │   │       └── index.ts
│   │   │
│   │   ├── docs/                       # Documentation components
│   │   │   ├── DocContent.tsx          # Markdown/MDX renderer
│   │   │   ├── DocNavigation.tsx       # Docs nav
│   │   │   ├── TableOfContents.tsx     # TOC sidebar
│   │   │   ├── CodeTabs.tsx            # Language switcher tabs
│   │   │   └── CopyButton.tsx          # Copy code button
│   │   │
│   │   ├── sdks/                       # SDK components
│   │   │   ├── SDKCard.tsx             # SDK download card
│   │   │   ├── InstallCommand.tsx      # npm/pip install widget
│   │   │   ├── GitHubStats.tsx         # Repo stats display
│   │   │   └── VersionBadge.tsx        # Version indicator
│   │   │
│   │   ├── panels/                     # Page sections
│   │   │   ├── HeroPanel.tsx           # Landing hero
│   │   │   ├── QuickStartPanel.tsx     # Quick start guide
│   │   │   ├── SDKsOverviewPanel.tsx   # SDK cards grid
│   │   │   ├── FeaturesPanel.tsx       # Features overview
│   │   │   └── CommunityPanel.tsx      # Community/support
│   │   │
│   │   └── widgets/                    # Reusable widgets
│   │       ├── CodeBlock.tsx           # Syntax highlighted code
│   │       ├── Terminal.tsx            # Terminal-style display
│   │       ├── ApiEndpoint.tsx         # API endpoint display
│   │       ├── ApiExplorer.tsx         # Interactive API testing
│   │       └── SearchBox.tsx           # Documentation search
│   │
│   ├── styles/
│   │   ├── globals.css                 # Base styles
│   │   ├── tokens.css                  # Design tokens
│   │   ├── components/
│   │   │   ├── code-block.css
│   │   │   └── docs.css
│   │   └── themes/
│   │       └── codexhash-theme.css
│   │
│   ├── config/
│   │   ├── theme.ts                    # Theme configuration
│   │   ├── navigation.ts               # Nav links config
│   │   ├── sdks.ts                     # SDK metadata
│   │   └── docs.ts                     # Documentation structure
│   │
│   ├── data/
│   │   ├── sdks.json                   # SDK information
│   │   ├── changelog.json              # Version history
│   │   └── docs/                       # Documentation content
│   │       ├── getting-started.mdx
│   │       ├── installation.mdx
│   │       └── api-reference.mdx
│   │
│   ├── contexts/
│   │   ├── ThemeContext.tsx
│   │   └── DocsContext.tsx             # Docs state management
│   │
│   └── lib/
│       ├── utils.ts
│       ├── cn.ts
│       ├── github.ts                   # GitHub API helpers
│       └── markdown.ts                 # MDX processing
│
└── public/
    ├── assets/
    │   ├── images/
    │   │   ├── brands/
    │   │   │   └── codexhash-logo.svg
    │   │   └── sdk-icons/
    │   │       ├── javascript.svg
    │   │       ├── python.svg
    │   │       └── go.svg
    │   └── icons/
    └── shared-template/
```

---

## Step-by-Step Implementation

### Phase 1: Foundation Setup

#### Step 1.1: Update package.json dependencies

```json
{
  "dependencies": {
    "@fortawesome/fontawesome-svg-core": "^7.1.0",
    "@fortawesome/free-brands-svg-icons": "^7.1.0",
    "@fortawesome/react-fontawesome": "^3.1.1",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-tabs": "^1.1.13",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.539.0",
    "next": "^15.4.6",
    "next-themes": "^0.4.6",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "swiper": "^12.0.3",
    "tailwind-merge": "^3.3.1"
  }
}
```

#### Step 1.2: Add codex_theme.json

Create `/codex_theme.json`:

```json
{
  "codexhash": {
    "name": "CodexHash",
    "tagline": "Quantum-Resistant Hashing System",
    "colors": {
      "primary": "#2DF4A1",
      "secondary": "#00E4FF",
      "accent": "#FF6B35",
      "background": "#0F172A",
      "surface": "#1E293B",
      "foreground": "#F8FAFC"
    },
    "fonts": {
      "brand": "Orbitron",
      "heading": "Poppins",
      "body": "Inter",
      "mono": "JetBrains Mono"
    },
    "gradients": {
      "primary": "linear-gradient(135deg, #2DF4A1, #00E4FF)",
      "accent": "linear-gradient(135deg, #FF6B35, #2DF4A1)"
    }
  }
}
```

#### Step 1.3: Update tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'brand': ['Orbitron', 'Courier New', 'monospace'],
        'heading': ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
        'body': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      colors: {
        // Web3 Codex Brand Colors
        'primary-theme': '#1c2430',
        'secondary-theme': '#1146a3',
        'trinary': '#d9e631',
        'background': '#0a0f1c',
        'foreground': '#f7fafc',
        
        // CodexHash specific colors
        'hash-primary': '#2DF4A1',
        'hash-secondary': '#00E4FF',
        'hash-accent': '#FF6B35',
        
        // Brand Identity Colors
        'brand-codex': 'rgb(175, 71, 11)',
        'brand-hash': '#2DF4A1',
        
        // Surface colors
        'surface': '#1E293B',
        'surface-light': '#334155',
        
        // Semantic Colors
        success: '#059669',
        warning: '#d97706',
        error: '#dc2626',
        info: '#2563eb',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1c2430, #1146a3)',
        'gradient-hash': 'linear-gradient(135deg, #2DF4A1, #00E4FF)',
        'gradient-glass': 'linear-gradient(135deg, rgba(28, 36, 48, 0.95), rgba(17, 70, 163, 0.95))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'hash-pulse': 'hashPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        hashPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(45, 244, 161, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(45, 244, 161, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
```

### Phase 2: Styles Setup

#### Step 2.1: Create globals.css

Create/update `src/app/globals.css`:

```css
@import "tailwindcss";

/* Web3 Codex Design System - CodexHash Theme */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700;900&family=Poppins:wght@300;400;500;600;700&display=swap');

:root {
  /* === BRAND COLORS === */
  --color-primary-theme: #1c2430;
  --color-secondary-theme: #1146a3;
  --color-trinary: #d9e631;
  --color-background: #0a0f1c;
  --color-foreground: #f7fafc;

  /* === CODEXHASH SPECIFIC === */
  --color-hash-primary: #2DF4A1;
  --color-hash-secondary: #00E4FF;
  --color-hash-accent: #FF6B35;
  
  /* === BRAND IDENTITY === */
  --color-brand-codex: rgb(175, 71, 11);
  --color-brand-hash: #2DF4A1;

  /* === GRADIENTS === */
  --gradient-primary: linear-gradient(135deg, var(--color-primary-theme), var(--color-secondary-theme));
  --gradient-hash: linear-gradient(135deg, var(--color-hash-primary), var(--color-hash-secondary));
  --gradient-glass: linear-gradient(135deg, rgba(28, 36, 48, 0.95), rgba(17, 70, 163, 0.95));

  /* === GLASS MORPHISM === */
  --glass-background: rgba(255, 255, 255, 0.1);
  --glass-backdrop: blur(12px);
  --glass-border: 1px solid rgba(255, 255, 255, 0.2);

  /* === TYPOGRAPHY === */
  --font-brand: 'Orbitron', 'Courier New', monospace;
  --font-heading: 'Poppins', system-ui, -apple-system, sans-serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;

  /* === SPACING === */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
}

* {
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  color: var(--color-foreground);
  background-color: var(--color-background);
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(45, 244, 161, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(0, 228, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255, 107, 53, 0.05) 0%, transparent 50%);
}

/* === TYPOGRAPHY CLASSES === */
h1, h2, h3, h4, h5, h6, 
.heading-1, .heading-2, .heading-3 {
  font-family: var(--font-heading);
  font-weight: 600;
  line-height: 1.2;
}

.brand-text {
  font-family: var(--font-brand);
}

code, pre, .font-mono {
  font-family: var(--font-mono);
}

/* === COMPONENT STYLES === */
.glass {
  background: var(--glass-background);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: var(--glass-border);
}

.hash-card {
  background: rgba(45, 244, 161, 0.05);
  border: 1px solid rgba(45, 244, 161, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.hash-card:hover {
  border-color: rgba(45, 244, 161, 0.4);
  box-shadow: 0 0 30px rgba(45, 244, 161, 0.2);
}

.hash-button {
  background: var(--gradient-hash);
  border: none;
  color: #0F172A;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hash-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(45, 244, 161, 0.4);
}

/* === GRADIENT TEXT === */
.gradient-text-hash {
  background: var(--gradient-hash);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* === LOGO COLORS === */
.logo-codex-hash {
  color: var(--color-hash-primary);
}

.text-hash-primary {
  color: var(--color-hash-primary);
}

/* === ANIMATIONS === */
@keyframes hashGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(45, 244, 161, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(45, 244, 161, 0.6);
  }
}

.hash-glow {
  animation: hashGlow 2s ease-in-out infinite;
}
```

#### Step 2.2: Create codexhash-theme.css

Create `src/styles/themes/codexhash-theme.css`:

```css
/**
 * CodexHash Site Theme
 * 
 * Extends the shared template system for the CodexHash site
 * Brand focus: Quantum green (#2DF4A1) with tech elements
 */

:root {
  /* Override brand primary for CodexHash */
  --color-brand-primary: var(--color-hash-primary);
  --gradient-primary: var(--gradient-hash);
  --site-accent: var(--color-hash-primary);
}

/* CodexHash specific components */
.hash-hero-section {
  background: linear-gradient(180deg, 
    rgba(15, 23, 42, 0.97) 0%,
    rgba(30, 41, 59, 0.95) 100%
  );
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.hash-feature-card {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(45, 244, 161, 0.2);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.hash-feature-card:hover {
  border-color: rgba(45, 244, 161, 0.5);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(45, 244, 161, 0.15);
}

.hash-code-block {
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(45, 244, 161, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  font-family: var(--font-mono);
  position: relative;
}

.hash-code-block::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient-hash);
  border-radius: 12px 12px 0 0;
}

.hash-badge {
  background: rgba(45, 244, 161, 0.15);
  border: 1px solid rgba(45, 244, 161, 0.3);
  color: var(--color-hash-primary);
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Documentation specific */
.docs-sidebar {
  border-right: 1px solid rgba(45, 244, 161, 0.1);
  background: rgba(15, 23, 42, 0.5);
}

.docs-nav-item {
  padding: 0.75rem 1rem;
  color: rgba(248, 250, 252, 0.7);
  transition: all 0.2s ease;
}

.docs-nav-item:hover,
.docs-nav-item.active {
  color: var(--color-hash-primary);
  background: rgba(45, 244, 161, 0.1);
  border-left: 2px solid var(--color-hash-primary);
}

/* API Explorer */
.api-endpoint {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.api-method {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.api-method.get { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
.api-method.post { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
.api-method.put { background: rgba(234, 179, 8, 0.2); color: #eab308; }
.api-method.delete { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
```

### Phase 3: Component Implementation

#### Step 3.1: Update Layout.tsx

Update `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import CodexHashHeader from "@/components/layout/CodexHashHeader";
import CodexHashFooter from "@/components/layout/CodexHashFooter";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodexHash - Quantum-Resistant Hashing System",
  description: "Quantum-resistant cryptographic hashing system with physics-based security and temporal anchoring.",
  keywords: "quantum, hashing, cryptography, security, blockchain, web3",
  icons: {
    icon: "/assets/icons/codexIcon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" style={{ colorScheme: "dark" }}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="/assets/icons/codexIcon.png" type="image/x-icon" />
        
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Orbitron:wght@400;600;700&family=Poppins:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="dark bg-background text-foreground font-body">
        <ThemeProvider>
          <LoadingProvider>
            <div className="codexhash-app-container">
              {/* Background overlay */}
              <div className="codexhash-background-overlay"></div>
              
              <div className="codexhash-layout-wrapper">
                <CodexHashHeader />
                <main className="codexhash-main-content">
                  {children}
                </main>
                <CodexHashFooter />
              </div>
            </div>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

#### Step 3.2: Update CodexHashHeader.tsx

Update `src/components/layout/CodexHashHeader.tsx`:

```tsx
"use client";

import React from "react";
import { GlobalHeader } from "../codex/panels";
import { ApplicationLogo, Navigation, DateGreeter } from "../codex/widgets";

/**
 * CodexHashHeader - CodexHash themed header implementation
 */
export default function CodexHashHeader() {
  const navLinks = [
    { label: "Features", href: "/#features" },
    { label: "Documentation", href: "/docs" },
    { label: "API", href: "/services/api" },
    { label: "Examples", href: "/examples" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <GlobalHeader
      className="codexhash-header"
      topWidget1={<DateGreeter theme="hash" />}
      bottomWidget1={
        <ApplicationLogo 
          logo="CodexHash" 
          showIcon={true} 
          iconClass="logo-codex-hash"
        />
      }
      bottomWidget2={
        <Navigation 
          items={navLinks} 
          orientation="horizontal"
          activeClass="text-hash-primary"
        />
      }
    />
  );
}
```

#### Step 3.3: Create config/theme.ts

Create `src/config/theme.ts`:

```typescript
/**
 * CodexHash Theme Configuration
 */

export const codexHashTheme = {
  siteName: 'CodexHash',
  siteDescription: 'Quantum-Resistant Hashing System',
  siteUrl: 'https://codexhash.io',
  
  colors: {
    primary: 'var(--color-hash-primary)',
    secondary: 'var(--color-hash-secondary)',
    accent: 'var(--color-hash-accent)',
    background: 'var(--color-background)',
    foreground: 'var(--color-foreground)',
  },
  
  fonts: {
    brand: 'var(--font-brand)',
    heading: 'var(--font-heading)',
    body: 'var(--font-body)',
    mono: 'var(--font-mono)',
  },
  
  components: {
    button: {
      primary: 'hash-button',
      secondary: 'hash-button-secondary',
      ghost: 'hash-button-ghost',
    },
    card: {
      default: 'hash-card',
      feature: 'hash-feature-card',
      code: 'hash-code-block',
    },
    badge: {
      default: 'hash-badge',
    }
  },
  
  layout: {
    maxWidth: '1200px',
    navigation: {
      height: '70px',
      sticky: true,
      blur: true,
    }
  },
  
  features: {
    darkModeToggle: false,
    codeHighlighting: true,
    docsSearch: true,
    apiExplorer: true,
  }
};

export default codexHashTheme;
```

#### Step 3.4: Create config/navigation.ts

Create `src/config/navigation.ts`:

```typescript
/**
 * CodexHash Navigation Configuration
 */

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  external?: boolean;
}

export const mainNavigation: NavItem[] = [
  { label: "Home", href: "/" },
  { 
    label: "Features", 
    href: "/features",
    children: [
      { label: "Quantum Resistance", href: "/features/quantum" },
      { label: "Temporal Anchoring", href: "/features/temporal" },
      { label: "Physics-Based Security", href: "/features/physics" },
    ]
  },
  { 
    label: "Documentation", 
    href: "/docs",
    children: [
      { label: "Getting Started", href: "/docs/getting-started" },
      { label: "API Reference", href: "/docs/api" },
      { label: "Examples", href: "/docs/examples" },
      { label: "SDKs", href: "/docs/sdks" },
    ]
  },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export const footerNavigation = {
  platform: [
    { label: "Overview", href: "/platform" },
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Roadmap", href: "/roadmap" },
  ],
  developers: [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/docs/api" },
    { label: "SDKs", href: "/docs/sdks" },
    { label: "Examples", href: "/examples" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Support", href: "/support" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Security", href: "/security" },
  ],
};
```

### Phase 4: Dev Portal Page Implementation

#### Step 4.1: Home Page (Landing with Quick Start)

Create/update `src/app/page.tsx`:

```tsx
import DevPortalHero from "@/components/panels/DevPortalHero";
import QuickStartPanel from "@/components/panels/QuickStartPanel";
import SDKsOverviewPanel from "@/components/panels/SDKsOverviewPanel";
import FeaturesPanel from "@/components/panels/FeaturesPanel";
import CommunityPanel from "@/components/panels/CommunityPanel";

export default function HomePage() {
  return (
    <div className="devportal-home">
      <DevPortalHero />
      <QuickStartPanel />
      <SDKsOverviewPanel />
      <FeaturesPanel />
      <CommunityPanel />
    </div>
  );
}
```

#### Step 4.2: Create DevPortalHero

Create `src/components/panels/DevPortalHero.tsx`:

```tsx
"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function DevPortalHero() {
  return (
    <section className="devportal-hero py-20 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Badge */}
          <span className="hash-badge mb-6 inline-block">
            Developer Portal
          </span>
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
            Build with{" "}
            <span className="gradient-text-hash">CodexHash</span>
          </h1>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-foreground/70 mb-10 max-w-2xl mx-auto">
            Quantum-resistant hashing for your applications. 
            Get started in minutes with our SDKs for JavaScript, Python, and Go.
          </p>
          
          {/* Primary CTAs */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <a href="/docs/getting-started" className="hash-button">
              Get Started
            </a>
            <a 
              href="https://github.com/web3connected/codexhash" 
              target="_blank"
              rel="noopener noreferrer"
              className="hash-button-secondary flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faGithub} className="w-5 h-5" />
              View on GitHub
            </a>
          </div>
          
          {/* Quick Install */}
          <div className="mt-12">
            <p className="text-sm text-foreground/50 mb-4">Quick Install</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <InstallCommand package="npm" command="npm install @web3codex/hash" />
              <InstallCommand package="pip" command="pip install codexhash" />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

function InstallCommand({ package: pkg, command }: { package: string; command: string }) {
  return (
    <div className="install-command">
      <span className="install-badge">{pkg}</span>
      <code>{command}</code>
      <button className="copy-btn" onClick={() => navigator.clipboard.writeText(command)}>
        Copy
      </button>
    </div>
  );
}
```

#### Step 4.3: Create SDKsOverviewPanel

Create `src/components/panels/SDKsOverviewPanel.tsx`:

```tsx
"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faNpm } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

const sdks = [
  {
    name: "JavaScript / TypeScript",
    package: "@web3codex/hash",
    icon: "/assets/images/sdk-icons/javascript.svg",
    github: "https://github.com/web3connected/codexhash-js",
    npm: "https://www.npmjs.com/package/@web3codex/hash",
    install: "npm install @web3codex/hash",
    href: "/sdks/javascript",
    description: "For Node.js and browser applications",
  },
  {
    name: "Python",
    package: "codexhash",
    icon: "/assets/images/sdk-icons/python.svg",
    github: "https://github.com/web3connected/codexhash-python",
    pypi: "https://pypi.org/project/codexhash/",
    install: "pip install codexhash",
    href: "/sdks/python",
    description: "For Python 3.8+ applications",
  },
  {
    name: "Go",
    package: "github.com/web3connected/codexhash-go",
    icon: "/assets/images/sdk-icons/go.svg",
    github: "https://github.com/web3connected/codexhash-go",
    install: "go get github.com/web3connected/codexhash-go",
    href: "/sdks/go",
    description: "For Go applications and microservices",
  },
];

export default function SDKsOverviewPanel() {
  return (
    <section className="sdks-overview py-20 bg-surface/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Choose Your SDK
          </h2>
          <p className="text-foreground/70 max-w-xl mx-auto">
            Official SDKs for your favorite programming language. 
            All open-source on GitHub.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {sdks.map((sdk) => (
            <SDKCard key={sdk.name} sdk={sdk} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/sdks" className="text-hash-primary hover:underline">
            View all SDKs & Downloads →
          </Link>
        </div>
      </div>
    </section>
  );
}

function SDKCard({ sdk }: { sdk: typeof sdks[0] }) {
  return (
    <div className="sdk-card">
      <div className="sdk-card-header">
        <img src={sdk.icon} alt={sdk.name} className="w-12 h-12" />
        <h3 className="text-xl font-semibold">{sdk.name}</h3>
      </div>
      
      <p className="text-foreground/60 text-sm mb-4">{sdk.description}</p>
      
      <div className="install-snippet">
        <code className="text-xs">{sdk.install}</code>
      </div>
      
      <div className="sdk-card-links">
        <a href={sdk.github} target="_blank" rel="noopener noreferrer" 
           className="sdk-link">
          <FontAwesomeIcon icon={faGithub} /> GitHub
        </a>
        <Link href={sdk.href} className="sdk-link-primary">
          View Docs →
        </Link>
      </div>
    </div>
  );
}
```

#### Step 4.4: Create QuickStartPanel

Create `src/components/panels/QuickStartPanel.tsx`:

```tsx
"use client";

import React, { useState } from "react";
import CodeBlock from "@/components/widgets/CodeBlock";

const quickStartExamples = {
  javascript: `import { CodexHash } from '@web3codex/hash';

// Initialize the client
const codex = new CodexHash({
  apiKey: 'your-api-key'
});

// Create a quantum-resistant hash
const hash = await codex.hash('Hello, World!', {
  algorithm: 'qr-256',
  temporal: true
});

console.log(hash);
// => { hash: '0x...', timestamp: 1710345600, algorithm: 'qr-256' }`,

  python: `from codexhash import CodexHash

# Initialize the client
codex = CodexHash(api_key='your-api-key')

# Create a quantum-resistant hash
hash_result = codex.hash('Hello, World!', 
    algorithm='qr-256',
    temporal=True
)

print(hash_result)
# => {'hash': '0x...', 'timestamp': 1710345600, 'algorithm': 'qr-256'}`,

  go: `package main

import (
    "fmt"
    codexhash "github.com/web3connected/codexhash-go"
)

func main() {
    // Initialize the client
    client := codexhash.NewClient("your-api-key")
    
    // Create a quantum-resistant hash
    hash, err := client.Hash("Hello, World!", &codexhash.Options{
        Algorithm: "qr-256",
        Temporal:  true,
    })
    
    fmt.Println(hash)
    // => {Hash: "0x...", Timestamp: 1710345600, Algorithm: "qr-256"}
}`,
};

export default function QuickStartPanel() {
  const [activeTab, setActiveTab] = useState<'javascript' | 'python' | 'go'>('javascript');
  
  return (
    <section className="quickstart-panel py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Quick Start
            </h2>
            <p className="text-foreground/70">
              Start hashing in under 5 minutes
            </p>
          </div>
          
          {/* Language Tabs */}
          <div className="code-tabs mb-4">
            {(['javascript', 'python', 'go'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveTab(lang)}
                className={`code-tab ${activeTab === lang ? 'active' : ''}`}
              >
                {lang === 'javascript' ? 'JavaScript' : lang === 'python' ? 'Python' : 'Go'}
              </button>
            ))}
          </div>
          
          {/* Code Example */}
          <CodeBlock 
            code={quickStartExamples[activeTab]} 
            language={activeTab} 
          />
          
          {/* Next Steps */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <a href="/docs/getting-started" className="hash-button">
              Full Getting Started Guide
            </a>
            <a href="/docs/api-reference" className="hash-button-secondary">
              API Reference
            </a>
          </div>
          
        </div>
      </div>
    </section>
  );
}
```

---

## Dev Portal Pages

### SDKs Page (`/sdks/page.tsx`)

```tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { sdkData } from "@/data/sdks";
import SDKDetailCard from "@/components/sdks/SDKDetailCard";
import InstallCommand from "@/components/sdks/InstallCommand";

export default function SDKsPage() {
  return (
    <div className="sdks-page py-16">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            SDKs & Downloads
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Official CodexHash SDKs for your favorite programming languages. 
            All open-source and available on GitHub.
          </p>
        </div>
        
        {/* SDK Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {sdkData.map((sdk) => (
            <SDKDetailCard key={sdk.id} sdk={sdk} />
          ))}
        </div>
        
        {/* REST API Section */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-heading font-bold mb-4">
            Need the REST API directly?
          </h2>
          <p className="text-foreground/70 mb-6">
            Use our REST API for any language or platform
          </p>
          <a href="/docs/api-reference" className="hash-button">
            View API Documentation
          </a>
        </div>
        
      </div>
    </div>
  );
}
```

### Documentation Layout (`/docs/layout.tsx`)

```tsx
import DocsSidebar from "@/components/docs/DocsSidebar";
import TableOfContents from "@/components/docs/TableOfContents";
import SearchBox from "@/components/widgets/SearchBox";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="docs-layout">
      {/* Sidebar */}
      <aside className="docs-sidebar">
        <div className="sidebar-header">
          <SearchBox placeholder="Search docs..." />
        </div>
        <DocsSidebar />
      </aside>
      
      {/* Main Content */}
      <main className="docs-content">
        {children}
      </main>
      
      {/* Table of Contents */}
      <aside className="docs-toc">
        <TableOfContents />
      </aside>
    </div>
  );
}
```

### Getting Started Page (`/docs/getting-started/page.tsx`)

```tsx
import { Metadata } from "next";
import CodeBlock from "@/components/widgets/CodeBlock";
import StepIndicator from "@/components/docs/StepIndicator";

export const metadata: Metadata = {
  title: "Getting Started - CodexHash",
  description: "Get started with CodexHash in under 5 minutes",
};

export default function GettingStartedPage() {
  return (
    <article className="docs-article">
      <header className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Getting Started</h1>
        <p className="docs-lead">
          Learn how to integrate CodexHash into your application in under 5 minutes.
        </p>
      </header>
      
      {/* Step 1: Installation */}
      <section className="docs-section">
        <StepIndicator step={1} />
        <h2>Installation</h2>
        <p>Install the CodexHash SDK for your language:</p>
        
        <CodeTabs 
          tabs={[
            { label: "npm", code: "npm install @web3codex/hash" },
            { label: "yarn", code: "yarn add @web3codex/hash" },
            { label: "pnpm", code: "pnpm add @web3codex/hash" },
          ]}
        />
      </section>
      
      {/* Step 2: Get API Key */}
      <section className="docs-section">
        <StepIndicator step={2} />
        <h2>Get Your API Key</h2>
        <p>
          Sign up at <a href="https://codexhash.io/dashboard">codexhash.io</a> to get your free API key.
        </p>
        <div className="callout callout-info">
          <strong>Free Tier:</strong> 10,000 hashes/month included
        </div>
      </section>
      
      {/* Step 3: First Hash */}
      <section className="docs-section">
        <StepIndicator step={3} />
        <h2>Create Your First Hash</h2>
        <CodeBlock language="javascript" code={`
import { CodexHash } from '@web3codex/hash';

const codex = new CodexHash({ apiKey: 'your-api-key' });

const result = await codex.hash('Hello, World!');
console.log(result.hash);
        `} />
      </section>
      
      {/* Next Steps */}
      <section className="docs-section">
        <h2>Next Steps</h2>
        <div className="docs-cards-grid">
          <DocCard 
            title="API Reference"
            description="Explore all available methods"
            href="/docs/api-reference"
          />
          <DocCard 
            title="Examples"
            description="See real-world implementations"
            href="/docs/examples"
          />
          <DocCard 
            title="Tutorials"
            description="Step-by-step guides"
            href="/docs/tutorials"
          />
        </div>
      </section>
      
    </article>
  );
}
```

### SDK Download Components

#### SDKDetailCard (`/components/sdks/SDKDetailCard.tsx`)

```tsx
"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faStar, faCodeBranch } from "@fortawesome/free-solid-svg-icons";
import InstallCommand from "./InstallCommand";

interface SDK {
  id: string;
  name: string;
  package: string;
  version: string;
  description: string;
  icon: string;
  github: string;
  registry?: string;
  install: string;
  stars?: number;
  docsUrl: string;
}

export default function SDKDetailCard({ sdk }: { sdk: SDK }) {
  return (
    <div className="sdk-detail-card">
      {/* Header */}
      <div className="sdk-detail-header">
        <img src={sdk.icon} alt={sdk.name} className="w-16 h-16" />
        <div>
          <h3 className="text-2xl font-bold">{sdk.name}</h3>
          <span className="version-badge">v{sdk.version}</span>
        </div>
      </div>
      
      {/* Description */}
      <p className="text-foreground/70 my-4">{sdk.description}</p>
      
      {/* Install Command */}
      <div className="my-6">
        <p className="text-sm text-foreground/50 mb-2">Install</p>
        <InstallCommand command={sdk.install} />
      </div>
      
      {/* Stats */}
      <div className="sdk-stats">
        {sdk.stars && (
          <span className="stat">
            <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
            {sdk.stars.toLocaleString()}
          </span>
        )}
        <span className="stat">
          <FontAwesomeIcon icon={faCodeBranch} />
          MIT License
        </span>
      </div>
      
      {/* Actions */}
      <div className="sdk-actions mt-6">
        <a 
          href={sdk.github} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hash-button-secondary flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faGithub} />
          View on GitHub
        </a>
        <a href={sdk.docsUrl} className="hash-button">
          Documentation
        </a>
      </div>
    </div>
  );
}
```

#### InstallCommand Widget (`/components/sdks/InstallCommand.tsx`)

```tsx
"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";

export default function InstallCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="install-command-widget">
      <code className="command-text">{command}</code>
      <button 
        onClick={handleCopy} 
        className="copy-button"
        aria-label="Copy to clipboard"
      >
        <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
      </button>
    </div>
  );
}
```

### Dev Portal CSS additions (`globals.css` additions)

```css
/* === DEV PORTAL SPECIFIC STYLES === */

/* Install Command Widget */
.install-command-widget {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(45, 244, 161, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  font-family: var(--font-mono);
}

.install-command-widget .command-text {
  color: var(--color-hash-primary);
  font-size: 0.875rem;
}

.install-command-widget .copy-button {
  background: transparent;
  border: none;
  color: var(--color-foreground);
  opacity: 0.6;
  cursor: pointer;
  padding: 4px 8px;
  transition: opacity 0.2s;
}

.install-command-widget .copy-button:hover {
  opacity: 1;
  color: var(--color-hash-primary);
}

/* SDK Cards */
.sdk-card {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(45, 244, 161, 0.15);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.sdk-card:hover {
  border-color: rgba(45, 244, 161, 0.4);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.sdk-card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.sdk-detail-card {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(45, 244, 161, 0.2);
  border-radius: 20px;
  padding: 32px;
}

/* Documentation Layout */
.docs-layout {
  display: grid;
  grid-template-columns: 280px 1fr 200px;
  min-height: calc(100vh - 70px);
}

.docs-sidebar {
  position: sticky;
  top: 70px;
  height: calc(100vh - 70px);
  overflow-y: auto;
  border-right: 1px solid rgba(45, 244, 161, 0.1);
  background: rgba(15, 23, 42, 0.5);
  padding: 24px;
}

.docs-content {
  padding: 48px;
  max-width: 800px;
}

.docs-toc {
  position: sticky;
  top: 70px;
  height: calc(100vh - 70px);
  overflow-y: auto;
  padding: 24px;
  border-left: 1px solid rgba(45, 244, 161, 0.1);
}

/* Docs Article Styles */
.docs-article h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.docs-article h2 {
  font-size: 1.75rem;
  font-weight: 600;
  margin-top: 48px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(45, 244, 161, 0.1);
}

.docs-lead {
  font-size: 1.25rem;
  color: var(--color-foreground);
  opacity: 0.8;
  line-height: 1.6;
}

.docs-badge {
  background: rgba(45, 244, 161, 0.15);
  color: var(--color-hash-primary);
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Code Tabs */
.code-tabs {
  display: flex;
  gap: 4px;
  background: rgba(15, 23, 42, 0.6);
  padding: 4px;
  border-radius: 8px;
  width: fit-content;
}

.code-tab {
  padding: 8px 16px;
  border-radius: 6px;
  background: transparent;
  border: none;
  color: var(--color-foreground);
  opacity: 0.6;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.code-tab:hover {
  opacity: 1;
}

.code-tab.active {
  background: rgba(45, 244, 161, 0.15);
  color: var(--color-hash-primary);
  opacity: 1;
}

/* Callouts */
.callout {
  padding: 16px 20px;
  border-radius: 8px;
  margin: 16px 0;
  border-left: 4px solid;
}

.callout-info {
  background: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
}

.callout-warning {
  background: rgba(234, 179, 8, 0.1);
  border-color: #eab308;
}

.callout-success {
  background: rgba(34, 197, 94, 0.1);
  border-color: #22c55e;
}

/* Version Badge */
.version-badge {
  background: rgba(45, 244, 161, 0.2);
  color: var(--color-hash-primary);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: var(--font-mono);
}

/* Responsive Docs */
@media (max-width: 1200px) {
  .docs-layout {
    grid-template-columns: 260px 1fr;
  }
  .docs-toc {
    display: none;
  }
}

@media (max-width: 768px) {
  .docs-layout {
    grid-template-columns: 1fr;
  }
  .docs-sidebar {
    position: fixed;
    left: -100%;
    width: 280px;
    z-index: 50;
    transition: left 0.3s ease;
  }
  .docs-sidebar.open {
    left: 0;
  }
  .docs-content {
    padding: 24px;
  }
}
```

---

## Component Integration

### Dev Portal Widget System

Key widgets for the developer portal:

| Widget | Purpose | Location |
|--------|---------|----------|
| `CodeBlock` | Syntax highlighted code display | `/components/widgets/CodeBlock.tsx` |
| `CodeTabs` | Language switcher for code examples | `/components/docs/CodeTabs.tsx` |
| `InstallCommand` | Copy-able install commands | `/components/sdks/InstallCommand.tsx` |
| `SearchBox` | Documentation search | `/components/widgets/SearchBox.tsx` |
| `Terminal` | Terminal-style output display | `/components/widgets/Terminal.tsx` |
| `ApiEndpoint` | API endpoint documentation | `/components/widgets/ApiEndpoint.tsx` |

### Dev Portal Panel System

Page-level components:

| Panel | Purpose | Location |
|-------|---------|----------|
| `DevPortalHero` | Landing hero with quick install | `/components/panels/DevPortalHero.tsx` |
| `QuickStartPanel` | Code examples by language | `/components/panels/QuickStartPanel.tsx` |
| `SDKsOverviewPanel` | SDK cards grid | `/components/panels/SDKsOverviewPanel.tsx` |
| `FeaturesPanel` | Feature highlights | `/components/panels/FeaturesPanel.tsx` |
| `CommunityPanel` | Community links & support | `/components/panels/CommunityPanel.tsx` |

### Using Shared Codex Components

Import from local codex components (same pattern as Web3Connected):

```tsx
// Layout components
import { GlobalHeader } from "@/components/codex/panels";
import { ApplicationLogo, Navigation } from "@/components/codex/widgets";

// Or from npm package when available
import { GlobalHeader, ApplicationLogo } from "web3codex-components";
```

### Third-Party Dependencies

Recommended packages for the dev portal:

```json
{
  "dependencies": {
    "@fortawesome/fontawesome-svg-core": "^7.1.0",
    "@fortawesome/free-brands-svg-icons": "^7.1.0",
    "@fortawesome/react-fontawesome": "^3.1.1",
    "lucide-react": "^0.539.0",
    "prism-react-renderer": "^2.3.0",
    "rehype-highlight": "^7.0.0",
    "rehype-slug": "^6.0.0",
    "@radix-ui/react-tabs": "^1.1.13"
  }
}
```

---

## Styling Guidelines

### 1. Use CSS Custom Properties

Always use CSS variables for theming:

```css
/* ✅ Correct */
background: var(--color-hash-primary);

/* ❌ Avoid hardcoded values */
background: #2DF4A1;
```

### 2. Follow BEM-like naming

```css
.hash-card { }
.hash-card:hover { }
.hash-card__title { }
.hash-card__content { }
.hash-card--featured { }
```

### 3. Use Tailwind for utilities

Combine CSS classes with Tailwind utilities:

```tsx
<div className="hash-card p-6 rounded-lg">
```

### 4. Responsive design

Use Tailwind breakpoints:

```tsx
<div className="text-2xl md:text-4xl lg:text-5xl">
```

---

## Deployment Configuration

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Production Config

```bash
# .env.production
NEXT_PUBLIC_SITE_URL=https://codexhash.io
NEXT_PUBLIC_API_URL=https://api.codexhash.io
```

### Port Configuration

CodexHash runs on port `3001`:

```json
{
  "scripts": {
    "dev": "next dev --turbopack -p 3001",
    "start": "next start -p ${PORT:-3001}"
  }
}
```

---

## Quick Reference

### Color Palette

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-hash-primary` | `#2DF4A1` | Primary brand color |
| `--color-hash-secondary` | `#00E4FF` | Secondary accent |
| `--color-hash-accent` | `#FF6B35` | Call-to-action |
| `--color-background` | `#0a0f1c` | Page background |
| `--color-foreground` | `#f7fafc` | Text color |

### Font Stack

| Variable | Font Family |
|----------|-------------|
| `--font-brand` | Orbitron |
| `--font-heading` | Poppins |
| `--font-body` | Inter |
| `--font-mono` | JetBrains Mono |

### Key Classes

| Class | Purpose |
|-------|---------|
| `.hash-card` | Glass card component |
| `.hash-button` | Primary button |
| `.hash-badge` | Status badge |
| `.hash-code-block` | Code display |
| `.gradient-text-hash` | Gradient text |
| `.logo-codex-hash` | Logo color |
| `.sdk-card` | SDK download card |
| `.install-command-widget` | Install command with copy |
| `.docs-layout` | Documentation page layout |
| `.docs-sidebar` | Docs navigation sidebar |
| `.code-tabs` | Language switcher tabs |

---

## Data Configuration

### SDK Data (`/src/data/sdks.ts`)

```typescript
export const sdkData = [
  {
    id: 'javascript',
    name: 'JavaScript / TypeScript',
    package: '@web3codex/hash',
    version: '1.2.0',
    description: 'Official CodexHash SDK for Node.js and browser applications. Full TypeScript support included.',
    icon: '/assets/images/sdk-icons/javascript.svg',
    github: 'https://github.com/web3connected/codexhash-js',
    npm: 'https://www.npmjs.com/package/@web3codex/hash',
    install: 'npm install @web3codex/hash',
    stars: 1240,
    docsUrl: '/sdks/javascript',
    features: ['TypeScript support', 'Browser & Node.js', 'Tree-shakeable', 'Zero dependencies'],
  },
  {
    id: 'python',
    name: 'Python',
    package: 'codexhash',
    version: '1.1.0',
    description: 'Official CodexHash SDK for Python 3.8+ with async support and type hints.',
    icon: '/assets/images/sdk-icons/python.svg',
    github: 'https://github.com/web3connected/codexhash-python',
    pypi: 'https://pypi.org/project/codexhash/',
    install: 'pip install codexhash',
    stars: 890,
    docsUrl: '/sdks/python',
    features: ['Async support', 'Type hints', 'Python 3.8+', 'Pydantic models'],
  },
  {
    id: 'go',
    name: 'Go',
    package: 'github.com/web3connected/codexhash-go',
    version: '1.0.0',
    description: 'Official CodexHash SDK for Go applications with context support and concurrent safety.',
    icon: '/assets/images/sdk-icons/go.svg',
    github: 'https://github.com/web3connected/codexhash-go',
    install: 'go get github.com/web3connected/codexhash-go',
    stars: 456,
    docsUrl: '/sdks/go',
    features: ['Context support', 'Concurrent safe', 'Minimal dependencies', 'Go modules'],
  },
];
```

### Navigation Config (`/src/config/navigation.ts`)

```typescript
export const devPortalNavigation = {
  main: [
    { label: 'Docs', href: '/docs' },
    { label: 'SDKs', href: '/sdks' },
    { label: 'API Explorer', href: '/api-explorer' },
    { label: 'Examples', href: '/docs/examples' },
    { label: 'Changelog', href: '/changelog' },
  ],
  
  docs: [
    {
      title: 'Getting Started',
      items: [
        { label: 'Introduction', href: '/docs' },
        { label: 'Quick Start', href: '/docs/getting-started' },
        { label: 'Installation', href: '/docs/installation' },
        { label: 'Authentication', href: '/docs/authentication' },
      ],
    },
    {
      title: 'SDKs',
      items: [
        { label: 'JavaScript/TypeScript', href: '/sdks/javascript' },
        { label: 'Python', href: '/sdks/python' },
        { label: 'Go', href: '/sdks/go' },
        { label: 'REST API', href: '/docs/api-reference' },
      ],
    },
    {
      title: 'API Reference',
      items: [
        { label: 'Hashing', href: '/docs/api-reference/hashing' },
        { label: 'Verification', href: '/docs/api-reference/verification' },
        { label: 'Temporal', href: '/docs/api-reference/temporal' },
        { label: 'Errors', href: '/docs/api-reference/errors' },
      ],
    },
    {
      title: 'Guides',
      items: [
        { label: 'Examples', href: '/docs/examples' },
        { label: 'Tutorials', href: '/docs/tutorials' },
        { label: 'Best Practices', href: '/docs/best-practices' },
        { label: 'Migration', href: '/docs/migration' },
      ],
    },
  ],
  
  footer: {
    developers: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/docs/api-reference' },
      { label: 'SDKs', href: '/sdks' },
      { label: 'Examples', href: '/docs/examples' },
      { label: 'Changelog', href: '/changelog' },
    ],
    resources: [
      { label: 'GitHub', href: 'https://github.com/web3connected/codexhash', external: true },
      { label: 'Discord', href: 'https://discord.gg/codexhash', external: true },
      { label: 'Status', href: 'https://status.codexhash.io', external: true },
      { label: 'Blog', href: '/blog' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
};
```

---

## Next Steps

### Implementation Checklist

After following this guide, here's your implementation roadmap:

**Phase 1: Foundation** ✅
- [ ] Update package.json with dependencies
- [ ] Configure tailwind.config.ts
- [ ] Add codex_theme.json
- [ ] Set up CSS tokens and globals.css

**Phase 2: Layout** 
- [ ] Create DevPortalHeader component
- [ ] Create DevPortalFooter component  
- [ ] Set up root layout with providers
- [ ] Add responsive navigation

**Phase 3: Home Page**
- [ ] Build DevPortalHero with quick install
- [ ] Create QuickStartPanel with code tabs
- [ ] Implement SDKsOverviewPanel
- [ ] Add FeaturesPanel
- [ ] Build CommunityPanel

**Phase 4: SDKs Section**
- [ ] Create /sdks index page
- [ ] Build SDKDetailCard component
- [ ] Create InstallCommand widget
- [ ] Add individual SDK pages (JS, Python, Go)
- [ ] Implement GitHub stats fetching

**Phase 5: Documentation**
- [ ] Set up docs layout with sidebar
- [ ] Create DocsSidebar component
- [ ] Build TableOfContents component
- [ ] Implement Getting Started guide
- [ ] Add Installation page
- [ ] Create API Reference pages

**Phase 6: Interactive Features**
- [ ] Build CodeBlock with syntax highlighting
- [ ] Create CodeTabs language switcher
- [ ] Implement SearchBox for docs
- [ ] Add API Explorer page

**Phase 7: Final Polish**
- [ ] Add changelog page
- [ ] Implement support page
- [ ] Set up meta tags and SEO
- [ ] Test responsive design
- [ ] Deploy to production

---

## GitHub Repository Links

When implementing, reference these repositories:

| SDK | GitHub | Package Registry |
|-----|--------|-----------------|
| JavaScript | `web3connected/codexhash-js` | npm: `@web3codex/hash` |
| Python | `web3connected/codexhash-python` | PyPI: `codexhash` |
| Go | `web3connected/codexhash-go` | Go modules |

---

*Document Version: 2.0 - Developer Portal Edition*  
*Last Updated: 2026-03-13*  
*Based on Web3Connected design system*
