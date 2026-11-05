<?php

namespace Web3Codex\CodexAuth\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * CodexAuth Facade
 *
 * @package Web3Codex\CodexAuth
 * @version 2.0.0
 *
 * @method static array orchestrateAuthentication(array $credentials)
 * @method static bool validateDevice(string $deviceId)
 * @method static array getSessionInfo(string $sessionId)
 * @method static array getStatus()
 *
 * @see \Web3Codex\CodexAuth\Services\CodexAuthOrchestrator
 * @see \Web3Codex\CodexAuth\Services\CodexDevices
 * @see \Web3Codex\CodexAuth\Services\CodexSession
 * @see \Web3Codex\CodexAuth\Clients\CodexAuthClient
 */
class CodexAuth extends Facade
{
    /**
     * Get the registered name of the component.
     */
    protected static function getFacadeAccessor(): string
    {
        return 'codex.auth.orchestrator';
    }
}
