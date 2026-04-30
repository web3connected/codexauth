# CodexHash GlobalAssets Integration Guide

This guide shows how to use components from `@web3codex/global-assets` in the CodexHash project.

## Installation

Already installed in `package.json`:
```json
{
  "dependencies": {
    "@web3codex/global-assets": "file:../GlobalAssets"
  }
}
```

## Quick Start

### 1. Basic Landing Page

```tsx
// src/app/page.tsx
import {
  CodexHashLandingNavigationHeader,
  SecureDataProtectionHero,
  CodexHashFeaturesOverviewPanel,
  CodexHashLandingContactFooter
} from '@web3codex/global-assets';

export default function Home() {
  return (
    <>
      <CodexHashLandingNavigationHeader />
        <div style="min-height=600px"></div>
      <CodexHashLandingContactFooter />
    </>
  );
}
```

### 2. Documentation Page

```tsx
// src/app/docs/page.tsx
import { CodexHashTechnicalDocumentationPage } from '@web3codex/global-assets';

export default function DocsPage() {
  return <CodexHashTechnicalDocumentationPage />;
}
```

### 3. Verification Tool

```tsx
// src/app/verify/page.tsx
import { CodexHashVerificationWorkflow } from '@web3codex/global-assets';

export default function VerifyPage() {
  return (
    <div className="container mx-auto py-12">
      <CodexHashVerificationWorkflow />
    </div>
  );
}
```

### 4. Pricing Calculator

```tsx
// src/app/pricing/page.tsx
import { CodexHashDynamicPricingCalculator } from '@web3codex/global-assets';

export default function PricingPage() {
  return <CodexHashDynamicPricingCalculator />;
}
```

## Available Component Categories

### CodexHash Landing & Pages (8)
- `CodexHashLandingNavigationHeader`
- `CodexHashInteractiveLandingPage`
- `CodexHashLandingContactFooter`
- `CodexHashPanelSliderNavigation`
- `CodexHashSinglePageLayout`
- `CodexHashTechnicalDocumentationPage`
- `CodexHashVerificationWorkflow`
- `CodexHashDynamicPricingCalculator`

### Educational Panels (11)
- `QuantumLibraryGettingStartedHero`
- `SecureDataProtectionHero`
- `CodexHashMainIntroductionHero`
- `HarmonicCorePrinciplesExplainer`
- `UniversalLawFoundationsEducation`
- `QuantumVsTraditionalComparisonEducation`
- `CodexHashFeaturesOverviewPanel`
- `FibonacciHarmonicTechnologyExplainer`
- `QuantumResistantTechnologyExperience`
- `LiveHashTestingWorkbench`
- `RealWorldEnterpriseUseCases`

### Call-to-Action Panels (2)
- `EnterpriseReadySolutionCallToAction`
- `QuantumSecurityStartupCallToAction`

### Comparison & Benchmarks (3)
- `BlockchainIntegrationShowcase`
- `TraditionalVsCodexHashComparison`
- `IndustryStandardsPerformanceBenchmarks`

### Interactive Demos (4)
- `LiveCodexHashAPIDemo`
- `InteractiveTechnologyExplorer`
- `QuantumHarmonicsInteractiveVisualizer`
- `CodexHashAllPanelsAggregator`

### Layouts (3)
- `CenteredContentLayout` - Max-width centered with breadcrumbs
- `FullWidthLayout` - Full-width wrapper
- `StandardPageLayout` - With header/footer options

### Navigation (3)
- `DropdownNavigationMenu` - Multi-level dropdown
- `SearchAndCallToAction` - Search + CTA combo
- `ServiceNavigationBar` - Full service nav

### Headers & Footers (3)
- `PageTitleWithBreadcrumbs` - Page header
- `CombinedHeaderWithNavigation` - Full header
- `EnterpriseServicesFooter` - Footer with services

### Core Theme (2)
- `ApplicationLogo` - Multi-brand logo (CodexHash, CodexTime, etc.)
- `GlobalHeader` - Full global header

