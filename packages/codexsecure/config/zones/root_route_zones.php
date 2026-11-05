<?php

/**
 * CodexAuth Route Zones Configuration
 *
 * CodexAuth is a pure API service. Only API zones are registered here.
 * Add a zone entry when a routes/api/zones/ZN/ folder exists for it.
 *
 * - Z2 (Identity): Authentication and identity management endpoints.
 */

return [

    // Z2 - Identity (API)
    'Z2_api' => [
        'zone_id' => 2,
        'name' => 'identity_api',
        'prefixes' => ['api'],
        'description' => 'Codex Identity API Endpoints',
        'middleware' => ['api', 'codex.zone:2'],
        'route_files' => [
            'routes/api/zones/Z2/identity.php'
        ],
        'zoned_routes' => [],
    ],

];
