<?php

use Illuminate\Support\Facades\Route;
use Web3Codex\CodexAuth\Http\Controllers\CodexAuthLoginController;
use Web3Codex\CodexAuth\Http\Controllers\CodexAuthResetTokenController;
use Web3Codex\CodexAuth\Http\Controllers\CodexAuthResetSecretController;

/*
|--------------------------------------------------------------------------
| CodexAuth API Routes
|--------------------------------------------------------------------------
|
| Authentication endpoints implementing Codex Harmonic Hash
| with Time Index Unit (TIU) based temporal authentication.
|
*/

// Note: Middleware and Prefix are applied via CodexRouteManager (Z2 Strategy)
// Config: packages/codexcore/config/zones/root_route_zones.php

Route::group([], function () {

    /**
     * Login Endpoint
     * Handles user authentication
     *
     * POST /api/codex-auth/login
     * Body: { "email": "user@example.com", "secret": "user_secret" }
     */
    Route::post('/login', [CodexAuthLoginController::class, 'login'])
        ->name('codex.auth.login');

    /**
     * Show Login Form
     * Returns login form view
     *
     * GET /api/codex-auth/login
     */
    Route::get('/login', [CodexAuthLoginController::class, 'showLoginForm'])
        ->name('codex.auth.login.form');

    /**
     * Complete Device Registration
     * Completes device registration process
     *
     * POST /api/codex-auth/device/complete
     */
    Route::post('/device/complete', [CodexAuthLoginController::class, 'completeDeviceRegistration'])
        ->name('codex.auth.device.complete');

    /**
     * Request Password Reset Token
     * Issues a reset token and sends email
     *
     * POST /api/codex-auth/reset-token
     * Body: { "email": "user@example.com", "ttl": 30 }
     */
    Route::post('/reset-token', [CodexAuthResetTokenController::class, 'resetToken'])
        ->name('codex.auth.reset.token');

    /**
     * Reset Password with Token
     * Validates token and updates password
     *
     * POST /api/codex-auth/reset-secret
     * Body: { "email": "user@example.com", "token": "reset_token", "new_secret": "new_password", "new_secret_confirmation": "new_password" }
     */
    Route::post('/reset-secret', [CodexAuthResetSecretController::class, 'resetSecret'])
        ->name('codex.auth.reset.secret');

});
