/**
 * CodexZoneGuard - Zone Security Guard for Next.js
 *
 * Port of Laravel's CodexZoneGuard.php
 * Provides zone stabilization, request analysis, and security validation.
 *
 * Features:
 * - Zone learning stabilization with outlier detection
 * - Request analysis with security checks
 * - HTTP method validation per zone
 * - TIU sync verification
 * - Session integrity checks
 * - Zone strategy validation
 *
 * @example
 * import { CodexZoneGuard } from '@/lib/zones/CodexZoneGuard';
 *
 * // Analyze a request
 * await CodexZoneGuard.analyze(request);
 *
 * // Stabilize zone learning
 * CodexZoneGuard.stabilize(zone, currentHash, agentId);
 *
 * @version 1.0.0
 */

import { CodexRouteAnalyzer } from './CodexRouteAnalyzer';
import { CodexRouteServer } from './CodexRouteServer';

// ============================================================================
// Types
// ============================================================================

export interface HarmonicZone {
  id: number;
  zone: string;
  average: number;
  min: number;
  max: number;
  sample_count: number;
}

export interface ResonanceLogEntry {
  zone_id: number;
  agent_id: number | null;
  type: 'outlier' | 'violation' | 'warning';
  value: number;
  context: Record<string, unknown>;
  detected_at: Date;
}

export interface ZoneGuardConfig {
  max_samples: number;
  tolerance_window: number;
  outlier_multiplier: number;
  stabilization_logging: boolean;
}

export interface ZoneConfig {
  id: number;
  name: string;
  rules: {
    methods_allowed?: string[];
    requires_auth?: boolean;
    requires_tiu?: boolean;
    requires_session?: boolean;
  };
}

export interface AnalysisRequest {
  path: string;
  method: string;
  headers?: Record<string, string>;
  session?: {
    codex_token?: string;
    [key: string]: unknown;
  };
}

export interface AnalysisResult {
  zone_id: number;
  zone_name: string;
  valid: boolean;
  errors: string[];
}

export class CodexZoneViolation extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 403) {
    super(message);
    this.name = 'CodexZoneViolation';
    this.statusCode = statusCode;
  }
}

// ============================================================================
// Cache Storage
// ============================================================================

const configCache: Map<string, Record<string, unknown>> = new Map();
const zoneCache: Map<number, ZoneConfig | null> = new Map();
const resonanceLogs: ResonanceLogEntry[] = [];

// ============================================================================
// Default Configuration
// ============================================================================

const DEFAULT_ZONE_GUARD_CONFIG: ZoneGuardConfig = {
  max_samples: 50,
  tolerance_window: 0.05,
  outlier_multiplier: 2,
  stabilization_logging: true,
};

// Zone configurations (from CodexRouteServer + rules)
const ZONE_CONFIGS: Record<number, ZoneConfig> = {
  0: {
    id: 0,
    name: 'negative',
    rules: {
      methods_allowed: ['GET'],
      requires_auth: false,
      requires_tiu: false,
      requires_session: false,
    },
  },
  1: {
    id: 1,
    name: 'public',
    rules: {
      methods_allowed: ['GET', 'HEAD', 'OPTIONS'],
      requires_auth: false,
      requires_tiu: false,
      requires_session: false,
    },
  },
  2: {
    id: 2,
    name: 'identity',
    rules: {
      methods_allowed: ['GET', 'POST', 'HEAD', 'OPTIONS'],
      requires_auth: false,
      requires_tiu: true,
      requires_session: false,
    },
  },
  3: {
    id: 3,
    name: 'ops',
    rules: {
      methods_allowed: ['GET', 'POST', 'HEAD', 'OPTIONS'],
      requires_auth: false,
      requires_tiu: false,
      requires_session: false,
    },
  },
  4: {
    id: 4,
    name: 'protected',
    rules: {
      methods_allowed: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      requires_auth: true,
      requires_tiu: true,
      requires_session: true,
    },
  },
  5: {
    id: 5,
    name: 'system',
    rules: {
      methods_allowed: ['GET', 'POST', 'PUT', 'DELETE'],
      requires_auth: true,
      requires_tiu: true,
      requires_session: true,
    },
  },
  6: {
    id: 6,
    name: 'eventlogs',
    rules: {
      methods_allowed: ['GET', 'POST'],
      requires_auth: true,
      requires_tiu: true,
      requires_session: true,
    },
  },
  7: {
    id: 7,
    name: 'comms',
    rules: {
      methods_allowed: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      requires_auth: true,
      requires_tiu: true,
      requires_session: true,
    },
  },
  8: {
    id: 8,
    name: 'payments',
    rules: {
      methods_allowed: ['GET', 'POST', 'PUT'],
      requires_auth: true,
      requires_tiu: true,
      requires_session: true,
    },
  },
  9: {
    id: 9,
    name: 'analytics',
    rules: {
      methods_allowed: ['GET', 'POST'],
      requires_auth: true,
      requires_tiu: true,
      requires_session: true,
    },
  },
  10: {
    id: 10,
    name: 'behavior',
    rules: {
      methods_allowed: ['GET', 'POST'],
      requires_auth: true,
      requires_tiu: true,
      requires_session: true,
    },
  },
  11: {
    id: 11,
    name: 'realtime',
    rules: {
      methods_allowed: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      requires_auth: true,
      requires_tiu: true,
      requires_session: true,
    },
  },
  12: {
    id: 12,
    name: 'admin',
    rules: {
      methods_allowed: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      requires_auth: true,
      requires_tiu: true,
      requires_session: true,
    },
  },
};

