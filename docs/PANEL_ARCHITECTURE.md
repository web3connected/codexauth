# CodexHash Panel Architecture
## Following Auth0.com Structure Pattern

This document outlines the panel-based architecture for CodexHash.io, following the proven structure of Auth0.com.

---

## 🏗️ **Page Structure Overview**

### **Homepage: codexhash.io/**

```
┌─────────────────────────────────────────┐
│  1. HeaderPanel (Fixed)                 │
├─────────────────────────────────────────┤
│  2. HeroPanel (Full viewport)           │
│     - Large headline                    │
│     - 2 CTA buttons                     │
│     - Optional: Animated visual         │
├─────────────────────────────────────────┤
│  3. TrustPanel (Logos)                  │
│     - "Trusted by" text                 │
│     - Client/Partner logos              │
├─────────────────────────────────────────┤
│  4. FeaturesPanel (3-column grid)       │
│     - 6 feature cards                   │
│     - Icons + descriptions              │
├─────────────────────────────────────────┤
│  5. ProductDemoPanel (Split 50/50)      │
│     LEFT: Text + benefits               │
│     RIGHT: Code example/screenshot      │
├─────────────────────────────────────────┤
│  6. ProductDemoPanel (Split 50/50)      │
│     LEFT: Code example/screenshot       │
│     RIGHT: Text + benefits              │
│     (Alternating layout)                │
├─────────────────────────────────────────┤
│  7. UseCasesPanel (Tabs/Cards)          │
│     - Developers                        │
│     - Enterprises                       │
│     - Blockchain Projects               │
├─────────────────────────────────────────┤
│  8. PricingPanel (3-tier)               │
│     - Starter / Pro / Enterprise        │
│     - Feature comparison                │
├─────────────────────────────────────────┤
│  9. TestimonialsPanel (Carousel)        │
│     - Customer quotes                   │
│     - Company logos                     │
├─────────────────────────────────────────┤
│  10. CTAPanel (Final conversion)        │
│      - Large heading                    │
│      - Single prominent CTA             │
├─────────────────────────────────────────┤
│  11. FooterPanel                        │
└─────────────────────────────────────────┘
```

---

## 📦 **Panel Components to Create**

### **Shared Components ONLY** (web3codex-components/src/components/shared/)
- ✅ HeaderPanel - Universal header for all services
- ✅ FooterPanel - Universal footer for all services
- ✅ PageLoader - Loading states
- ✅ ProductSlider - Generic slider component
- ❌ **DO NOT put CodexHash-specific panels here**

### **CodexHash Panels** (web3codex-components/src/components/codexhash/)
All CodexHash-specific panels go here:

#### **1. CodexHashHeroPanel**
```typescript
// Location: SDK/web3codex-components/src/components/codexhash/CodexHashHeroPanel.tsx

interface CodexHashHeroPanelProps {
  headline: string;
  subheadline: string;
  primaryCTA: { text: string; href: string };
  secondaryCTA: { text: string; href: string };
  showAnimation?: boolean;
}

// Features:
- Full viewport height
- Gradient background with crypto/hash visuals
- Animated hash generation demo (optional)
- Dual CTAs (Get Started / View Docs)
```

#### **2. TrustBadgesPanel**
```typescript
// Location: SDK/web3codex-components/src/components/codexhash/TrustBadgesPanel.tsx

interface TrustBadgesPanelProps {
  title?: string;
  logos: Array<{ name: string; src: string; alt: string }>;
  layout?: 'scroll' | 'grid';
}

// Features:
- Horizontal logo carousel
- Grayscale logos with color on hover
- "Trusted by leading Web3 companies"
```

#### **3. CodexHashFeaturesPanel**
```typescript
// Location: SDK/web3codex-components/src/components/codexhash/CodexHashFeaturesPanel.tsx

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface CodexHashFeaturesPanelProps {
  title: string;
  subtitle?: string;
  features: Feature[];
  columns?: 2 | 3 | 4;
}

// Features:
- Responsive grid (3 cols desktop, 2 tablet, 1 mobile)
- Icon + title + description cards
- Hover effects
- Key features:
  - Quantum-Resistant Algorithms
  - Time-Based Verification
  - Blockchain Integration
  - API-First Design
  - Real-Time Processing
  - Enterprise Security
```

#### **4. ProductDemoPanel**
```typescript
// Location: SDK/web3codex-components/src/components/codexhash/ProductDemoPanel.tsx

interface ProductDemoPanelProps {
  title: string;
  description: string;
  benefits: string[];
  media: {
    type: 'code' | 'image' | 'video';
    src: string;
    language?: string; // for code blocks
  };
  layout: 'media-left' | 'media-right';
  backgroundColor?: string;
}

// Use Cases:
- Show API code examples
- Display dashboard screenshots
- Demo hash generation process
- Show verification workflow
```

#### **5. UseCasesTabbedPanel**
```typescript
// Location: SDK/web3codex-components/src/components/codexhash/UseCasesTabbedPanel.tsx

interface UseCase {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  benefits: string[];
  cta: { text: string; href: string };
}

interface UseCasesTabbedPanelProps {
  title: string;
  subtitle?: string;
  useCases: UseCase[];
}

// Tabs:
- Developers (API integration, SDKs)
- Enterprises (Security, compliance)
- Blockchain Projects (On-chain verification)
- Document Management (Timestamping, integrity)
```

