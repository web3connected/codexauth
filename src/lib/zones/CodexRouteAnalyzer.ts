/**
 * CodexRouteAnalyzer - Route Zone Detection for Next.js
 *
 * Analyzes routes/paths to determine their zone assignment
 * based on URL patterns and keywords.
 *
 * Ported from Laravel CodexZones package
 *
 * @version 2.0.0
 */

import { CodexRouteServer } from './CodexRouteServer';
import type { HttpMethod } from './CodexRouteServer';

export const UNASSIGNED_ZONE_ID = -1;

// Zone keyword strategies for detection
const ZONE_STRATEGIES: Record<string, string[]> = {
  negative: ['blocked', 'quarantine', 'banned', 'restricted'],
  public: ['public', 'home', 'welcome', 'about', 'contact', 'landing'],
  identity: ['auth', 'login', 'logout', 'register', 'identity', 'verify', 'password', 'forgot', 'reset', 'session'],
  ops: ['health', 'status', 'ping', 'api', 'webhook', 'callback', 'test'],
  protected: ['dashboard', 'profile', 'account', 'settings', 'user', 'my'],
  system: ['internal', 'system', 'service', 'worker', 'job', 'queue', 'cron'],
  eventlogs: ['logs', 'events', 'audit', 'history', 'activity'],
  comms: ['messages', 'notifications', 'chat', 'email', 'sms', 'push', 'inbox'],
  payments: ['payments', 'billing', 'invoice', 'checkout', 'transaction', 'sync', 'import', 'export', 'transfer', 'backup'],
  analytics: ['analytics', 'metrics', 'stats', 'reports', 'insights', 'charts'],
  behavior: ['behavior', 'tracking', 'usage', 'engagement', 'patterns'],
  realtime: ['realtime', 'stream', 'streams', 'socket', 'websocket', 'presence', 'live', 'event', 'ai', 'ml', 'model', 'agent', 'copilot'],
  admin: ['admin', 'manage', 'control', 'superuser', 'root', 'master'],
};

export interface ZoneDetectionResult {
  zone_id: number;
  zone_name: string;
  confidence: number;
  matched_keywords: string[];
}

export class CodexRouteAnalyzer {
  /**
   * Detect zone from a URL/path
   */
  detectZoneFromPath(path: string): ZoneDetectionResult {
    const normalizedPath = this.normalizePath(path);
    const segments = normalizedPath.split('/').filter(Boolean);

    let bestMatch: ZoneDetectionResult = {
      zone_id: UNASSIGNED_ZONE_ID,
      zone_name: 'unassigned',
      confidence: 0,
      matched_keywords: [],
    };

    // Check each zone's keywords against path segments
    for (const [zoneName, keywords] of Object.entries(ZONE_STRATEGIES)) {
      const matchedKeywords: string[] = [];

      for (const keyword of keywords) {
        // Check if any segment contains the keyword
        const match = segments.some(segment => 
          segment.toLowerCase().includes(keyword.toLowerCase())
        );

        if (match) {
          matchedKeywords.push(keyword);
        }
      }

      // Calculate confidence based on matches
      const confidence = matchedKeywords.length / keywords.length;

      if (confidence > bestMatch.confidence) {
        const zoneId = CodexRouteServer.getZoneId(zoneName);
        bestMatch = {
          zone_id: zoneId,
          zone_name: zoneName,
          confidence,
          matched_keywords: matchedKeywords,
        };
      }
    }

    return bestMatch;
  }

  /**
   * Analyze a Next.js route path
   */
  analyzeRoute(path: string): ZoneDetectionResult & { rules: ReturnType<typeof CodexRouteServer.getZone> } {
    const detection = this.detectZoneFromPath(path);
    const rules = CodexRouteServer.getZone(detection.zone_id);

    return {
      ...detection,
      rules,
    };
  }

  /**
   * Check if a method is allowed for a path
   */
  isMethodAllowed(path: string, method: string): boolean {
    const detection = this.detectZoneFromPath(path);
    if (detection.zone_id === UNASSIGNED_ZONE_ID) {
      return true; // Allow all methods for unassigned zones
    }

    const normalizedMethod = method.toUpperCase();
    const allowedMethods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
    if (!allowedMethods.includes(normalizedMethod as HttpMethod)) {
      return false;
    }

    return CodexRouteServer.isMethodAllowed(detection.zone_id, normalizedMethod as HttpMethod);
  }

  /**
   * Check if auth is required for a path
   */
  requiresAuth(path: string): boolean {
    const detection = this.detectZoneFromPath(path);
    if (detection.zone_id === UNASSIGNED_ZONE_ID) {
      return false;
    }
    return CodexRouteServer.requiresAuth(detection.zone_id);
  }

  /**
   * Get zone for Next.js app router path
   * Handles /app, /api, and dynamic segments
   */
  getZoneForAppRoute(pathname: string): ZoneDetectionResult {
    // Strip leading /app or /api if present (Next.js convention)
    let cleanPath = pathname;
    
    if (cleanPath.startsWith('/app/')) {
      cleanPath = cleanPath.slice(4);
    }
    
    // Handle API routes
    if (cleanPath.startsWith('/api/')) {
      // Default API routes to ops zone unless more specific
      const detection = this.detectZoneFromPath(cleanPath);
      if (detection.zone_id === UNASSIGNED_ZONE_ID) {
        return {
          zone_id: 3, // ops
          zone_name: 'ops',
          confidence: 0.5,
          matched_keywords: ['api'],
        };
      }
      return detection;
    }

    return this.detectZoneFromPath(cleanPath);
  }

  /**
   * Normalize path for analysis
   */
  private normalizePath(path: string): string {
    // Remove query string
    let clean = path.split('?')[0];
    
    // Remove hash
    clean = clean.split('#')[0];
    
    // Remove trailing slash
    clean = clean.replace(/\/+$/, '');
    
    // Ensure leading slash
    if (!clean.startsWith('/')) {
      clean = '/' + clean;
    }

    // Remove dynamic segments ([id], [slug], etc.)
    clean = clean.replace(/\[[^\]]+\]/g, '');

    return clean;
  }

  /**
   * Get all zone strategies
   */
  getAllStrategies(): Record<string, string[]> {
    return { ...ZONE_STRATEGIES };
  }
}

export default CodexRouteAnalyzer;