// ============================================================================
// CodexZoneGuard Class
// ============================================================================

export class CodexZoneGuard {
  private static routeAnalyzer: CodexRouteAnalyzer | null = null;

  /**
   * Get route analyzer singleton
   */
  private static getRouteAnalyzer(): CodexRouteAnalyzer {
    if (!this.routeAnalyzer) {
      this.routeAnalyzer = new CodexRouteAnalyzer();
    }
    return this.routeAnalyzer;
  }

  /**
   * Stabilize the zone learning process with optimized outlier detection
   *
   * @param zone - The harmonic zone to stabilize
   * @param currentHash - The current hash value
   * @param agentId - Optional agent ID for logging
   */
  static stabilize(zone: HarmonicZone, currentHash: number, agentId?: number): void {
    const config = this.getCachedConfig<ZoneGuardConfig>('codex.zone', DEFAULT_ZONE_GUARD_CONFIG);

    // Stop learning after max samples
    if (zone.sample_count >= config.max_samples) {
      return;
    }

    const currentDistance = Math.abs(currentHash - zone.average);
    const range = zone.max - zone.min;
    const tolerance = Math.max(1, range * config.tolerance_window);

    if (currentDistance <= tolerance * config.outlier_multiplier) {
      // Update zone with new sample (running average)
      const newAverage = (zone.average * zone.sample_count + currentHash) / (zone.sample_count + 1);
      zone.average = newAverage;
      zone.sample_count += 1;

      // Update min/max if needed
      zone.min = Math.min(zone.min, currentHash);
      zone.max = Math.max(zone.max, currentHash);
    } else {
      // Log outlier
      this.logOutlier(zone, currentHash, currentDistance, agentId, config);
    }
  }

