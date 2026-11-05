<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::prefix('auth')->group(function () {
    // Login: email + password → CodexHash verification → JWT token
    Route::post('/login', [AuthController::class, 'login']);

    // Register: email + password → CodexHash storage → JWT token
    Route::post('/register', [AuthController::class, 'register']);

    // Password Reset: Request reset token
    Route::post('/request-reset', [AuthController::class, 'requestReset']);

    // Password Reset: Submit new password with token
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    // Protected routes (require JWT token)
    Route::middleware('auth:api')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });
});

Route::get('/codexsecure/status', function (\Illuminate\Http\Request $request) {
    $zone = $request->attributes->get('codex_zone');

    return response()->json([
        'service' => 'codexauth',
        'codexsecure' => [
            'enabled' => (bool) config('codexsecure.enabled', true),
            'codex_zones_enabled' => (bool) config('codexsecure.codex_zones_enabled', false),
        ],
        'request' => [
            'path' => '/' . ltrim($request->path(), '/'),
            'method' => $request->method(),
            'route_uri' => $request->route()?->uri(),
        ],
        'zone' => $zone,
        'timestamp' => now()->toIso8601String(),
    ]);
});

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'CodexAuth API (Zone 2)',
        'timestamp' => now()->toIso8601String(),
        'version' => '1.0.0',
    ]);
});
