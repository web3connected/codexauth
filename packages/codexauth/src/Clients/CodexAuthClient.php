<?php

namespace Web3Codex\CodexAuth\Clients;

/**
 * AI: Check aiPrompts.md on projects root directory - For More Deteails
 * CodexAuthClient is a client for interacting with the Codex Auth service.
 *
 * This client provides methods to interact with the authentication service,
 * such as checking the status of the agent.
 */

use Web3Codex\CodexCore\Services\Sync\CodexConnectService; // Ensure this is the correct import path

class CodexAuthClient
{
    protected CodexConnectService $connect;

    public function __construct(CodexConnectService $connect)
    {
        $this->connect = $connect->setBaseUrl(config('codex.auth.url', 'http://localhost:50001/api/auth'));
    }

    /**
     * Get the current status of the agent
     */
    public function getStatus(): array
    {
        return $this->connect->get('/status');
    }
}
