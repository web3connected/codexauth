<?php

namespace Web3Codex\CodexSecure\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Web3Codex\CodexSecure\Services\CodexSecureCore;

class CodexSecureServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(
            __DIR__ . '/../../config/services/codexsecure.php',
            'codexsecure'
        );

        // Zone config — loaded here so CodexRouteManager can read it
        $this->mergeConfigFrom(
            __DIR__ . '/../../config/zones/root_route_zones.php',
            'root_route_zones'
        );

        // CodexSecureCore — shared base class used by CodexAuth's CodexDevices
        $this->app->singleton(CodexSecureCore::class, function ($app) {
            return new CodexSecureCore(
                $app->make('Web3Codex\CodexHash\Services\CodexHarmonicHash'),
                $app->make('Web3Codex\CodexTime\Services\CodexTime'),
                $app->make('Web3Codex\CodexCore\Support\CodexEthosLattice'),
                $app->make('Web3Codex\CodexCore\Support\CodexCache')
            );
        });

        // Zone services
        $this->app->singleton(\Web3Codex\CodexSecure\Support\CodexZoneStrategies::class, function ($app) {
            return new \Web3Codex\CodexSecure\Support\CodexZoneStrategies();
        });

        $this->app->singleton(\Web3Codex\CodexSecure\Support\CodexZoneGuard::class, function ($app) {
            return new \Web3Codex\CodexSecure\Support\CodexZoneGuard();
        });

        $this->app->singleton(\Web3Codex\CodexSecure\Support\CodexRouteManager::class, function ($app) {
            return new \Web3Codex\CodexSecure\Support\CodexRouteManager();
        });

        $this->app->singleton(\Web3Codex\CodexSecure\Services\Zones\CodexRouteServer::class, function ($app) {
            return new \Web3Codex\CodexSecure\Services\Zones\CodexRouteServer();
        });

        $this->app->singleton(\Web3Codex\CodexSecure\Services\Zones\CodexRouteAnalyzer::class, function ($app) {
            return new \Web3Codex\CodexSecure\Services\Zones\CodexRouteAnalyzer(
                $app->make(\Web3Codex\CodexSecure\Services\Zones\CodexRouteServer::class)
            );
        });

        $this->app->singleton(\Web3Codex\CodexSecure\Services\Zones\CodexRequestAnalyzer::class, function ($app) {
            return new \Web3Codex\CodexSecure\Services\Zones\CodexRequestAnalyzer(
                $app->make('request'),
                $app->make(\Web3Codex\CodexSecure\Services\Zones\CodexRouteAnalyzer::class)
            );
        });

        $this->app->alias(CodexSecureCore::class, 'codex.secure.core');
        $this->app->alias(\Web3Codex\CodexSecure\Support\CodexZoneStrategies::class, 'codex.secure.zone-strategies');
        $this->app->alias(\Web3Codex\CodexSecure\Support\CodexZoneGuard::class, 'codex.secure.zone-guard');
        $this->app->alias(\Web3Codex\CodexSecure\Support\CodexRouteManager::class, 'codex.secure.route-manager');
        $this->app->alias(\Web3Codex\CodexSecure\Services\Zones\CodexRouteServer::class, 'codex.secure.route-server');
        $this->app->alias(\Web3Codex\CodexSecure\Services\Zones\CodexRouteAnalyzer::class, 'codex.secure.route-analyzer');
        $this->app->alias(\Web3Codex\CodexSecure\Services\Zones\CodexRequestAnalyzer::class, 'codex.secure.request-analyzer');
    }

    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__ . '/../../config/services/codexsecure.php' => config_path('codexsecure.php'),
            ], 'codexsecure-config');

            $this->publishes([
                __DIR__ . '/../../config/zones' => config_path(),
            ], 'codexsecure-zone-config');
        }

        $router = $this->app['router'];

        // Zone enforcement middleware
        $router->aliasMiddleware('codex.zone',      \Web3Codex\CodexSecure\Http\Middleware\ZoneRouteMiddleware::class);
        $router->aliasMiddleware('zone.route',      \Web3Codex\CodexSecure\Http\Middleware\ZoneRouteMiddleware::class);
        $router->aliasMiddleware('zone.analysis',   \Web3Codex\CodexSecure\Http\Middleware\CodexZoneAnalysisMiddleware::class);
        $router->aliasMiddleware('codex.tiu',       \Web3Codex\CodexSecure\Http\Middleware\CodexTIUMiddleware::class);
        $router->aliasMiddleware('device.registered', \Web3Codex\CodexSecure\Http\Middleware\EnsureDeviceIsRegistered::class);
        $router->aliasMiddleware('method.enforce',  \Web3Codex\CodexSecure\Http\Middleware\CodexEnforceMethodMiddleware::class);

        // Route macro — unconditional zone route loading
        Route::macro('loadCodexSecureRoutes', function () {
            \Web3Codex\CodexSecure\Support\CodexRouteManager::loadAlways();
        });

        // Legacy macro — flag-gated (kept for backward compat)
        Route::macro('loadZoneRoutes', function () {
            \Web3Codex\CodexSecure\Support\CodexRouteManager::loadZones();
        });
    }
}
