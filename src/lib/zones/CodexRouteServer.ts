/**
 * CodexRouteServer - Zone-based Route Configuration for Next.js
 *
 * Defines the 12+1 zone architecture for Codex routing.
 * Each zone has specific auth requirements, allowed methods, and security rules.
 *
 * Ported from Laravel CodexZones package
 *
 * @version 2.0.0
 */

import { CODEX_ZONE_REGISTRY, getZoneIdByName, getZoneNameById } from './CodexZoneRegistry';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

export interface ZoneRules {
  auth_required: boolean;
  tiu_required: boolean;
  read_only: boolean;
  executive?: boolean;
  methods_allowed: HttpMethod[];
}

export interface ZoneDefinition {
  name: string;
  description: string;
  rules: ZoneRules;
  subzones?: Record<string, unknown>;
}

export interface ZoneRouteConfig {
  zoneId: number;
  zoneName: string;
  middleware: string[];
  prefixes: string[];
  routePatterns: string[];
}

// Zone names for reference
export const ZONE_NAMES: Record<number, string> = CODEX_ZONE_REGISTRY;

export class CodexRouteServer {
  static readonly VERSION = '2.0.0';

  // Zone 0: Orchestration Layer (not a business zone — intake staging for all requests)
  static Zone0(zoneDef: Record<string, unknown> = {}): ZoneDefinition {
    return {
      name: 'negative',
      description: 'Orchestration Layer — intake staging path. Not a business zone.',
      rules: {
        auth_required: false,
        tiu_required: false,
        read_only: true,
        methods_allowed: ['GET'],
      },
      ...zoneDef,
    };
  }

  // Zone 1: Public
  static Zone1(zoneDef: Record<string, unknown> = {}): ZoneDefinition {
    return {
      name: 'public',
      description: 'Public Zone - General access routes',
      rules: {
        auth_required: false,
        tiu_required: false,
        read_only: false,
        methods_allowed: ['GET', 'POST', 'OPTIONS'],
      },
      ...zoneDef,
    };
  }

  // Zone 2: Identity
  static Zone2(zoneDef: Record<string, unknown> = {}): ZoneDefinition {
    return {
      name: 'identity',
      description: 'Identity Zone - Authentication and identity routes',
      rules: {
        auth_required: false,
        tiu_required: false,
        read_only: false,
        methods_allowed: ['GET', 'POST', 'PUT', 'OPTIONS'],
      },
      ...zoneDef,
    };
  }

  // Zone 3: Ops
  static Zone3(zoneDef: Record<string, unknown> = {}): ZoneDefinition {
    return {
      name: 'ops',
      description: 'Operations Zone - System operations and health',
      rules: {
        auth_required: false,
        tiu_required: false,
        read_only: false,
        methods_allowed: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      },
      ...zoneDef,
    };
  }

  // Zone 4: Protected
  static Zone4(zoneDef: Record<string, unknown> = {}): ZoneDefinition {
    return {
      name: 'protected',
      description: 'Protected Zone - Authenticated user routes',
      rules: {
        auth_required: true,
        tiu_required: false,
        read_only: false,
        methods_allowed: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      },
      ...zoneDef,
    };
  }

  // Zone 5: System
  static Zone5(zoneDef: Record<string, unknown> = {}): ZoneDefinition {
    return {
      name: 'system',
      description: 'System Zone - Internal system routes',
      rules: {
        auth_required: true,
        tiu_required: true,
        read_only: false,
        methods_allowed: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      },
      ...zoneDef,
    };
  }

  // Zone 6: Event Logs
  static Zone6(zoneDef: Record<string, unknown> = {}): ZoneDefinition {
    return {
      name: 'eventlogs',
      description: 'Event Logs Zone - Logging and audit trails',
      rules: {
        auth_required: true,
        tiu_required: true,
        read_only: false,
        methods_allowed: ['GET', 'POST', 'OPTIONS'],
      },
      ...zoneDef,
    };
  }

