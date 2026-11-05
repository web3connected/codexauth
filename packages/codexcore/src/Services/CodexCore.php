<?php

namespace Web3Codex\CodexCore\Services;

/**
 * AI: Check aiPrompt.md in projects root directory - For More Details
 *
 * CodexCore is the central manager for all core Codex services.
 *
 * This is the heart of the Web3Connected ecosystem, coordinating all services:
 * - CodexHash     : Quantum Hashing system for SEO optimization
 * - CodexSecure   : Quantum-Aware Secure User Management & Authentication
 * - CodexIdentity : Decentralized Identity Management via IPFS
 * - CodexZones    : Harmonic Route Zone Management for traffic control
 * - CodexTime     : Quantum Time synchronization providing heartbeat to CodexMind
 * - CodexMind     : Dual hemisphere cognitive AI system (orchestrated via n8n)
 *
 * ARCHITECTURE NOTE: This service acts as the central orchestrator,
 * similar to a conductor managing all sections of an orchestra.
 *
 * @package CodexCore
 * @author  Web3Connected
 * @version 1.0.0
 * @license MIT
 */

use Web3Codex\CodexCore\Support\CodexCache;
use Web3Codex\CodexCore\Support\CodexEthosLattice;
use Web3Codex\CodexTime\Services\CodexTime;
use Web3Codex\CodexSecure\Services\CodexSecure;
use Web3Codex\CodexIdentity\Services\CodexIdentity;
use Web3Codex\CodexHash\Services\CodexHarmonicHash;
use Web3Codex\CodexHash\Services\CodexHashService as CodexHash;
use Web3Codex\CodexZones\Services\CodexRouteServer as CodexZones;

class CodexCore
{
    protected CodexHash $hash;
    protected CodexSecure $secure;
    protected CodexIdentity $identity;
    protected CodexZones $zones;
    protected CodexCache $cache;

    public function __construct(
        ?CodexCache $cache = null
    ) {
        $this->cache = $cache ?? new CodexCache([
            'prefix' => 'codex_core'
        ]);

        // Services will be resolved through service provider, not here
        // This avoids circular dependency issues during bootstrap
    }

    public function hash(): CodexHash
    {
        return $this->hash;
    }

    public function secure(): CodexSecure
    {
        return $this->secure;
    }

    public function identity(): CodexIdentity
    {
        return $this->identity;
    }

    public function zones(): CodexZones
    {
        return $this->zones;
    }

    public function cache(): CodexCache
    {
        return $this->cache;
    }

    /**
     * Get version information for all Codex services
     */
    public function version(): array
    {
        return [
            'codex_core' => '2.0.0',
            'services' => [
                'hash' => $this->hash->version(),
                'secure' => $this->secure->version(),
                'identity' => $this->identity->version(),
                'zones' => $this->zones->version(),
            ]
        ];
    }

    /**
     * Health check for all services
     */
    public function healthCheck(): array
    {
        return [
            'status' => 'healthy',
            'services' => [
                'hash' => $this->hash->healthCheck(),
                'secure' => $this->secure->healthCheck(),
                'identity' => $this->identity->healthCheck(),
                'zones' => $this->zones->healthCheck()

            ]
        ];
    }

}
