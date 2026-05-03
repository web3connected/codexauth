/**
 * Codex Route Types — CodexAuth Portal
 *
 * Thin re-export from @web3codex/codex-core.
 * All canonical type definitions live in the core SDK.
 *
 * Portals import from here so that import paths don't need to change
 * when the core SDK is updated or upgraded.
 */

export {
  CodexZone,
  CODEX_ZONES,
  getZoneConfig,
  isAuthRequired,
  isMethodAllowed,
  zoneFromKey,
} from '@web3codex/codex-core';

export type {
  RouteMiddleware,
  RoutePattern,
  CodexRoute,
  ZoneConfig,
  ZoneStructureStatus,
  ZoneStructureItem,
  ZoneStructureResult,
} from '@web3codex/codex-core';
