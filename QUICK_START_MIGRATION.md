# CodexHash NPM Migration - Quick Start Guide

**Goal:** Migrate codex_hash panels to web3codex-components npm package  
**Start Date:** December 12, 2025  
**Status:** Ready to Begin

---

## 🎯 Step-by-Step Execution Plan

### PHASE 1: Prepare NPM Package (Today - 2-3 hours)

#### Step 1: Set Up GitHub for web3codex-components
```bash
cd /home/web3codex/projects/NPMPackages/web3codex-components

# Commit current state
git add .
git commit -m "Pre-panel-migration state: v1.0.0"

# Add remote (create repo on GitHub first)
git remote add origin https://github.com/web3codex/web3codex-components.git
git push -u origin main
git tag -a v1.0.0 -m "Initial release before panel migration"
git push --tags
```

#### Step 2: Integrate GlobalAssets Design System
```bash
# Copy design system files
cp /home/web3codex/projects/GlobalAssets/shared-template/core-design-system.css \
   /home/web3codex/projects/NPMPackages/web3codex-components/src/styles/

cp /home/web3codex/projects/GlobalAssets/shared-template/components.css \
   /home/web3codex/projects/NPMPackages/web3codex-components/src/styles/

cp /home/web3codex/projects/GlobalAssets/shared-template/animations.css \
   /home/web3codex/projects/NPMPackages/web3codex-components/src/styles/
```

#### Step 3: Update Package Exports
```typescript
// src/index.ts
export * from './components/GlobalHeader';
export * from './components/ApplicationLogo';
export * from './components/Navbar';

// Import styles
import './styles/core-design-system.css';
import './styles/components.css';
import './styles/animations.css';
import './styles/globals.css';
```

#### Step 4: Build and Test
```bash
cd /home/web3codex/projects/NPMPackages/web3codex-components
npm run build

# Verify build outputs
ls -la dist/
```

#### Step 5: Publish v2.0.0
```bash
# Update package.json version to 2.0.0
npm version 2.0.0

# Publish to npm
npm login
npm publish --access public

# Tag release
git add .
git commit -m "v2.0.0: Integrate GlobalAssets design system"
git tag -a v2.0.0 -m "Design system integration"
git push && git push --tags
```

---

### PHASE 2: Replace CodexHash Header (Today - 1 hour)

#### Step 1: Install web3codex-components in codex_hash
```bash
cd /home/web3codex/projects/codex_hash

# Install published package
npm install web3codex-components@^2.0.0

# Verify installation
npm list web3codex-components
```

#### Step 2: Update Layout to Use GlobalHeader
```bash
# Backup current header
cp src/components/layout/LandingHeader.tsx src/components/layout/LandingHeader.tsx.backup
```

Create new layout wrapper:
```tsx
// src/components/layout/GlobalHeaderLayout.tsx
'use client'
import { GlobalHeader } from 'web3codex-components'
import 'web3codex-components/dist/design-system.css'

export default function GlobalHeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlobalHeader 
        currentService="codexhash"
        showServiceNav={true}
        navigation={[
          { label: 'Security', href: '/#security', active: false },
          { label: 'Features', href: '/#features', active: false },
          { label: 'Demo', href: '/#demo', active: false },
          { label: 'Technology', href: '/#technology', active: false },
          { label: 'Pricing', href: '/pricing', active: false },
          { label: 'Docs', href: '/docs', active: false }
        ]}
      />
      {children}
    </>
  )
}
```

#### Step 3: Update Root Layout
```tsx
// src/app/layout.tsx
import GlobalHeaderLayout from '@/components/layout/GlobalHeaderLayout'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GlobalHeaderLayout>
          {children}
        </GlobalHeaderLayout>
      </body>
    </html>
  )
}
```

#### Step 4: Test
```bash
cd /home/web3codex/projects/codex_hash
npm run dev

# Visit http://localhost:3000
# Verify header appears and navigation works
```

#### Step 5: Clean Up (After testing)
```bash
# Remove old header
rm src/components/layout/LandingHeader.tsx
rm src/components/layout/SliderHeaderNav.tsx

# Update imports in other files if needed
# Commit changes
git add .
git commit -m "Replace LandingHeader with GlobalHeader from web3codex-components"
```

---

### PHASE 3: Extract First Panel (Tomorrow - 2-3 hours)

#### Panel Selection: Hero Components (Start with simplest)

**Target:** `src/components/panels/codexhash/Hero.tsx`

#### Step 1: Analyze Current Hero Component
```bash
cd /home/web3codex/projects/codex_hash
cat src/components/panels/codexhash/Hero.tsx | head -50
```

Identify:
- [ ] Props interface
- [ ] Hardcoded values
- [ ] Dependencies
- [ ] Styling approach

#### Step 2: Create Generic HeroSection in NPM Package
```bash
cd /home/web3codex/projects/NPMPackages/web3codex-components
mkdir -p src/components/panels/hero
```

