/**
 * @web3codex/components
 * 
 * Shared design components for the Codex ecosystem
 */

// Global header component
export { default as GlobalHeader } from './panels/GlobalHeader';

// Widget components - Micro-components for composition
export * from './widgets';

// Config exports
export { getBrandColors, brandColors } from './config/brand-colors';
export type { BrandColors } from './config/brand-colors';