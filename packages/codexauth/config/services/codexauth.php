<?php

return [
    /*
    |--------------------------------------------------------------------------
    | CodexAuth Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for Codex authentication system with Harmonic Hash
    | temporal synchronization via Time Index Units (TIU).
    |
    */

    'version' => '2.0.0',

    // User model to use for authentication
    'user_model' => env('CODEX_AUTH_USER_MODEL', 'App\\Models\\Admin\\Admin'),

    // Session configuration
    'session_lifetime' => env('CODEX_AUTH_SESSION_LIFETIME', 3600), // seconds
    'max_devices' => env('CODEX_AUTH_MAX_DEVICES', 3),
    'trust_threshold' => env('CODEX_AUTH_TRUST_THRESHOLD', 50),

    // Token configuration
    'token_lifetime' => env('CODEX_AUTH_TOKEN_LIFETIME', 3600), // seconds
    'token_rounds' => env('CODEX_AUTH_TOKEN_ROUNDS', 12),

    // TIU (Time Index Unit) configuration
    'max_tiu_drift' => env('CODEX_AUTH_MAX_TIU_DRIFT', 2.5),
    'challenge_lifetime' => env('CODEX_AUTH_CHALLENGE_LIFETIME', 300), // 5 minutes

    // Security settings
    'enable_temporal_validation' => env('CODEX_AUTH_TEMPORAL_VALIDATION', true),
    'require_harmonic_hash' => env('CODEX_AUTH_REQUIRE_HARMONIC_HASH', true),
    'fallback_to_standard_auth' => env('CODEX_AUTH_FALLBACK_STANDARD', false),

    // Device fingerprinting
    'device_fingerprint_algorithm' => env('CODEX_AUTH_DEVICE_ALGORITHM', 'sha256'),
    'device_trust_decay' => env('CODEX_AUTH_TRUST_DECAY', 5), // points per day

    // Logging
    'log_authentication_attempts' => env('CODEX_AUTH_LOG_ATTEMPTS', true),
    'log_channel' => env('CODEX_AUTH_LOG_CHANNEL', 'stack'),

    // Routes
    'routes_prefix' => env('CODEX_AUTH_ROUTES_PREFIX', 'api/codex-auth'),
    'routes_middleware' => ['api'],
];