```tsx
// src/components/panels/hero/HeroSection.tsx
import React from 'react'
import Image from 'next/image'

export interface HeroSectionProps {
  variant?: 'default' | 'quantum' | 'secure'
  title: string
  subtitle?: string
  description: string
  iconSrc?: string
  iconAlt?: string
  ctaText?: string
  ctaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  backgroundImage?: string
  gradientFrom?: string
  gradientTo?: string
  showParticles?: boolean
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  variant = 'default',
  title,
  subtitle,
  description,
  iconSrc,
  iconAlt = 'Hero Icon',
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
  backgroundImage,
  gradientFrom = 'blue-900',
  gradientTo = 'purple-900',
  showParticles = false
}) => {
  const gradientClass = `from-${gradientFrom}/20 via-${gradientTo}/30 to-emerald-900/20`
  
  return (
    <div className="min-h-full flex flex-col justify-center space-y-8 relative overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`}></div>
      
      {backgroundImage && (
        <div className="absolute inset-0 opacity-5">
          <Image src={backgroundImage} alt="" fill className="object-cover" />
        </div>
      )}
      
      {/* Particles */}
      {showParticles && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="animate-pulse absolute top-20 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-60"></div>
          {/* More particles */}
        </div>
      )}
      
      {/* Content */}
      <div className="text-center relative z-10">
        {iconSrc && (
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-30"></div>
              <Image src={iconSrc} alt={iconAlt} width={80} height={80} className="relative z-10" />
            </div>
          </div>
        )}
        
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-2xl text-gray-300 mb-4">{subtitle}</p>
        )}
        
        <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">{description}</p>
        
        {/* CTAs */}
        <div className="flex gap-4 justify-center">
          {ctaText && ctaHref && (
            <a href={ctaHref} className="btn btn-primary">{ctaText}</a>
          )}
          {secondaryCtaText && secondaryCtaHref && (
            <a href={secondaryCtaHref} className="btn btn-secondary">{secondaryCtaText}</a>
          )}
        </div>
      </div>
    </div>
  )
}

export default HeroSection
```

```tsx
// src/components/panels/hero/index.ts
export { HeroSection } from './HeroSection'
export type { HeroSectionProps } from './HeroSection'
```

#### Step 3: Export from Package
```tsx
// src/components/panels/index.ts
export * from './hero'
```

```tsx
// src/index.ts
export * from './components/panels'
```

#### Step 4: Build and Test
```bash
cd /home/web3codex/projects/NPMPackages/web3codex-components
npm run build

# Bump version
npm version 2.1.0

# Publish
npm publish
```

#### Step 5: Use in CodexHash
```bash
cd /home/web3codex/projects/codex_hash

# Update package
npm install web3codex-components@^2.1.0
```

```tsx
// src/components/home/CodexHashSinglePage.tsx or wherever Hero is used
import { HeroSection } from 'web3codex-components'

<HeroSection
  variant="quantum"
  title="CodexHash"
  subtitle="Quantum-Resistant Hashing"
  description="Next-generation cryptographic hashing system built on Universal Law principles"
  iconSrc="/assets/icons/codexIcon.png"
  iconAlt="CodexHash Icon"
  ctaText="Get Started"
  ctaHref="/docs"
  secondaryCtaText="View Demo"
  secondaryCtaHref="/#demo"
  backgroundImage="/assets/images/quantum-computing.jpg"
  showParticles={true}
/>
```

#### Step 6: Remove Old Hero
```bash
# After testing
rm src/components/panels/codexhash/Hero.tsx

# Commit
git add .
git commit -m "Replace local Hero with HeroSection from web3codex-components"
```

---

## 📋 Daily Checklist Template

Use this for each panel migration:

### Panel: [PANEL_NAME]
- [ ] Analyze current implementation
- [ ] Design generic interface
- [ ] Create component in npm package
- [ ] Add TypeScript types
- [ ] Write usage example
- [ ] Build npm package
- [ ] Bump version
- [ ] Publish to npm
- [ ] Install in codex_hash
- [ ] Update usage
- [ ] Test thoroughly
- [ ] Remove old component
- [ ] Update imports
- [ ] Commit changes
- [ ] Document in CHANGELOG

---

## 🎯 Quick Commands

### NPM Package Workflow
```bash
cd /home/web3codex/projects/NPMPackages/web3codex-components

# Development
npm run dev              # Watch mode
npm run build           # Build

# Publishing
npm version patch       # 2.1.0 -> 2.1.1
npm version minor       # 2.1.1 -> 2.2.0
npm publish             # Publish to npm

# Git
git add .
git commit -m "Add [COMPONENT] panel"
git push
```

### CodexHash Workflow
```bash
cd /home/web3codex/projects/codex_hash

# Update package
npm install web3codex-components@latest

# Development
npm run dev             # Start dev server
npm run build          # Build for production
npm run lint           # Check for issues

# Git
git add .
git commit -m "Use [COMPONENT] from web3codex-components"
git push
```

---

## ⚠️ Important Notes

1. **Testing:** Always test in dev mode before publishing npm package
2. **Versioning:** Follow semantic versioning
3. **Backwards Compatibility:** Don't break existing usage
4. **Documentation:** Update README for each new component
5. **Git:** Commit frequently with clear messages

---

## 📞 Troubleshooting

### Issue: Build fails
```bash
# Clean and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Styles not loading
```bash
# Verify CSS files in dist/
ls -la dist/*.css

# Check imports in index.ts
cat src/index.ts
```

### Issue: TypeScript errors
```bash
# Check types
npm run type-check

# Rebuild types
npm run build
```

---

**Ready to start?** Begin with Phase 1, Step 1! 🚀
