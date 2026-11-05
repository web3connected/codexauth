<?php

namespace Web3Codex\CodexSecure\Services;

/**
 * CodexSecureCore provides a secure core for Codex services,
 * integrating harmonic hashing, time synchronization, ethos validation,
 * and caching mechanisms.
 *
 * This class is designed to be used as a base for more specific Codex services
 * that require secure operations and validations.
 */

use Web3Codex\CodexCore\Support\CodexCache;
use Web3Codex\CodexCore\Support\CodexEthosLattice;
use Web3Codex\CodexTime\Services\CodexTime;
use Web3Codex\CodexHash\Services\CodexHarmonicHash;

class CodexSecureCore
{
    protected $codex; // CodexHarmonicHash|CodexHashClient
    protected $time;  // CodexTime|CodexTimeClient
    protected CodexEthosLattice $ethos;
    protected CodexCache $cache;

    protected float $defaultBuffer;
    protected bool $strictMode;

    public function __construct(
        $codex = null, // CodexHarmonicHash|CodexHashClient|null
        $time = null,  // CodexTime|CodexTimeClient|null
        ?CodexEthosLattice $ethos = null,
        ?CodexCache $cache = null
    ) {
        $this->codex = $codex;
        $this->time = $time;
        $this->ethos = $ethos ?? new CodexEthosLattice();
        $this->cache = $cache ?? app(CodexCache::class);

        $this->defaultBuffer = config('codexsecure.buffer', 0.000001);
        $this->strictMode = config('codexsecure.strict_mode', false); // Using helper function
    }


    public function cache(): CodexCache
    {
        return $this->cache;
    }

    // codex() and time() methods removed for client compatibility

    public function ethos(): CodexEthosLattice
    {
        return $this->ethos;
    }

    public function getBuffer(?bool $overrideStrict = null): float
    {
        return ($overrideStrict ?? $this->strictMode) ? 0.0 : $this->defaultBuffer;
    }

    public function validateTiuSync(?float $referenceTiu = null, float $tolerance = 0.01): bool
    {
        $cache = $this->cache; // Use injected cache instead of app()
        $key = 'codex:tiu_sync';

        $currentTiu = $this->time->currentTiu();
        $cachedTiu = $cache->get($key);

        // If no sync has been cached yet, trust current TIU
        if (is_null($cachedTiu)) {
            $cache->put($key, $currentTiu, 1800);
            $cache->put("{$key}_timestamp", $this->time->now()->toDateTimeString(), 1800);
            return true;
        }


        $targetTiu = $referenceTiu ?? (float) $cachedTiu;

        if (!$this->time->validateDrift($targetTiu, $currentTiu, $tolerance)) {
            return false;
        }

        // Ethos validation (Z2: Time)
        $this->ethos->validate(
            CodexEthosLattice::ZONE_TIME,
            [
                'reference' => $targetTiu,
                'current' => $currentTiu,
                'tolerance' => $tolerance,
            ]
        );

        // Drift acceptable, update the sync cache
        $cache->put($key, $currentTiu, 1800);
        $cache->put("{$key}_timestamp", $this->time->now()->toDateTimeString(), 1800);

        return true;
    }

    protected function buildDeviceKey(string $deviceUID, ?string $agentString = null): string
    {
        return codex_build_device_key($deviceUID, $agentString);
    }

    protected function fingerprintAgent(string $agentString): string
    {
        return codex_fingerprint_agent($agentString);
    }

    public function getSalt(): ?string
    {
        return $this->codex->getSalt();
    }

    public function getTIU(): ?float
    {
        return $this->codex->getTIU();
    }

    /**
     * Enhanced device validation with rate limiting
     */
    public function validateDevice(
        string $deviceUID,
        ?string $agentString = null,
        int $rateLimit = 5
    ): bool {
        $key = $this->buildDeviceKey($deviceUID, $agentString);
        $cacheKey = "device_validate:{$key}";

        $attempts = (int) $this->cache->get($cacheKey, 0);
        if ($attempts >= $rateLimit) {
            return false;
        }

        $this->cache->put($cacheKey, $attempts + 1, now()->addMinutes(15)->timestamp - now()->timestamp);
        return true;
    }

    /**
     * Get client IP with normalization
     */
    public function getClientIp(): string
    {
        $ip = request()->ip() ?? 'unknown';
        return normalizeIp($ip); // Using helper function
    }
}
