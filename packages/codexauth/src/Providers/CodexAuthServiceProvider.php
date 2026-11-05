<?php

namespace Web3Codex\CodexAuth\Providers;

/**
 * AI: Check aiPrompt.md in projects root directory - For More Details
 *
 * CodexAuthServiceProvider - Laravel Service Provider for Authentication
 *
 * This service provider registers and bootstraps the CodexAuth package within Laravel.
 * Handles configuration, routes, middleware, and service bindings.
 *
 * PURPOSE: Laravel service provider for CodexAuth package integration.
 * DESIGN: Standard Laravel service provider pattern with package registration.
 * INTEGRATION: Registers CodexAuth services within the Laravel application container.
 *
 * Key Features:
 * - Service registration and binding
 * - Configuration file merging
 * - Route registration and middleware
 * - Package bootstrapping
 *
 * @package CodexAuth
 * @author  Web3Connected
 * @version 1.0.0
 * @license MIT
 */

use Illuminate\Support\ServiceProvider;
use Web3Codex\CodexAuth\Http\Controllers\CodexAuthLoginController;

class CodexAuthServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->mergeConfigFrom(
            __DIR__ . '/../../config/services/codexauth.php',
            'codexauth'
        );

        // Register authentication services
        $this->app->singleton('codex.auth.secure', function ($app) {
            return new \Web3Codex\CodexAuth\Services\CodexAuthSecure(
                $app->make(\Web3Codex\CodexAuth\Services\CodexHashClient::class),
                $app->make(\Web3Codex\CodexAuth\Services\CodexTimeClient::class),
                $app->make('Web3Codex\CodexCore\Support\CodexEthosLattice'),
                $app->make('Web3Codex\CodexCore\Support\CodexCache')
            );
        });
        $this->app->alias('codex.auth.secure', \Web3Codex\CodexAuth\Services\CodexAuthSecure::class);

        $this->app->singleton('Web3Codex\CodexAuth\Services\CodexAuthOrchestrator', function ($app) {
            return new \Web3Codex\CodexAuth\Services\CodexAuthOrchestrator(
                $app->make('Web3Codex\CodexAuth\Services\CodexAuthSecure'),
                $app->make('Web3Codex\CodexAuth\Services\CodexSession'),
                $app->make('Web3Codex\CodexAuth\Services\CodexDevices')
            );
        });

        $this->app->singleton('Web3Codex\CodexAuth\Services\CodexDevices', function ($app) {
            return new \Web3Codex\CodexAuth\Services\CodexDevices(
                $app->make(\Web3Codex\CodexAuth\Services\CodexHashClient::class),
                $app->make(\Web3Codex\CodexAuth\Services\CodexTimeClient::class),
                $app->make('Web3Codex\CodexCore\Support\CodexEthosLattice'),
                $app->make('Web3Codex\CodexCore\Support\CodexCache')
            );
        });

        $this->app->singleton('Web3Codex\CodexAuth\Services\CodexSession', function ($app) {
            return new \Web3Codex\CodexAuth\Services\CodexSession(
                $app->make('Web3Codex\CodexCore\Support\CodexCache'),
                $app->make(\Web3Codex\CodexAuth\Services\CodexTimeClient::class),
                $app->make('Web3Codex\CodexAuth\Services\CodexDevices')
            );
        });

        // Register authentication client
        $this->app->singleton('Web3Codex\CodexAuth\Clients\CodexAuthClient', function ($app) {
            return new \Web3Codex\CodexAuth\Clients\CodexAuthClient(
                $app->make('App\Services\Sync\CodexConnectService')
            );
        });

        // Register authentication controllers
        $this->app->singleton(CodexAuthLoginController::class, function ($app) {
            return new CodexAuthLoginController(
                $app->make('Web3Codex\CodexAuth\Services\CodexAuthSecure'),
                $app->make('Web3Codex\CodexAuth\Services\CodexDevices'),
                $app->make('Web3Codex\CodexAuth\Services\CodexSession'),
                $app->make('Web3Codex\CodexAuth\Services\CodexAuthOrchestrator'),
                $app->make('Web3Codex\CodexTime\Services\CodexTime'),
                $app->make('Web3Codex\CodexCore\Support\CodexEthosLattice')
            );
        });

        $this->app->singleton(\Web3Codex\CodexAuth\Http\Controllers\CodexAuthLogoutController::class);
        $this->app->singleton(\Web3Codex\CodexAuth\Http\Controllers\CodexAuthTokenController::class);
        $this->app->singleton(\Web3Codex\CodexAuth\Http\Controllers\CodexAuthRepairController::class);
        $this->app->singleton(\Web3Codex\CodexAuth\Http\Controllers\CodexAuthResetSecretController::class);
        $this->app->singleton(\Web3Codex\CodexAuth\Http\Controllers\CodexAuthResetTokenController::class);

        $this->app->singleton(\Web3Codex\CodexAuth\Http\Controllers\RegisterDeviceController::class, function ($app) {
            return new \Web3Codex\CodexAuth\Http\Controllers\RegisterDeviceController(
                $app->make('Web3Codex\CodexAuth\Services\CodexDevices')
            );
        });

        // Register controller with proper dependencies
        $this->app->singleton(CodexAuthLoginController::class, function ($app) {
            return new CodexAuthLoginController(
                $app->make('Web3Codex\CodexSecure\Services\CodexSecure'),
                $app->make('Web3Codex\CodexAuth\Services\CodexDevices'),
                $app->make('Web3Codex\CodexAuth\Services\CodexSession'),
                $app->make('Web3Codex\CodexAuth\Services\CodexAuthOrchestrator'),
                $app->make('Web3Codex\CodexTime\Services\CodexTime'),
                $app->make('Web3Codex\CodexCore\Support\CodexEthosLattice')
            );
        });

        // Register service aliases for convenient access
        $this->app->alias('Web3Codex\CodexAuth\Services\CodexAuthOrchestrator', 'codex.auth.orchestrator');
        $this->app->alias('Web3Codex\CodexAuth\Services\CodexDevices', 'codex.auth.devices');
        $this->app->alias('Web3Codex\CodexAuth\Services\CodexSession', 'codex.auth.session');
        $this->app->alias('Web3Codex\CodexAuth\Clients\CodexAuthClient', 'codex.auth.client');

        // Register facade
        $this->app->singleton('codex.auth', function ($app) {
            return $app->make('Web3Codex\CodexAuth\Services\CodexAuthOrchestrator');
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/../Http/Routes/api.php');

        // Load package views
        $this->loadViewsFrom(__DIR__ . '/../../resources/views', 'codexauth');

        // Register JWT auth middleware
        $router = $this->app['router'];
        $router->aliasMiddleware('codex.jwt.auth', \Web3Codex\CodexAuth\Http\Middleware\CodexJwtAuthMiddleware::class);

        if ($this->app->runningInConsole()) {
            // Publish config
            $this->publishes([
                __DIR__ . '/../../config/codexauth.php' => config_path('codexauth.php'),
            ], 'codexauth-config');

            // Publish views
            $this->publishes([
                __DIR__ . '/../../resources/views' => resource_path('views/vendor/codexauth'),
            ], 'codexauth-views');
        }
    }
}