  /**
   * Analyze request with enhanced security checks
   *
   * @param request - The analysis request
   * @returns Analysis result with validation status
   * @throws CodexZoneViolation on security violations
   */
  static analyze(request: AnalysisRequest): AnalysisResult {
    const { path, method, session } = request;
    const errors: string[] = [];

    // Detect zone from path
    const analysis = this.getRouteAnalyzer().detectZoneFromPath(path);
    const zoneId = analysis.zone_id;
    const zoneConfig = this.getZoneConfig(zoneId);

    if (!zoneConfig) {
      throw new CodexZoneViolation('Unauthorized Zone Access', 403);
    }

    // 1. Validate HTTP methods
    try {
      this.validateMethods(method, zoneConfig);
    } catch (e) {
      if (e instanceof CodexZoneViolation) {
        errors.push(e.message);
        throw e;
      }
    }

    // 2. Verify TIU sync (if required)
    if (zoneConfig.rules.requires_tiu) {
      const tiuValid = this.validateTiuSync(request);
      if (!tiuValid) {
        throw new CodexZoneViolation('TIU Drift Detected', 440);
      }
    }

    // 3. Session integrity check (if required)
    if (zoneConfig.rules.requires_session) {
      if (!session?.codex_token) {
        throw new CodexZoneViolation('Session Token Missing', 419);
      }
    }

    // 4. Advanced zone strategy validation
    this.validateZoneStrategy(path, zoneId);

    return {
      zone_id: zoneId,
      zone_name: zoneConfig.name,
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Log outlier detection
   */
  private static logOutlier(
    zone: HarmonicZone,
    hash: number,
    distance: number,
    agentId: number | undefined,
    config: ZoneGuardConfig
  ): void {
    const logEntry: ResonanceLogEntry = {
      zone_id: zone.id,
      agent_id: agentId ?? null,
      type: 'outlier',
      value: distance,
      context: {
        hash,
        zone_average: zone.average,
        min: zone.min,
        max: zone.max,
      },
      detected_at: new Date(),
    };

    resonanceLogs.push(logEntry);

    if (config.stabilization_logging) {
      console.warn(`ZoneGuard: Outlier in zone ${zone.zone}`, {
        hash,
        distance,
        tolerance: config.tolerance_window,
        agent: agentId,
      });
    }
  }

  /**
   * Validate HTTP method against zone config
   */
  private static validateMethods(method: string, zoneConfig: ZoneConfig): void {
    const allowedMethods = zoneConfig.rules.methods_allowed ?? [];

    if (allowedMethods.length > 0 && !allowedMethods.includes(method.toUpperCase())) {
      throw new CodexZoneViolation(`Method ${method} not allowed`, 405);
    }
  }

  /**
   * Validate TIU (Trust Integrity Unit) sync
   * In a real implementation, this would check TIU state
   */
  private static validateTiuSync(request: AnalysisRequest): boolean {
    // Check for TIU headers
    const tiuToken = request.headers?.['x-codex-tiu'];
    const tiuTimestamp = request.headers?.['x-codex-tiu-ts'];

    // If TIU headers present, validate timestamp drift
    if (tiuToken && tiuTimestamp) {
      const timestamp = parseInt(tiuTimestamp, 10);
      const now = Date.now();
      const drift = Math.abs(now - timestamp);

      // Allow 5 minute drift
      const maxDrift = 5 * 60 * 1000;
      return drift <= maxDrift;
    }

    // No TIU headers - assume valid for public zones
    return true;
  }

  /**
   * Validate zone strategy matches expected zone
   */
  private static validateZoneStrategy(path: string, zoneId: number): void {
    const detection = this.getRouteAnalyzer().detectZoneFromPath(path);
    const expectedZone = CodexRouteServer.getZone(zoneId);

    if (expectedZone && detection.zone_id !== zoneId) {
      throw new CodexZoneViolation(
        `Zone strategy mismatch: detected ${detection.zone_name} vs expected ${expectedZone.name}`,
        409
      );
    }
  }

  /**
   * Get cached config with defaults
   */
  static getCachedConfig<T extends object>(key: string, defaults: T): T {
    if (!configCache.has(key)) {
      // In Next.js, we'd load from environment or config files
      // For now, use defaults
      configCache.set(key, { ...defaults } as Record<string, unknown>);
    }
    return configCache.get(key) as T;
  }

  /**
   * Get zone config by ID
   */
  static getZoneConfig(zoneId: number): ZoneConfig | null {
    if (!zoneCache.has(zoneId)) {
      const config = ZONE_CONFIGS[zoneId] ?? null;
      zoneCache.set(zoneId, config);
    }
    return zoneCache.get(zoneId) ?? null;
  }

  /**
   * Set config cache value
   */
  static cacheConfig(key: string, value: Record<string, unknown>): void {
    configCache.set(key, value);
  }

  /**
   * Clear all caches
   */
  static clearCache(): void {
    configCache.clear();
    zoneCache.clear();
    this.routeAnalyzer = null;
  }

  /**
   * Get resonance logs (for debugging/auditing)
   */
  static getResonanceLogs(): ResonanceLogEntry[] {
    return [...resonanceLogs];
  }

  /**
   * Clear resonance logs
   */
  static clearResonanceLogs(): void {
    resonanceLogs.length = 0;
  }

  // ============================================================================
  // Convenience Methods (from simplified version)
  // ============================================================================

  private allowedZones: Set<number> = new Set();
  private userZones: Set<number> = new Set();

  /**
   * Set allowed zones for a route
   */
  allow(...zoneIds: number[]): this {
    this.allowedZones = new Set(zoneIds);
    return this;
  }

  /**
   * Set user's accessible zones
   */
  setUserZones(zones: number[]): this {
    this.userZones = new Set(zones);
    return this;
  }

  /**
   * Check if zone is allowed
   */
  isAllowed(zoneId: number): boolean {
    if (this.allowedZones.size === 0) {
      return true;
    }
    return this.allowedZones.has(zoneId);
  }

  /**
   * Check if user can access zone
   */
  canAccess(zoneId: number): boolean {
    // Public zones (0-3) are always accessible
    if (zoneId <= 3) {
      return true;
    }
    return this.userZones.has(zoneId);
  }

  /**
   * Create a guard that only allows specific zones
   */
  static only(...zoneIds: number[]): CodexZoneGuard {
    return new CodexZoneGuard().allow(...zoneIds);
  }

  /**
   * Create a guard for admin only
   */
  static admin(): CodexZoneGuard {
    return new CodexZoneGuard().allow(12);
  }

  /**
   * Create a guard for protected zones
   */
  static protected(): CodexZoneGuard {
    return new CodexZoneGuard().allow(4, 5, 6, 7, 8, 9, 10, 11, 12);
  }
}

// ============================================================================
// Singleton Accessor
// ============================================================================

let guardInstance: CodexZoneGuard | null = null;

export function getZoneGuard(): CodexZoneGuard {
  if (!guardInstance) {
    guardInstance = new CodexZoneGuard();
  }
  return guardInstance;
}

export function resetZoneGuard(): void {
  guardInstance = null;
  CodexZoneGuard.clearCache();
}

export default CodexZoneGuard;
