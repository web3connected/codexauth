<?php

namespace Web3Codex\CodexSecure\Services\Zones;

class CodexRouteServer
{
    // --------------------------------------------------------------------------
    // System-Level Routes (not zone-bound)
    // --------------------------------------------------------------------------
    public static function SystemRouteConfig()
    {
        return [
            'name' => 'System Route Config',
            'description' => 'System-level route configuration.',
            'method' => 'GET',
            'path' => '/system/route-config',
            'auth_required' => false,
            'meta' => [
                'http_errors' => [
                    '303' => 'See Other',
                    '400' => 'Bad Request',
                    '401' => 'Unauthorized',
                    '402' => 'Payment Required',
                    '403' => 'Forbidden',
                    '404' => 'Not Found',
                    '405' => 'Method Not Allowed',
                    '500' => 'Internal Server Error',
                ]
            ],
        ];
    }


    public static function Zone0($zoneDef = [])
    {
        return [
            'name' => 'Negative Zone',
            'description' => 'For spam and other undesirable content. Read-only quarantine.',
            'rules' => [
                'auth_required' => false,
                'tiu_required' => false,
                'read_only' => true,
                'methods_allowed' => ['GET'], // ⛔️ no write operations
            ],
            'subzones' => $zoneDef
        ];
    }


    public static function Zone1($zoneDef = [])
    {
        return [
            'name' => 'Public',
            'description' => 'Open access zone for general content, forms, and guest writes.',
            'rules' => [
                'auth_required' => false,
                'tiu_required' => false,
                'read_only' => false, // ⛔ We need to accept POSTs here
                'methods_allowed' => [
                    'GET',      // fetch login form, reset status
                    'POST',     // login, register, reset
                    'OPTIONS'   // CORS / preflight
                ],
            ],
            'subzones' => $zoneDef
        ];
    }


    public static function Zone2($zoneDef = [])
    {
        return [
            'name' => 'Identity',
            'description' => 'Handles authentication, login, reset, and identity creation flows.',
            'rules' => [
                'auth_required' => false,
                'tiu_required' => true,
                'read_only' => false,
                'methods_allowed' => [
                    'GET',      // fetch login form, reset status
                    'POST',     // login, register, reset
                    'OPTIONS'   // CORS / preflight
                ],
            ],
            'subzones' => $zoneDef
        ];
    }


    public static function Zone3($zoneDef = [])
    {
        return [
            'name' => 'Agent Ops',
            'description' => 'Real-time logic between Codex agents and mesh control. Requires full sync + auth.',
            'rules' => [
                'auth_required' => true,                   // Must be logged in
                'tiu_required' => true,                    // Codex secure sync required
                'read_only' => false,                      // Agents both read + write state
                'methods_allowed' => [
                    'GET',      // Read agent status, task queues
                    'POST',     // Push new tasks to agent
                    'PUT',      // Update full agent config/state
                    'PATCH',    // Update partial agent settings
                    'DELETE',   // Remove task, terminate agent session
                    'OPTIONS'   // Required for CORS/preflight
                ],
            ],
            'subzones' => $zoneDef
        ];
    }


    public static function Zone4($zoneDef = [])
    {
        return [
            'name' => 'Protected Data Flow',
            'description' => 'Handles secure incoming data (uploads, forms, protected APIs). Requires auth + sync.',
            'rules' => [
                'auth_required' => true,
                'tiu_required' => true,
                'read_only' => false,
                'methods_allowed' => [
                    'GET',      // fetch form schema, validation rules
                    'POST',     // form submission, file upload, webhook hit
                    'PUT',      // full data overwrite (e.g. profile image replace)
                    'PATCH',    // partial updates (e.g. form step update)
                    'OPTIONS'   // CORS/preflight
                    // ❌ DELETE is typically avoided here to prevent data loss on input channels
                ],
            ],
            'subzones' => $zoneDef
        ];
    }

    public static function Zone5($zoneDef = [])
    {
        return [
            'name' => 'System Execution',
            'description' => 'Handles job queues, worker tasks, and system-level operations. High-trust zone.',
            'rules' => [
                'auth_required' => true,
                'tiu_required' => true,
                'read_only' => false,
                'methods_allowed' => [
                    'GET',      // View task queue, system status
                    'POST',     // Queue a new job or execution request
                    'PUT',      // Replace job config or job state
                    'PATCH',    // Update job priority or progress
                    'DELETE',   // Cancel/terminate a job
                    'OPTIONS'   // Required for API integrations
                ],
            ],
            'subzones' => $zoneDef
        ];
    }


    public static function Zone6($zoneDef = [])
    {
        return [
            'name' => 'Event Logging',
            'description' => 'Captures user actions, system events, and trace-level logs. Mostly write with limited reads.',
            'rules' => [
                'auth_required' => true,
                'tiu_required' => false,
                'read_only' => false,
                'methods_allowed' => [
                    'GET',      // Retrieve event summaries or trace snapshots
                    'POST',     // Submit logs, user events, webhooks
                    'OPTIONS'   // Allow for CORS-safe client logging
                    // ⚠️ No PUT/PATCH/DELETE — logs should not be editable or deletable
                ],
            ],
            'subzones' => $zoneDef
        ];
    }


