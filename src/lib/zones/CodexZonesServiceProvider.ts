/**
 * CodexZonesServiceProvider - Zone Service Container for Next.js
 *
 * This is the Next.js equivalent of Laravel's CodexZonesServiceProvider.
 * It provides a singleton container for zone services and configuration management.
 *
 * In Laravel, ServiceProviders register singletons in the IoC container.
 * In Next.js, we use a module-level singleton pattern with lazy initialization.
 *
 * @example
 * // Get services
 * import { getRouteServer, getRouteAnalyzer, getZoneGuard } from '@/lib/zones/CodexZonesServiceProvider';
 *
 * const analyzer = getRouteAnalyzer();
 * const detection = analyzer.detectZoneFromPath('/admin/users');
 *
 * @version 1.0.0
 */

import { CodexRouteServer } from './CodexRouteServer';
import { CodexRouteAnalyzer } from './CodexRouteAnalyzer';
import { CODEX_ZONE_REGISTRY } from './CodexZoneRegistry';
import { CodexZoneGuard, getZoneGuard } from './CodexZoneGuard';
import { CodexEthosLattice, getEthosLattice } from './CodexEthosLattice';

// ============================================================================
// Service Container Types
// ============================================================================

export interface ZoneServiceContainer {
  routeServer: CodexRouteServer | null;
  routeAnalyzer: CodexRouteAnalyzer | null;
  requestAnalyzer: CodexRequestAnalyzerService | null;
  zoneGuard: CodexZoneGuard | null;
  zoneStrategies: CodexZoneStrategies | null;
  ethosLattice: CodexEthosLattice | null;
  config: ZoneConfiguration | null;
  initialized: boolean;
}

export interface ZoneConfiguration {
  zoneRegistry: Record<number, ZoneRegistryEntry>;
  rootRouteZones: Record<string, RootRouteZoneConfig>;
  zones: ZonesConfig;
}

export interface ZoneRegistryEntry {
  id: number;
  name: string;
  description: string;
  level: 'public' | 'protected' | 'system' | 'admin';
}

export interface RootRouteZoneConfig {
  zone_id: number;
  name: string;
  prefixes: string[];
  middleware: string[];
}

export interface ZonesConfig {
  default_zone: number;
  strict_mode: boolean;
  log_unassigned: boolean;
  debug: boolean;
}

// ============================================================================
// Service Classes
// ============================================================================

/**
 * CodexRequestAnalyzerService
 * Analyzes requests for zone context and TIU sync
 */
export class CodexRequestAnalyzerService {
  private routeAnalyzer: CodexRouteAnalyzer;

  constructor(routeAnalyzer: CodexRouteAnalyzer) {
    this.routeAnalyzer = routeAnalyzer;
  }

  /**
   * Analyze a request path and headers
   */
  analyze(path: string, method: string = 'GET', headers: Record<string, string> = {}) {
    const zoneDetection = this.routeAnalyzer.detectZoneFromPath(path);
    
    return {
      path,
      method,
      zone: zoneDetection,
      timestamp: new Date().toISOString(),
      headers: this.sanitizeHeaders(headers),
    };
  }

  /**
   * Sanitize headers (remove sensitive data)
   */
  private sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
    const sensitiveKeys = ['authorization', 'cookie', 'x-api-key', 'x-auth-token'];
    const sanitized: Record<string, string> = {};

