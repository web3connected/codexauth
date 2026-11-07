<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

/*
| CodexAuth is an HTTP REST API only: no web routes, sessions, views or
| frontend. API routes live in routes/api.php under the /api prefix.
*/

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        apiPrefix: 'api',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Every error, on every path, is rendered as JSON (never an HTML page),
        // including 404 for unknown routes, 405, validation (422) and 500.
        $exceptions->shouldRenderJsonWhen(fn () => true);
    })->create();
