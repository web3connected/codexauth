<?php

namespace Web3Codex\CodexSecure\Support;

use App\Facades\CodexSecure;
use Illuminate\Http\Request;
use App\Models\Codex\HarmonicZone;
use App\Models\Codex\ResonanceLog;
use Illuminate\Support\Facades\Log;
use App\Support\CodexZoneStrategies;
use Illuminate\Support\Facades\Cache;
use App\Exceptions\CodexZoneViolation;
use App\Services\Zones\CodexRouteAnalyzer;

class CodexZoneGuard
{
    protected static $configCache = [];
    protected static $zoneCache = [];

    /**
     * Stabilize the zone learning process with optimized outlier detection
     */
    public static function stabilize(HarmonicZone $zone, int $currentHash, ?int $agentId = null): void
    {
        $config = self::getCachedConfig('codex.zone', [
            'max_samples' => 50,
            'tolerance_window' => 0.05,
            'outlier_multiplier' => 2,
            'stabilization_logging' => true
        ]);

        if ($zone->sample_count >= $config['max_samples']) return;

        $currentDistance = abs($currentHash - $zone->average);
        $range = $zone->max - $zone->min;
        $tolerance = max(1, $range * $config['tolerance_window']);

        if ($currentDistance <= ($tolerance * $config['outlier_multiplier'])) {
            $zone->update([
                'average' => ($zone->average * $zone->sample_count + $currentHash) /
                    ($zone->sample_count + 1),
                'sample_count' => $zone->sample_count + 1
            ]);
        } else {
            self::logOutlier($zone, $currentHash, $currentDistance, $agentId, $config);
        }
    }

    /**
     * Analyze request with enhanced security checks
     */
    public static function analyze(Request $request): void
    {
        $route = $request->route();
        $method = $request->method();

        // Cache zone detection per route/method
        $cacheKey = 'zone_guard:' . md5($route->uri() . $method);
        $analysis = Cache::remember($cacheKey, 3600, function () use ($route) {
            return app(CodexRouteAnalyzer::class)->analyzeRoute($route);
        });

        $zoneId = $analysis['zone_id'] ?? null;
        $zoneConfig = $zoneId ? self::getZoneConfig($zoneId) : null;

        if (!$zoneConfig) {
            throw new CodexZoneViolation('Unauthorized Zone Access', 403);
        }

        // 1. Validate HTTP methods
        self::validateMethods($method, $zoneConfig);

        // 2. Verify TIU sync (if enabled)
        if (class_exists(CodexSecure::class)) {
            CodexSecure::validateTiuSync() || throw new CodexZoneViolation('TIU Drift Detected', 440);
        }

        // 3. Session integrity check
        session()->has('codex_token') || throw new CodexZoneViolation('Session Token Missing', 419);

        // 4. Advanced zone strategy validation
        self::validateZoneStrategy($route, $zoneId);
    }

    protected static function logOutlier(HarmonicZone $zone, int $hash, float $distance, ?int $agentId, array $config): void
    {
        ResonanceLog::create([
            'zone_id' => $zone->id,
            'agent_id' => $agentId,
            'type' => 'outlier',
            'value' => $distance,
            'context' => [
                'hash' => $hash,
                'zone_average' => $zone->average,
                'min' => $zone->min,
                'max' => $zone->max,
            ],
            'detected_at' => now(),
        ]);

        if ($config['stabilization_logging']) {
            Log::warning("ZoneGuard: Outlier in zone {$zone->zone}", [
                'hash' => $hash,
                'distance' => $distance,
                'tolerance' => $config['tolerance_window'],
                'agent' => $agentId
            ]);
        }
    }

    protected static function validateMethods(string $method, array $zoneConfig): void
    {
        $allowedMethods = $zoneConfig['rules']['methods_allowed'] ?? [];
        if ($allowedMethods && !in_array(strtoupper($method), $allowedMethods, true)) {
            throw new CodexZoneViolation("Method {$method} not allowed", 405);
        }
    }

    protected static function validateZoneStrategy($route, int $zoneId): void
    {
        $detectedZone = app(CodexZoneStrategies::class)->detectRouteZone($route);
        $registry = config('zone_registry', []);
        $expectedZone = $registry[$zoneId] ?? null;

        if ($expectedZone && $detectedZone !== $expectedZone) {
            throw new CodexZoneViolation("Zone strategy mismatch: {$detectedZone} vs {$expectedZone}", 409);
        }
    }

    protected static function getCachedConfig(string $key, array $defaults): array
    {
        if (!isset(self::$configCache[$key])) {
            self::$configCache[$key] = array_merge($defaults, config($key, []));
        }
        return self::$configCache[$key];
    }

    protected static function getZoneConfig(int $zoneId): ?array
    {
        if (!isset(self::$zoneCache[$zoneId])) {
            $zones = config('codex.zones', []);
            self::$zoneCache[$zoneId] = $zones[$zoneId] ?? null;
        }
        return self::$zoneCache[$zoneId];
    }

    public static function cacheConfig(string $key, $value): void
    {
        self::$configCache[$key] = $value;
    }
    public static function clearCache(): void
    {
        self::$configCache = [];
        self::$zoneCache = [];
    }
}