#### **6. CodexHashPricingPanel**
```typescript
// Location: SDK/web3codex-components/src/components/codexhash/CodexHashPricingPanel.tsx

interface PricingTier {
  name: string;
  price: number | 'Custom';
  period: 'month' | 'year';
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: { text: string; href: string };
}

interface CodexHashPricingPanelProps {
  title: string;
  subtitle?: string;
  tiers: PricingTier[];
  showComparison?: boolean;
}

// Tiers:
- Free (Developer tier)
- Professional ($99/mo)
- Enterprise (Custom pricing)
```

#### **7. TestimonialsPanel**
```typescript
// Location: SDK/web3codex-components/src/components/codexhash/TestimonialsPanel.tsx

interface Testimonial {
  quote: string;
  author: {
    name: string;
    title: string;
    company: string;
    avatar?: string;
  };
  logo?: string;
}

interface TestimonialsPanelProps {
  title: string;
  testimonials: Testimonial[];
  layout: 'carousel' | 'grid';
}
```

---

## 🎨 **Implementation Pattern**

### **Step 1: Create Panel Components**
```bash
# In SDK/web3codex-components/src/components/codexhash/
touch CodexHashHeroPanel.tsx
touch TrustBadgesPanel.tsx
touch CodexHashFeaturesPanel.tsx
touch ProductDemoPanel.tsx
touch UseCasesTabbedPanel.tsx
touch CodexHashPricingPanel.tsx
touch TestimonialsPanel.tsx
```

### **Step 2: Export from CodexHash Index**
```typescript
// SDK/web3codex-components/src/components/codexhash/index.ts
export { default as CodexHashHeroPanel } from './CodexHashHeroPanel';
export { default as TrustBadgesPanel } from './TrustBadgesPanel';
export { default as CodexHashFeaturesPanel } from './CodexHashFeaturesPanel';
export { default as ProductDemoPanel } from './ProductDemoPanel';
export { default as UseCasesTabbedPanel } from './UseCasesTabbedPanel';
export { default as CodexHashPricingPanel } from './CodexHashPricingPanel';
export { default as TestimonialsPanel } from './TestimonialsPanel';
```

### **Step 3: Use in Next.js Pages**
```typescript
// NextJs/codexhash/src/app/page.tsx
import {
  CodexHashHeroPanel,
  TrustBadgesPanel,
  CodexHashFeaturesPanel,
  ProductDemoPanel,
  UseCasesTabbedPanel,
  CodexHashPricingPanel,
  TestimonialsPanel,
  CTASection,
  Footer
} from 'web3codex-components';

export default function HomePage() {
  return (
    <>
      <CodexHashHeroPanel 
        headline="Quantum-Resistant Hashing for Web3"
        subheadline="Future-proof your data with CodexHash"
        primaryCTA={{ text: "Get Started", href: "/signup" }}
        secondaryCTA={{ text: "View Documentation", href: "/docs" }}
      />
      
      <TrustBadgesPanel 
        title="Trusted by Leading Web3 Companies"
        logos={PARTNER_LOGOS}
      />
      
      <CodexHashFeaturesPanel 
        title="Why CodexHash?"
        features={FEATURES_DATA}
      />
      
      <ProductDemoPanel 
        title="Simple API Integration"
        description="Get started in minutes with our developer-friendly API"
        media={{ type: 'code', src: CODE_EXAMPLE, language: 'typescript' }}
        layout="media-right"
        benefits={[...]}
      />
      
      {/* More panels... */}
    </>
  );
}
```

### **Step 4: Database-Driven (Future)**
```typescript
// NextJs/codexhash/src/app/[slug]/page.tsx
export default async function DynamicPage({ params }) {
  const pageConfig = await db.pages.findOne({ slug: params.slug });
  
  return (
    <>
      {pageConfig.panels.map((panel) => {
        const PanelComponent = PANEL_REGISTRY[panel.type];
        return <PanelComponent key={panel.id} {...panel.props} />;
      })}
    </>
  );
}
```

---

## 🎯 **Design Principles (Following Auth0)**

### **1. Consistent Spacing**
- Use `py-20` (5rem) for section padding
- Use `max-w-7xl mx-auto` for content width
- Consistent gaps between elements

### **2. Visual Hierarchy**
- Large, bold headlines (text-4xl to text-6xl)
- Clear subheadings (text-xl to text-2xl)
- Descriptive body text (text-base to text-lg)

### **3. Color Scheme**
- Dark backgrounds (slate-900/slate-800)
- Accent colors (blue-500/cyan-400 for CTAs)
- Subtle gradients for depth
- White/light text for contrast

### **4. Interactive Elements**
- Hover effects on all cards
- Smooth transitions (transition-all duration-300)
- Active states for buttons
- Loading states where needed

### **5. Responsive Design**
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Stack columns on mobile
- Optimize images for different screen sizes

---

## 📋 **Next Steps**

1. **Start with Hero Panel** - Most impactful, sets the tone
2. **Build Feature Panel** - Showcase key benefits
3. **Create Product Demo Panels** - Show real usage
4. **Add Pricing Panel** - Drive conversion
5. **Implement CTA Panel** - Final conversion push
6. **Refine with Data** - Connect to CMS/database later

---

## 🔗 **Related Documents**
- [Site Structure Plan](./site.md)
- [Component Structure](../../SDK/web3codex-components/COMPONENT_STRUCTURE.md)
- [Panel List Inventory](../../SDK/web3codex-components/)

