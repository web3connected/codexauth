<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            // Load CodexSecure zone-based routes.
            // Routes are always registered regardless of enforcement flags —
            // zone middleware controls enforcement behaviour, not route existence.
            Route::loadCodexSecureRoutes();
        },
    )
    ->withMiddleware(function (Middleware $middleware) {
        // codex.zone alias is registered by CodexSecureServiceProvider
        // Record every request to service_endpoint_hits (usage tracking)
        $middleware->append(\App\Http\Middleware\RequestTrackerMiddleware::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
