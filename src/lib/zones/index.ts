/**
 * Codex Zones - Next.js Zone Routing System
 *
 * Port of the Laravel CodexZones package for Next.js applications.
 * Provides zone-based route protection, middleware, and React context.
 *
 * @example
 * // API Route protection
 * import { withZone, requireAdmin } from '@/lib/zones';
 *
 * export const GET = withZone(async (request) => {
 *   return NextResponse.json({ data: 'protected' });
 * });
 *
 * export const POST = requireAdmin(async (request) => {
 *   return NextResponse.json({ admin: true });
 * });
 *
 * @example
 * // Edge middleware (middleware.ts)
 * import { createZoneMiddleware } from '@/lib/zones';
 *
 * export default createZoneMiddleware({
 *   protectedPaths: ['/dashboard'],
 *   adminPaths: ['/admin'],
 * });
 *
 * @version 1.0.0
 */

// Core zone definitions
export { CodexRouteServer, ZONE_NAMES } from './CodexRouteServer';
export type { ZoneDefinition, ZoneRules, HttpMethod, ZoneRouteConfig } from './CodexRouteServer';
export {
  CODEX_ZONE_REGISTRY,
  CODEX_ZONE_NAME_ALIASES,
  resolveZoneName,
  getZoneIdByName,
  getZoneNameById,
  getZoneRegistryEntries,
} from './CodexZoneRegistry';
export type {
  CodexZoneId,
  CodexZoneName,
  CodexZoneAlias,
  CodexResolvableZoneName,
} from './CodexZoneRegistry';

// Zone analyzer
export { CodexRouteAnalyzer, UNASSIGNED_ZONE_ID } from './CodexRouteAnalyzer';
export type { ZoneDetectionResult } from './CodexRouteAnalyzer';

// API middleware
export {
  withZone,
  requireZone,
  requireAdmin,
  requireProtected,
  publicOnly,
  analyzeZone,
  addZoneHeaders,
} from './middleware';
export type { ZoneMiddlewareOptions, ZoneMiddlewareResult } from './middleware';

// Edge middleware
export {
  createZoneMiddleware,
  zoneMiddleware,
  zoneMiddlewareConfig,
} from './edge-middleware';
export type { ZoneEdgeConfig } from './edge-middleware';

// Service Provider (singleton container)
export {
  initializeZoneServices,
  getRouteServer,
  getRouteAnalyzer,
  getRequestAnalyzer,
  getZoneStrategies,
  getZoneConfig,
  resetZoneServices,
  resolveService,
  serviceAliases,
  CodexRequestAnalyzerService,
  CodexZoneStrategies,
} from './CodexZonesServiceProvider';
export type {
  ZoneServiceContainer,
  ZoneConfiguration,
  ZoneRegistryEntry,
  RootRouteZoneConfig,
  ZonesConfig,
} from './CodexZonesServiceProvider';

// Zone Guard (full implementation)
export {
  CodexZoneGuard,
  CodexZoneViolation,
  getZoneGuard,
  resetZoneGuard,
} from './CodexZoneGuard';
export type {
  HarmonicZone,
  ResonanceLogEntry,
  ZoneGuardConfig,
  ZoneConfig,
  AnalysisRequest,
  AnalysisResult,
} from './CodexZoneGuard';

// Ethos Lattice (full implementation)
export {
  CodexEthosLattice,
  getEthosLattice,
  resetEthosLattice,
  ZONE_TRUST,
  ZONE_AUTH,
  ZONE_SECURE,
  ZONE_ADMIN,
  ZONE_IDENTITY,
} from './CodexEthosLattice';
export type {
  PrimeVector,
  HarmonicBase,
  ResonanceField,
  LatticeMatrix,
  EthosCore,
  LatticeCoordinates,
  LatticePoint,
  ValidationContext,
  SuspiciousActivityReport,
  EthosZone,
} from './CodexEthosLattice';
