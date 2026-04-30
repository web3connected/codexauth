import {
  DevPortalHero,
  ConceptCardsPanel,
  QuickStartPanel,
  SDKsOverviewPanel,
  FeaturesPanel,
  SecurityTiersPanel,
  CommunityPanel
} from '@/components/panels/devportal'

/**
 * CodexHash Developer Portal Home Page
 * 
 * Landing page featuring:
 * - Hero section with CTAs
 * - Quick start code examples
 * - SDK overview cards
 * - Key features
 * - Community links
 */
export default function Home() {
  return (
    <main className="min-h-screen">
      <DevPortalHero />
      <ConceptCardsPanel />
      <QuickStartPanel />
      <SDKsOverviewPanel />
      <FeaturesPanel />
      <SecurityTiersPanel />
      <CommunityPanel />
    </main>
  )
}
