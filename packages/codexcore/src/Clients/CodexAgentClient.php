<?php

namespace Web3Codex\CodexCore\Clients;

/**
 * AI: Check aiPrompt.md in projects root directory - For More Details
 *
 * CodexAgentClient - API Client for AI Agent Communication
 *
 * This client provides methods to interact with the Codex AI Agent service.
 * Facilitates communication between the admin interface and AI agents.
 *
 * PURPOSE: API client for AI agent service communication.
 * DESIGN: RESTful API client with real-time agent monitoring.
 * INTEGRATION: Connects CodexAdmin to AI agents, supports CodexMind orchestration.
 *
 * Key Features:
 * - Agent status monitoring
 * - Task assignment and management
 * - Real-time communication with AI agents
 * - Health check and diagnostics
 *
 * @package CodexCore
 * @author  Web3Connected
 * @version 1.0.0
 * @license MIT
 */

use Web3Codex\CodexCore\Services\Sync\CodexConnectService;

class CodexAgentClient
{
    protected CodexConnectService $connect;

    public function __construct(CodexConnectService $connect)
    {
        $this->connect = $connect->setBaseUrl(config('codex.agent.url', 'http://localhost:50001/api/agent'));
    }

    /**
     * Get the current status of the agent
     */
    public function getStatus(): array
    {
        return $this->connect->get('/status');
    }
}
