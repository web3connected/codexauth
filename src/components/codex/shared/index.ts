// Shared components used across all services

// Layout Components
export { default as GlobalHeader } from './Header/GlobalHeader';
export { GlobalWrapper } from './GlobalWrapper';
export type { GlobalWrapperProps } from './GlobalWrapper';

// Widgets
export { default as ApplicationLogo } from './widgets/ApplicationLogo';
export { default as WhoIsLoggedInWidget } from './widgets/WhoIsLoggedInWidget';
export { default as DateGreeterWidget } from './widgets/DateGreeterWidget';
export { default as HeaderActions } from './widgets/HeaderActions';
export { PageLoader } from './widgets';
export type { PageLoaderProps } from './widgets';

// Sliders
export { ProductSlider } from './Sliders/ProductSlider';
export type { ProductSlide } from './Sliders/types';

// Panels
export { ThreePanelCardDesign } from './panels/ThreePanelCardDesign';
export type { ThreePanelCardDesignProps, PanelCard } from './panels/ThreePanelCardDesign';
export { CodeBlockQuickStart } from './panels/CodeBlockQuickStart';
export type { CodeBlockQuickStartProps, QuickStartLanguage, InstallCommand } from './panels/CodeBlockQuickStart';
export { FeatureCardGrid } from './panels/FeatureCardGrid';
export type { FeatureCardGridProps, SDKCard } from './panels/FeatureCardGrid';
export { HighlightGrid } from './panels/HighlightGrid';
export type { HighlightGridProps, HighlightCard } from './panels/HighlightGrid';
export { TierComparisonGrid } from './panels/TierComparisonGrid';
export type { TierComparisonGridProps, TierCard } from './panels/TierComparisonGrid';
export { CommunityLinksPanel } from './panels/CommunityLinksPanel';
export type { CommunityLinksPanelProps, CommunityLink, CommunityCtaButton } from './panels/CommunityLinksPanel';
export { DocsSidebarLayout } from './panels/DocsSidebarLayout';
export type { DocsSidebarLayoutProps, DocNavItem } from './panels/DocsSidebarLayout';
export { FeatureOverviewPanel } from './panels/FeatureOverviewPanel';
export type { FeatureOverviewPanelProps, OverviewStatCard } from './panels/FeatureOverviewPanel';
export { NumberedStepsPanel } from './panels/NumberedStepsPanel';
export type { NumberedStepsPanelProps, NumberedStep } from './panels/NumberedStepsPanel';
export { DataConstantsPanel } from './panels/DataConstantsPanel';
export type { DataConstantsPanelProps, DataConstant, DataConstantCallout } from './panels/DataConstantsPanel';
export { ConceptCardsWithCodePanel } from './panels/ConceptCardsWithCodePanel';
export type { ConceptCardsWithCodePanelProps, ConceptCard, BulletItem } from './panels/ConceptCardsWithCodePanel';
export { ApiEndpointTablePanel } from './panels/ApiEndpointTablePanel';
export type { ApiEndpointTablePanelProps, ApiEndpointItem, ApiParam } from './panels/ApiEndpointTablePanel';
export { TabbedCodeViewer } from './panels/TabbedCodeViewer';
export type { TabbedCodeViewerProps, TabCodeExample } from './panels/TabbedCodeViewer';
export { AttackVectorPanel } from './panels/AttackVectorPanel';
export type { AttackVectorPanelProps, SecurityStatCard, AttackVectorRow } from './panels/AttackVectorPanel';
export { PerformanceTablePanel } from './panels/PerformanceTablePanel';
export type { PerformanceTablePanelProps, PerformanceKpi, PerformanceTableRow, OptimizationList } from './panels/PerformanceTablePanel';
export { HashChainingPanel } from './panels/HashChainingPanel';
export type { HashChainingPanelProps, ChainStep, ChainBreaker } from './panels/HashChainingPanel';
export { SecurityTiersPanel } from './panels/SecurityTiersPanel';
export type { SecurityTiersPanelProps, SecurityTierItem } from './panels/SecurityTiersPanel';
export { ReplayPreventionPanel } from './panels/ReplayPreventionPanel';
export type { ReplayPreventionPanelProps, ContextInput } from './panels/ReplayPreventionPanel';
export { ForkDetectionPanel } from './panels/ForkDetectionPanel';
export type { ForkDetectionPanelProps, ForkMethod, RecoveryOption } from './panels/ForkDetectionPanel';
export { HeroBgImagePanel } from './panels/HeroBgImagePanel';
export type { HeroBgImagePanelProps } from './panels/HeroBgImagePanel';
export { SplitTextStatsPanel } from './panels/SplitTextStatsPanel';
export type { SplitTextStatsPanelProps, StatCard } from './panels/SplitTextStatsPanel';
export { BgOverlayCardGridPanel } from './panels/BgOverlayCardGridPanel';
export type { BgOverlayCardGridPanelProps, OverlayGridCard } from './panels/BgOverlayCardGridPanel';
export { SplitTextFactsPanel } from './panels/SplitTextFactsPanel';
export type { SplitTextFactsPanelProps, FactCard } from './panels/SplitTextFactsPanel';
export { VerticalTimelinePanel } from './panels/VerticalTimelinePanel';
export type { VerticalTimelinePanelProps, TimelineItem } from './panels/VerticalTimelinePanel';
export { CenteredCtaPanel } from './panels/CenteredCtaPanel';
export type { CenteredCtaPanelProps, CtaButton } from './panels/CenteredCtaPanel';
export { DocumentSectionsPanel } from './panels/DocumentSectionsPanel';
export type { DocumentSectionsPanelProps, DocSection, DocNavLink } from './panels/DocumentSectionsPanel';

// Blog
export { BlogPanel } from './blog';
export type { BlogPanelProps, BlogPost } from './blog';

// Footer
export { Footer as GlobalFooter } from './Footer/GlobalFooter';
export type { FooterProps as GlobalFooterProps } from './Footer/GlobalFooter';
