<?php

namespace Web3Codex\CodexSecure\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;

/**
 * Zone Route Service Provider
 *
 * Automatically loads and registers zone-based routes based on
 * the zone configuration system. Provides dynamic route loading
 * with proper middleware and prefix application.
 *
 * @package Web3Codex\CodexCore\Providers
 */
class ZoneRouteServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        Log::info('ZoneRouteServiceProvider: register() called');
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        Log::info('ZoneRouteServiceProvider: boot() called');
        $this->loadZoneRoutes();
    }

    /**
     * Load zone-based routes from configuration
     *
     * @return void
     */
    protected function loadZoneRoutes(): void
    {
        $zones = Config::get('codexcore.zones', []);

        Log::info('ZoneRouteServiceProvider: Loading zones', ['count' => count($zones)]);

        if (empty($zones)) {
            Log::warning('ZoneRouteServiceProvider: No zones configuration found');
            return;
        }

        foreach ($zones as $zoneKey => $zoneConfig) {
            Log::info('ZoneRouteServiceProvider: Processing zone', ['zone' => $zoneKey]);
            $this->registerZoneRoutes($zoneKey, $zoneConfig);
        }
    }

    /**
     * Register routes for a specific zone
     *
     * @param string $zoneKey
     * @param array $zoneConfig
     * @return void
     */
    protected function registerZoneRoutes(string $zoneKey, array $zoneConfig): void
    {
        $middleware = $zoneConfig['middleware'] ?? ['web'];
        $prefixes = $zoneConfig['prefixes'] ?? [];

        // Register main route files
        if (!empty($zoneConfig['route_files'])) {
            foreach ($zoneConfig['route_files'] as $routeFile) {
                $this->loadZoneRouteFile($routeFile, $prefixes, $middleware, $zoneKey);
            }
        }

        // Register zoned route files
        if (!empty($zoneConfig['zoned_routes'])) {
            foreach ($zoneConfig['zoned_routes'] as $routeFile) {
                $this->loadZoneRouteFile($routeFile, $prefixes, $middleware, $zoneKey);
            }
        }
    }

    /**
     * Load a specific route file with zone configuration
     *
     * @param string $routeFile
     * @param array $prefixes
     * @param array $middleware
     * @param string $zoneKey
     * @return void
     */
    protected function loadZoneRouteFile(string $routeFile, array $prefixes, array $middleware, string $zoneKey): void
    {
        $fullPath = $this->getRouteFilePath($routeFile);

        if (!file_exists($fullPath)) {
            logger()->warning("Zone route file not found: {$routeFile} for zone {$zoneKey}");
            return;
        }

        // Apply each prefix as a separate route group
        foreach ($prefixes as $prefix) {
            Route::group([
                'middleware' => $middleware,
                'prefix' => $prefix === '/' ? '' : $prefix,
                'as' => "zone.{$zoneKey}.",
            ], function () use ($fullPath) {
                require $fullPath;
            });
        }

        // If no prefixes, register without prefix
        if (empty($prefixes)) {
            Route::group([
                'middleware' => $middleware,
                'as' => "zone.{$zoneKey}.",
            ], function () use ($fullPath) {
                require $fullPath;
            });
        }
    }

    /**
     * Get the full path for a route file
     *
     * @param string $routeFile
     * @return string
     */
    protected function getRouteFilePath(string $routeFile): string
    {
        // If it's already an absolute path, use it
        if (str_starts_with($routeFile, '/')) {
            return $routeFile;
        }

        // Try package routes directory first
        $packagePath = __DIR__ . '/../../' . $routeFile;
        if (file_exists($packagePath)) {
            return $packagePath;
        }

        // Fall back to base path
        return base_path($routeFile);
    }
}
