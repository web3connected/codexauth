<?php

/**
 * TEST Ruse Web3Codex\CodexAuth\Http\Controllers\Test\AdminAuthTestController;
use Web3Codex\CodexAuth\Http\Controllers\Testing\CodexTestAuthTokenController;TES - Authentication Testing
 *
 * These routes are for TESTING authentication flows only.
 * Use these routes during development to test new login functionality
 * before applying changes to live controllers.
 *
 * Usage:
 * 1. Temporarily enable these routes for testing
 * 2. Point frontend to /test/admin/login instead of /admin/login
 * 3. Test thoroughly
 * 4. Apply working changes to live controllers
 * 5. Disable these routes when done testing
 *
 * IMPORTANT: These routes should NOT be enabled in production!
 */

use Illuminate\Support\Facades\Route;
use Web3Codex\CodexAuth\Http\Controllers\Test\AdminAuthTestController;
use Web3Codex\CodexAuth\Http\Controllers\Test\CodexTestAuthTokenController;

// UNCOMMENT THESE ROUTES WHEN TESTING
// Route::middleware(['api'])->prefix('test')->group(function () {

//     // Test Admin Authentication Routes
//     Route::post('/admin/login', [AdminAuthTestController::class, 'apiLogin'])
//         ->name('test.api.admin.login');

//     // Test User info endpoint
//     Route::get('/user', [AdminAuthTestController::class, 'getUser'])
//         ->name('test.api.user');

//     // Test Logout
//     Route::post('/admin/logout', [AdminAuthTestController::class, 'logout'])
//         ->name('test.api.admin.logout');

//     // CodexAuth Test Routes
//     Route::prefix('codex-auth')->group(function () {
//         Route::post('/challenge', [CodexTestAuthTokenController::class, 'generateChallenge'])
//             ->name('test.codex.auth.challenge');

//         Route::post('/verify', [CodexTestAuthTokenController::class, 'verifyResponse'])
//             ->name('test.codex.auth.verify');

//         Route::post('/validate', [CodexTestAuthTokenController::class, 'validateToken'])
//             ->name('test.codex.auth.validate');

//         Route::get('/temporal-context', [CodexTestAuthTokenController::class, 'getTemporalContext'])
//             ->name('test.codex.auth.temporal-context');

//         Route::get('/health', [CodexTestAuthTokenController::class, 'healthCheck'])
//             ->name('test.codex.auth.health');
//     });
// });
