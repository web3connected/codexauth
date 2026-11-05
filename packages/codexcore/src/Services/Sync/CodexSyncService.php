<?php

namespace Web3Codex\CodexCore\Services\Sync;

/**
 * CodexSyncService
 *
 * This service is responsible for managing the synchronization of harmonic zones.
 * It includes methods for checking zone drift, quarantining zones, resyncing zones,
 * calculating system health, and repairing drift.
 *
 * @version 2.0.0
 * @package Web3Codex\CodexCore\Services\Sync
 */

use Web3Codex\CodexCore\Models\HarmonicZone;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CodexSyncService
{
    protected function driftTolerance(): float
    {
        return (float) config('codexsecure.drift_tolerance', 0.05);
    }

    protected function computeDrift(HarmonicZone $zone): ?float
    {
        if ($zone->sample_count === 0) {
            return null;
        }

        $range = max(1, $zone->max - $zone->min);
        return abs($zone->hash_value - $zone->average) / $range;
    }

    public function checkZoneDrift(HarmonicZone $zone): array
    {
        $drift = $this->computeDrift($zone);

        if ($drift === null) {
            return [
                'status' => 'no-sample',
                'drift' => null,
                'tolerance' => null,
            ];
        }

        $tolerance = $this->driftTolerance();

        $status = $drift <= $tolerance ? 'pass' : 'fail';

        return [
            'status' => $status,
            'drift' => $drift,
            'tolerance' => $tolerance,
        ];
    }

    public function quarantineZone(HarmonicZone $zone): void
    {
        $zone->update([
            'status' => 'quarantined',
            'quarantined_at' => now(),
        ]);
    }

    public function resyncZone(HarmonicZone $zone): void
    {
        if ($zone->status !== 'quarantined') {
            return;
        }

        if ($zone->sample_count === 0) {
            return; // Nothing to resync
        }

        $old = [
            'min' => $zone->min,
            'max' => $zone->max,
            'average' => $zone->average,
            'status' => $zone->status,
            'quarantined_at' => $zone->quarantined_at,
        ];

        $newHash = $zone->hash_value;
        $rangeHalf = intval(($zone->max - $zone->min) / 2);

        $new = [
            'min' => $newHash - $rangeHalf,
            'max' => $newHash + $rangeHalf,
            'average' => $newHash,
            'status' => 'active', // 🔥 Bring zone back alive
            'quarantined_at' => null, // Clear quarantine if exists
        ];

        $zone->update($new);

        $actorId = null;
        try {
            $actorId = Auth::id();
        } catch (\Throwable $e) {
            $actorId = null;
        }

        Log::warning('Zone resync executed', [
            'zone_id' => $zone->id,
            'actor_id' => $actorId,
            'old' => $old,
            'new' => $new,
        ]);
    }

    public function calculateSystemHealth(): array
    {
        // [PREP-PHASE] Respect configuration flag.
        // If zones are disabled (default in prep), return mocked 'healthy' or 'disabled' status.
        if (!config('codexsecure.codex_zones_enabled', false)) {
            return [
                'total_zones' => 12, // Mocked for UI stability during prep
                'synced_zones' => 12,
                'active_zones' => 12,
                'quarantined_zones' => 0,
                'synced_active_zones' => 12,
                'sync_rate' => 100.0,
                'active_sync_rate' => 100.0,
                'status' => 'zones_disabled_prep_mode'
            ];
        }

        try {
            // [PREP-PHASE] Safeguard DB access
            $zones = HarmonicZone::all();
        } catch (\Illuminate\Database\QueryException $e) {
            // Log::warning('CodexSecure DB not ready, skipping sync check');
            return [
                'total_zones' => 0,
                'synced_zones' => 0,
                'active_zones' => 0,
                'quarantined_zones' => 0,
                'synced_active_zones' => 0,
                'sync_rate' => 0.0,
                'active_sync_rate' => 0.0,
                'status' => 'system_not_ready'
            ];
        }

        $total = $zones->count();

        if ($total === 0) {
            return [
                'total_zones' => 0,
                'synced_zones' => 0,
                'active_zones' => 0,
                'quarantined_zones' => 0,
                'synced_active_zones' => 0,
                'sync_rate' => 0.0,
                'active_sync_rate' => 0.0,
            ];
        }

        $tolerance = $this->driftTolerance();

        $activeZones = $zones->where('status', 'active');
        $quarantinedZones = $zones->where('status', 'quarantined');

        $syncedActive = $activeZones->filter(function ($zone) use ($tolerance) {
            $drift = $this->computeDrift($zone);
            return $drift !== null && $drift <= $tolerance;
        })->count();

        $activeTotal = $activeZones->count();

        return [
            'total_zones' => $total,
            'synced_zones' => $syncedActive,
            'active_zones' => $activeTotal,
            'quarantined_zones' => $quarantinedZones->count(),
            'synced_active_zones' => $syncedActive,
            'sync_rate' => round(($syncedActive / $total) * 100, 2), // 📈 % system sync
            'active_sync_rate' => $activeTotal > 0 ? round(($syncedActive / $activeTotal) * 100, 2) : 0.0,
        ];
    }

    public function repairDrift(HarmonicZone $zone): bool
    {
        if (!$zone) {
            return false;
        }

        if ($zone->sample_count === 0) {
            $zone->update([
                'average' => $zone->hash_value,
                'sample_count' => 1,
            ]);

            return true;
        }

        $tolerance = $this->driftTolerance();
        $drift = $this->computeDrift($zone);

        if ($drift === null) {
            return false;
        }

        // If it's already within tolerance, no repair needed
        if ($drift <= $tolerance) {
            return true;
        }

        // Slow adjustment: move average slightly toward latest hash_value
        $newSampleCount = $zone->sample_count + 1;
        $newAverage = (($zone->average * $zone->sample_count) + $zone->hash_value) / $newSampleCount;

        $zone->update([
            'average' => $newAverage,
            'sample_count' => $newSampleCount,
        ]);

        return true;
    }
}