  // Zone 7: Communications
  static Zone7(zoneDef: Record<string, unknown> = {}): ZoneDefinition {
    return {
      name: 'comms',
      description: 'Communications Zone - Messaging and notifications',
      rules: {
        auth_required: true,
        tiu_required: false,
        read_only: false,
        methods_allowed: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      },
      ...zoneDef,
    };
  }

  // Zone 8: Payments
  static Zone8(zoneDef: Record<string, unknown> = {}): ZoneDefinition {
    return {
      name: 'payments',
      description: 'Payments Zone - Billing, settlement, and transfer flows',
      rules: {
        auth_required: true,
        tiu_required: true,
        read_only: false,
        methods_allowed: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS'],
      },
      ...zoneDef,
    };
  }

  // Zone 9: Analytics
  static Zone9(zoneDef: Record<string, unknown> = {}): ZoneDefinition {
    return {
      name: 'analytics',
      description: 'Analytics Zone - Metrics and reporting',
      rules: {
        auth_required: true,
        tiu_required: false,
        read_only: true,
        methods_allowed: ['GET', 'POST', 'OPTIONS'],
      },
      ...zoneDef,
    };
  }

  // Zone 10: Behavior
  static Zone10(zoneDef: Record<string, unknown> = {}): ZoneDefinition {
    return {
      name: 'behavior',
      description: 'Behavior Zone - User behavior tracking',
      rules: {
        auth_required: true,
        tiu_required: true,
        read_only: false,
        methods_allowed: ['GET', 'POST', 'OPTIONS'],
      },
      ...zoneDef,
    };
  }

  // Zone 11: Realtime
  static Zone11(zoneDef: Record<string, unknown> = {}): ZoneDefinition {
    return {
      name: 'realtime',
      description: 'Realtime Zone - Live events, streams, and low-latency operations',
      rules: {
        auth_required: true,
        tiu_required: true,
        read_only: false,
        executive: true,
        methods_allowed: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      },
      ...zoneDef,
    };
  }

  // Zone 12: Admin
  static Zone12(zoneDef: Record<string, unknown> = {}): ZoneDefinition {
    return {
      name: 'admin',
      description: 'Admin Zone - Administrative operations',
      rules: {
        auth_required: true,
        tiu_required: true,
        read_only: false,
        executive: true,
        methods_allowed: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      },
      ...zoneDef,
    };
  }

  // Get all zones
  static All(): Record<number, ZoneDefinition> {
    return {
      0: this.Zone0(),
      1: this.Zone1(),
      2: this.Zone2(),
      3: this.Zone3(),
      4: this.Zone4(),
      5: this.Zone5(),
      6: this.Zone6(),
      7: this.Zone7(),
      8: this.Zone8(),
      9: this.Zone9(),
      10: this.Zone10(),
      11: this.Zone11(),
      12: this.Zone12(),
    };
  }

  // Get specific zone by ID
  static getZone(zoneId: number): ZoneDefinition | null {
    const zones = this.All();
    return zones[zoneId] || null;
  }

  // Check if method is allowed for zone
  static isMethodAllowed(zoneId: number, method: HttpMethod): boolean {
    const zone = this.getZone(zoneId);
    if (!zone) return false;
    return zone.rules.methods_allowed.includes(method);
  }

  // Check if zone requires auth
  static requiresAuth(zoneId: number): boolean {
    const zone = this.getZone(zoneId);
    return zone?.rules.auth_required ?? false;
  }

  // Check if zone requires TIU
  static requiresTiu(zoneId: number): boolean {
    const zone = this.getZone(zoneId);
    return zone?.rules.tiu_required ?? false;
  }

  // Get zone name by ID
  static getZoneName(zoneId: number): string {
    return getZoneNameById(zoneId);
  }

  // Get zone ID by name
  static getZoneId(zoneName: string): number {
    return getZoneIdByName(zoneName);
  }
}

export default CodexRouteServer;