    public static function Zone7($zoneDef = [])
    {
        return [
            'name' => 'Comms & Alerts',
            'description' => 'Handles outbound notifications, email triggers, and real-time push events.',
            'rules' => [
                'auth_required' => true,
                'tiu_required' => false,
                'read_only' => false,
                'methods_allowed' => [
                    'POST',     // Trigger alert, send notification
                    'GET',      // Query sent logs or message queue
                    'OPTIONS'   // CORS-safe preflight
                    // ⚠️ No PUT, PATCH, DELETE — outbound messages are fire-and-forget
                ],
            ],
            'subzones' => $zoneDef
        ];
    }

    public static function Zone8($zoneDef = [])
    {
        return [
            'name' => 'Resource Sync',
            'description' => 'Handles data exports, external system syncs, and asset handoffs.',
            'rules' => [
                'auth_required' => true,
                'tiu_required' => true,
                'read_only' => false,
                'methods_allowed' => [
                    'GET',      // Export data, fetch sync state
                    'POST',     // Push data to external bridge
                    'PUT',      // Replace sync resource (e.g. external schema)
                    'PATCH',    // Partial update to sync configs
                    'OPTIONS'   // Required for CORS/API interop
                    // ⚠️ DELETE optional, use only if system allows external resource teardown
                ],
            ],
            'subzones' => $zoneDef
        ];
    }


    public static function Zone9($zoneDef = [])
    {
        return [
            'name' => 'Analytics Layer',
            'description' => 'Read-only access to reports, charts, metrics, and visual system data.',
            'rules' => [
                'auth_required' => true,
                'tiu_required' => false,
                'read_only' => true,
                'methods_allowed' => [
                    'GET',      // Fetch reports, visual data, insights
                    'OPTIONS'   // Preflight for secure dashboards or APIs
                    // ❌ No POST, PUT, PATCH, DELETE — this zone never modifies data
                ],
            ],
            'subzones' => $zoneDef
        ];
    }


    public static function Zone10($zoneDef = [])
    {
        return [
            'name' => 'Behavior Logic',
            'description' => 'Handles system behavior rules, A/B tests, predictions, and decision models.',
            'rules' => [
                'auth_required' => true,
                'tiu_required' => true,
                'read_only' => false,
                'methods_allowed' => [
                    'GET',      // Fetch rule sets, decision outputs
                    'POST',     // Submit data to trigger behavior logic
                    'PUT',      // Replace logic model or test variant
                    'PATCH',    // Adjust decision weight, flag override
                    'OPTIONS'   // Preflight support for API triggers
                    // ❌ DELETE typically locked — models shouldn’t be wiped casually
                ],
            ],
            'subzones' => $zoneDef
        ];
    }


    public static function Zone11($zoneDef = [])
    {
        return [
            'name' => 'AI / Agent Mesh',
            'description' => 'Codex AI mesh orchestration, agent-to-agent communication, and private control messages.',
            'rules' => [
                'auth_required' => true,
                'tiu_required' => true,
                'read_only' => false,         // System needs write
                'executive' => true,          // Only privileged actors can modify
                'methods_allowed' => [
                    'GET',
                    'POST',
                    'PATCH',
                    'OPTIONS'
                ],
            ],
            'subzones' => $zoneDef
        ];
    }


    public static function Zone12($zoneDef = [])
    {
        return [
            'name' => 'Sys Admin Sync',
            'description' => 'Root system oversight, admin interface, and emergency override control for Codex operations.',
            'rules' => [
                'auth_required' => true,
                'tiu_required' => true,
                'read_only' => false,
                'executive' => true, // 🚨 Only executive/programmatic control
                'methods_allowed' => [
                    'GET',      // Monitor system, view override state
                    'POST',     // Trigger override scripts, emergency actions
                    'PUT',      // Push full config resets or fallback schema
                    'PATCH',    // Adjust live sync flags or override rules
                    'DELETE',   // (Rare) Teardown or kill node/system if authorized
                    'OPTIONS'   // Required for secure API interfaces
                ],
            ],
            'subzones' => $zoneDef
        ];
    }
    public static function All()
    {
        return [
            'system' => self::SystemRouteConfig(),
            0 => self::Zone0(),
            1 => self::Zone1(),
            2 => self::Zone2(),
            3 => self::Zone3(),
            4 => self::Zone4(),
            5 => self::Zone5(),
            6 => self::Zone6(),
            7 => self::Zone7(),
            8 => self::Zone8(),
            9 => self::Zone9(),
            10 => self::Zone10(),
            11 => self::Zone11(),
            12 => self::Zone12(),
        ];
    }
}