### Widgets (1)
- `ThemeSelectorDropdown` - Theme switcher

### Auth Components (3)
- `CodexAuthQuantumLoginForm` - Challenge/response login
- `CodexAuthQuantumContainer` - Auth wrapper
- `CodexAuthHarmonicChallengeLoginForm` - Demo form

## Complete Examples

See `examples/global-assets-usage.tsx` for 10 complete usage examples including:
- Landing pages
- Documentation
- Verification workflows
- Pricing calculators
- Educational content
- Comparisons
- Interactive demos
- Custom layouts

## Page Structure Recommendations

### Homepage (`/`)
```tsx
CodexHashLandingNavigationHeader
SecureDataProtectionHero
CodexHashFeaturesOverviewPanel
QuantumResistantTechnologyExperience
EnterpriseReadySolutionCallToAction
CodexHashLandingContactFooter
```

### Getting Started (`/getting-started`)
```tsx
QuantumLibraryGettingStartedHero
HarmonicCorePrinciplesExplainer
LiveHashTestingWorkbench
```

### Technology (`/technology`)
```tsx
FibonacciHarmonicTechnologyExplainer
UniversalLawFoundationsEducation
InteractiveTechnologyExplorer
QuantumHarmonicsInteractiveVisualizer
```

### Comparison (`/comparison`)
```tsx
TraditionalVsCodexHashComparison
QuantumVsTraditionalComparisonEducation
IndustryStandardsPerformanceBenchmarks
```

### Use Cases (`/use-cases`)
```tsx
RealWorldEnterpriseUseCases
BlockchainIntegrationShowcase
```

### API Demo (`/demo`)
```tsx
LiveCodexHashAPIDemo
InteractiveTechnologyExplorer
```

### Documentation (`/docs`)
```tsx
CodexHashTechnicalDocumentationPage
```

### Verify (`/verify`)
```tsx
CodexHashVerificationWorkflow
```

### Pricing (`/pricing`)
```tsx
CodexHashDynamicPricingCalculator
```

### All-in-One (`/showcase`)
```tsx
CodexHashAllPanelsAggregator
// or
CodexHashSinglePageLayout
```

## Migration from Old Components

Old components have been removed. Here's the mapping:

| Old Component | New Component |
|--------------|---------------|
| `LandingHeader` | `CodexHashLandingNavigationHeader` |
| `LandingFooter` | `CodexHashLandingContactFooter` |
| `CodexHashLanding` | `CodexHashInteractiveLandingPage` |
| `TechnicalDetails` | `CodexHashTechnicalDocumentationPage` |
| `VerificationService` | `CodexHashVerificationWorkflow` |
| `PricingTiersDemo` | `CodexHashDynamicPricingCalculator` |
| `ApplicationLogo` | Import from GlobalAssets |
| `DateGreeter` | Import from GlobalAssets |
| `TopBarNav` | Import from GlobalAssets |

## TypeScript Support

All components have TypeScript definitions:

```tsx
import type { 
  NavMenuItem, 
  NavbarProps 
} from '@web3codex/global-assets';
```

## Styling

Components use Tailwind CSS classes. Ensure your `tailwind.config.js` includes:

```js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@web3codex/global-assets/**/*.{js,ts,jsx,tsx}'
  ],
  // ... rest of config
}
```

## Updates

To update to latest GlobalAssets:

```bash
npm install
```

Since it's linked via `file:../GlobalAssets`, changes in GlobalAssets are immediately available.

## Documentation

- **Component Index:** `../GlobalAssets/COMPONENT_INDEX.md`
- **Full Transfer Summary:** `../GlobalAssets/COMPLETE_TRANSFER_SUMMARY.md`
- **NPM Migration:** `../GlobalAssets/NPM_PACKAGES_MIGRATION_SUMMARY.md`

## Support

For issues or questions about components, see GlobalAssets repository documentation.