    for (const [key, value] of Object.entries(headers)) {
      if (sensitiveKeys.includes(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }
}

/**
 * CodexZoneStrategies
 * Provides zone detection strategies
 */
export class CodexZoneStrategies {
  private strategies: Map<string, string[]> = new Map([
    ['negative', ['blocked', 'quarantine', 'banned', 'restricted']],
    ['public', ['public', 'home', 'welcome', 'about', 'contact', 'landing']],
    ['identity', ['auth', 'login', 'logout', 'register', 'identity', 'verify', 'password', 'forgot', 'reset', 'session']],
    ['ops', ['health', 'status', 'ping', 'api', 'webhook', 'callback', 'test']],
    ['protected', ['dashboard', 'profile', 'account', 'settings', 'user', 'my']],
    ['system', ['internal', 'system', 'service', 'worker', 'job', 'queue', 'cron']],
    ['eventlogs', ['logs', 'events', 'audit', 'history', 'activity']],
    ['comms', ['messages', 'notifications', 'chat', 'email', 'sms', 'push', 'inbox']],
    ['payments', ['payments', 'billing', 'invoice', 'checkout', 'transaction', 'sync', 'import', 'export', 'transfer', 'backup']],
    ['analytics', ['analytics', 'metrics', 'stats', 'reports', 'insights', 'charts']],
    ['behavior', ['behavior', 'tracking', 'usage', 'engagement', 'patterns']],
    ['realtime', ['realtime', 'stream', 'streams', 'socket', 'websocket', 'presence', 'live', 'event', 'ai', 'ml', 'model', 'agent', 'copilot']],
    ['admin', ['admin', 'manage', 'control', 'superuser', 'root', 'master']],
  ]);

  /**
   * Get all strategies
   */
  getAll(): Record<string, string[]> {
    const result: Record<string, string[]> = {};
    for (const [key, value] of Array.from(this.strategies.entries())) {
      result[key] = [...value];
    }
    return result;
  }

  /**
   * Get strategy for a zone
   */
  getForZone(zoneName: string): string[] {
    return this.strategies.get(zoneName) || [];
  }

  /**
   * Add custom strategy
   */
  addStrategy(zoneName: string, keywords: string[]): void {
    const existing = this.strategies.get(zoneName) || [];
    this.strategies.set(zoneName, Array.from(new Set([...existing, ...keywords])));
  }

  /**
   * Match path against strategies
   */
  matchPath(path: string): { zoneName: string; score: number } | null {
    const segments = path.toLowerCase().split('/').filter(Boolean);
    let best: { zoneName: string; score: number } | null = null;

    for (const [zoneName, keywords] of Array.from(this.strategies.entries())) {
      let score = 0;
      for (const keyword of keywords) {
        if (segments.some(seg => seg.includes(keyword))) {
          score++;
        }
      }

      if (score > 0 && (!best || score > best.score)) {
        best = { zoneName, score };
      }
    }

    return best;
  }
}

// ============================================================================
// Service Container (Singleton)
// ============================================================================

// Module-level singleton container
let container: ZoneServiceContainer = {
  routeServer: null,
  routeAnalyzer: null,
  requestAnalyzer: null,
  zoneGuard: null,
  zoneStrategies: null,
  ethosLattice: null,
  config: null,
  initialized: false,
};

/**
 * Initialize the zone service container
 */
export function initializeZoneServices(config?: Partial<ZoneConfiguration>): void {
  if (container.initialized) {
    return;
  }

  // Initialize configuration
  container.config = {
    zoneRegistry: config?.zoneRegistry ?? getDefaultZoneRegistry(),
    rootRouteZones: config?.rootRouteZones ?? {},
    zones: config?.zones ?? {
      default_zone: -1,
      strict_mode: false,
      log_unassigned: true,
      debug: process.env.NODE_ENV === 'development',
    },
  };

  // Initialize services as singletons (lazy - created on first access)
  container.initialized = true;
}

/**
 * Get default zone registry
 */
function getDefaultZoneRegistry(): Record<number, ZoneRegistryEntry> {
  return {
    0: { id: 0, name: CODEX_ZONE_REGISTRY[0], description: 'Quarantined/Restricted', level: 'public' },
    1: { id: 1, name: CODEX_ZONE_REGISTRY[1], description: 'Public Access', level: 'public' },
    2: { id: 2, name: CODEX_ZONE_REGISTRY[2], description: 'Identity/Authentication', level: 'public' },
    3: { id: 3, name: CODEX_ZONE_REGISTRY[3], description: 'Operations/Health', level: 'public' },
    4: { id: 4, name: CODEX_ZONE_REGISTRY[4], description: 'Protected Routes', level: 'protected' },
    5: { id: 5, name: CODEX_ZONE_REGISTRY[5], description: 'System Internal', level: 'system' },
    6: { id: 6, name: CODEX_ZONE_REGISTRY[6], description: 'Event Logging', level: 'system' },
    7: { id: 7, name: CODEX_ZONE_REGISTRY[7], description: 'Communications', level: 'protected' },
    8: { id: 8, name: CODEX_ZONE_REGISTRY[8], description: 'Payments', level: 'system' },
    9: { id: 9, name: CODEX_ZONE_REGISTRY[9], description: 'Analytics/Metrics', level: 'protected' },
    10: { id: 10, name: CODEX_ZONE_REGISTRY[10], description: 'Behavior Tracking', level: 'system' },
    11: { id: 11, name: CODEX_ZONE_REGISTRY[11], description: 'Realtime Operations', level: 'system' },
    12: { id: 12, name: CODEX_ZONE_REGISTRY[12], description: 'Administration', level: 'admin' },
  };
}

// ============================================================================
// Service Accessors (Lazy Singleton Pattern)
// ============================================================================

/**
 * Get CodexRouteServer singleton
 */
export function getRouteServer(): typeof CodexRouteServer {
  return CodexRouteServer;
}

/**
 * Get CodexRouteAnalyzer singleton
 */
export function getRouteAnalyzer(): CodexRouteAnalyzer {
  if (!container.routeAnalyzer) {
    container.routeAnalyzer = new CodexRouteAnalyzer();
  }
  return container.routeAnalyzer;
}

/**
 * Get CodexRequestAnalyzerService singleton
 */
export function getRequestAnalyzer(): CodexRequestAnalyzerService {
  if (!container.requestAnalyzer) {
    container.requestAnalyzer = new CodexRequestAnalyzerService(getRouteAnalyzer());
  }
  return container.requestAnalyzer;
}

/**
 * Get CodexZoneStrategies singleton
 */
export function getZoneStrategies(): CodexZoneStrategies {
  if (!container.zoneStrategies) {
    container.zoneStrategies = new CodexZoneStrategies();
  }
  return container.zoneStrategies;
}

/**
 * Get configuration
 */
export function getZoneConfig(): ZoneConfiguration | null {
  if (!container.initialized) {
    initializeZoneServices();
  }
  return container.config;
}

/**
 * Reset the container (for testing)
 */
export function resetZoneServices(): void {
  container = {
    routeServer: null,
    routeAnalyzer: null,
    requestAnalyzer: null,
    zoneGuard: null,
    zoneStrategies: null,
    ethosLattice: null,
    config: null,
    initialized: false,
  };
}

// ============================================================================
// Service Aliases (for Laravel compatibility)
// ============================================================================

export const serviceAliases = {
  'codex.zones.route-server': getRouteServer,
  'codex.zones.route-analyzer': getRouteAnalyzer,
  'codex.zones.request-analyzer': getRequestAnalyzer,
  'codex.zones.guard': getZoneGuard,
  'codex.zones.strategies': getZoneStrategies,
  'codex.zones.ethos-lattice': getEthosLattice,
} as const;

/**
 * Get service by alias (Laravel-style)
 */
export function resolveService<K extends keyof typeof serviceAliases>(
  alias: K
): ReturnType<(typeof serviceAliases)[K]> {
  const factory = serviceAliases[alias];
  return factory() as ReturnType<(typeof serviceAliases)[K]>;
}

// ============================================================================
// Auto-initialize on import
// ============================================================================

// Initialize with defaults when module is imported
if (typeof window !== 'undefined' || typeof process !== 'undefined') {
  initializeZoneServices();
}

const codexZonesServiceProvider = {
  initializeZoneServices,
  getRouteServer,
  getRouteAnalyzer,
  getRequestAnalyzer,
  getZoneGuard,
  getZoneStrategies,
  getEthosLattice,
  getZoneConfig,
  resetZoneServices,
  resolveService,
};

export default codexZonesServiceProvider;
