<?php

/**
 * CodexSecure Configuration
 *
 * @package Web3Codex\CodexSecure
 * @version 2.0.0
 * @license MIT
 */

return [

    // Core Settings
    'environment' => env('APP_ENV', 'production'),
    'enabled' => env('CODEX_SECURE_ENABLED', true),
    'codex_zones_enabled' => env('CODEX_ZONES_ENABLED', false),

    // Session Management
    'session' => [
        'lifetime' => env('CODEX_SESSION_LIFETIME', 15), // Minutes
        'token_store' => env('CODEX_TOKEN_STORE', 'cache'), // cache, database, redis
        'encrypt_tokens' => true,
        'inactivity_timeout' => 30, // Minutes
        'concurrent_sessions' => [
            'enabled' => true,
            'max_sessions' => 3,
            'strategy' => 'logout_oldest', // logout_oldest|prevent_new
        ],
    ],

    // Security Protections
    'security' => [
        'max_failed_attempts' => env('CODEX_MAX_ATTEMPTS', 5),
        'lockout_duration' => env('CODEX_LOCKOUT_DURATION', 120), // Seconds
        'strict_mode' => env('CODEX_STRICT_MODE', false),
        'ip_banning' => [
            'enabled' => true,
            'attempts_threshold' => 10,
            'duration' => 86400, // 24 hours
        ],
        'request_throttling' => [
            'enabled' => true,
            'max_requests' => 100,
            'interval' => 1, // Minutes
        ],
    ],

    // Monitoring & Logging
    'monitoring' => [
        'log_events' => env('CODEX_LOG_EVENTS', true),
        'log_driver' => env('CODEX_LOG_DRIVER', 'stack'),
        'verify_route_protection' => true,
        'sensitive_parameters' => ['password', 'token', 'secret'],
    ],

    // Ethos Security Framework
    'ethos' => [
        'enabled' => env('CODEX_ETHOS_ENABLED', true),
        'zones' => [
            'enforced' => explode(',', env('CODEX_ETHOS_ZONES', 'Z1,Z7,Z8,Z11')),
            'validation_mode' => 'strict', // strict|moderate|flexible
        ],
        'tracking' => [
            'log_resonance' => true,
            'store_method' => env('CODEX_ETHOS_STORE', 'cache'),
            'retention_period' => 30, // Days
        ],
        'behavioral_analysis' => [
            'enabled' => true,
            'anomaly_threshold' => 0.7,
        ],
    ],

    // Device Management
    'require_trusted_device' => env('CODEX_REQUIRE_TRUSTED_DEVICE', false),
    'min_trust_score' => env('CODEX_MIN_TRUST_SCORE', 50),

    // Advanced Security
    'advanced' => [
        'hsts' => [
            'enabled' => true,
            'max_age' => 31536000,
            'include_subdomains' => true,
            'preload' => false,
        ],
        'csp' => [
            'enabled' => false,
            'directives' => [
                'default-src' => "'self'",
                'script-src' => "'self' 'unsafe-inline'",
                'style-src' => "'self' 'unsafe-inline'",
            ],
        ],
        'rate_limiting' => [
            'strategy' => 'token_bucket',
            'storage' => 'cache',
        ],
    ],

    // Zone Management
    'zone' => [
        'max_samples' => 100,
        'tolerance_window' => 0.03,
        'outlier_multiplier' => 1.8,
        'stabilization_logging' => env('APP_DEBUG', false)
    ],

    // Legacy Compatibility
    'version' => '2.0.0',
    'max_tiu_drift' => config('codextime.max_tiu_drift', env('CODEX_TIME_MAX_TIU_DRIFT', 1800)),
    'device_verification' => env('CODEX_SECURE_DEVICE_VERIFICATION', true),
];
