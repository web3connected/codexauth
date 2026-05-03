/**
 * CodexZoneRegistry - Consolidated zone registry for Next.js
 *
 * Port of the Laravel CodexZoneRegistry.php config.
 * Keeps canonical zone names in one place and preserves compatibility with
 * earlier Next.js ports that used `sync` and `ai` for zones 8 and 11.
 */

export const CODEX_ZONE_REGISTRY = {
  0: 'negative',
  1: 'public',
  2: 'identity',
  3: 'ops',
  4: 'protected',
  5: 'system',
  6: 'eventlogs',
  7: 'comms',
  8: 'payments',
  9: 'analytics',
  10: 'behavior',
  11: 'realtime',
  12: 'admin',
} as const;

export const CODEX_ZONE_NAME_ALIASES = {
  sync: 'payments',
  ai: 'realtime',
} as const;

export type CodexZoneId = keyof typeof CODEX_ZONE_REGISTRY;
export type CodexZoneName = (typeof CODEX_ZONE_REGISTRY)[CodexZoneId];
export type CodexZoneAlias = keyof typeof CODEX_ZONE_NAME_ALIASES;
export type CodexResolvableZoneName = CodexZoneName | CodexZoneAlias;

const zoneNameToId = Object.entries(CODEX_ZONE_REGISTRY).reduce<Record<string, number>>(
  (accumulator, [zoneId, zoneName]) => {
    accumulator[zoneName] = Number(zoneId);
    return accumulator;
  },
  {}
);

export function resolveZoneName(zoneName: string): CodexZoneName | null {
  if (zoneName in CODEX_ZONE_NAME_ALIASES) {
    return CODEX_ZONE_NAME_ALIASES[zoneName as CodexZoneAlias];
  }

  if (zoneName in zoneNameToId) {
    return zoneName as CodexZoneName;
  }

  return null;
}

export function getZoneIdByName(zoneName: string): number {
  const resolvedName = resolveZoneName(zoneName);
  if (!resolvedName) {
    return -1;
  }

  return zoneNameToId[resolvedName] ?? -1;
}

export function getZoneNameById(zoneId: number): string {
  return CODEX_ZONE_REGISTRY[zoneId as CodexZoneId] ?? 'unknown';
}

export function getZoneRegistryEntries(): Array<{ id: number; name: string }> {
  return Object.entries(CODEX_ZONE_REGISTRY).map(([zoneId, zoneName]) => ({
    id: Number(zoneId),
    name: zoneName,
  }));
}
