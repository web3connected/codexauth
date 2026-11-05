<?php

return [
    /*
    |--------------------------------------------------------------------------
    | CodexCore Configuration
    |--------------------------------------------------------------------------
    |
    | Core configuration for Codex system services, zones, and utilities.
    |
    */

    'version' => '2.0.0',

    'cache' => [
        'prefix' => env('CODEX_CORE_CACHE_PREFIX', 'codex_core'),
        'ttl' => env('CODEX_CORE_CACHE_TTL', 3600),
        'driver' => env('CODEX_CORE_CACHE_DRIVER', 'redis'),
    ],

    'services' => [
        'zones_enabled' => env('CODEX_ZONES_ENABLED', false),
        'auto_register' => env('CODEX_CORE_AUTO_REGISTER', true),
        'health_check_enabled' => env('CODEX_CORE_HEALTH_CHECK', true),
    ],

    'logging' => [
        'enabled' => env('CODEX_CORE_LOGGING', true),
        'level' => env('CODEX_CORE_LOG_LEVEL', 'info'),
        'channel' => env('CODEX_CORE_LOG_CHANNEL', 'stack'),
    ],

    // Zone Registry - 12 Harmonic Zones
    'zone_registry' => [
        0 => 'negative',
        1 => 'public',
        2 => 'identity',
        3 => 'ops',
        4 => 'protected',
        5 => 'system',
        6 => 'eventlogs',
        7 => 'comms',
        8 => 'payments',
        9 => 'analytics',
        10 => 'behavior',
        11 => 'realtime',
        12 => 'admin',
    ],

    // Zone Analysis
    'zone_analysis' => [
        'max_samples' => env('CODEX_ZONE_MAX_SAMPLES', 100),
        'tolerance_window' => env('CODEX_ZONE_TOLERANCE', 0.03),
        'outlier_multiplier' => env('CODEX_ZONE_OUTLIER_MULTIPLIER', 1.8),
        'stabilization_logging' => env('CODEX_ZONE_DEBUG', false),
        'sync_threshold' => env('CODEX_TIU_SYNC_THRESHOLD', 0.01),
        'drift_tolerance' => env('CODEX_DRIFT_TOLERANCE', 0.05),
    ],

    // Route Analysis
    'route_analysis' => [
        'system_zone_id' => 5,
        'unassigned_zone_id' => -1,
        'max_unassigned_warnings' => 10,
        'cache_ttl' => env('CODEX_ROUTE_CACHE_TTL', 3600),
    ],

    // Sync Configuration
    'sync' => [
        'enabled' => env('CODEX_SYNC_ENABLED', true),
        'auto_repair' => env('CODEX_SYNC_AUTO_REPAIR', false),
        'health_check_interval' => env('CODEX_SYNC_HEALTH_INTERVAL', 300),
    ],
];
