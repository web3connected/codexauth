<?php

namespace Web3Codex\CodexSecure\Support;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

class CodexRouteManager
{
    public static function loadZones(): void
    {
        $zones = config('root_route_zones', []);
        $config = config('codexsecure', []);
        $loadedRoutes = [];

        if ($config['codex_zones_enabled'] ?? true) {
            Log::info("Loading Codex Route Zones", ['zones' => array_keys($zones), 'config' => $config]);
            foreach ($zones as $zoneKey => $zone) {

                $zoneName = $zone['name'] ?? $zoneKey;
                $prefixes = (array)($zone['prefixes'] ?? []);
                $routeFiles = array_unique(array_merge(
                    (array)($zone['route_files'] ?? []),
                    (array)($zone['zoned_routes'] ?? [])
                ));

                $isWebZone = self::isWebZone($zone);
                $middleware = self::normalizeMiddleware($zone['middleware'] ?? [], $isWebZone);

                foreach ($prefixes as $rawPrefix) {

                    $prefix = self::sanitizePrefix($rawPrefix);
                    $namePrefix = self::generateNamePrefix($zoneName, $prefix);

                    foreach ($routeFiles as $file) {
                        $path = base_path($file);

                        if (!file_exists($path)) {
                            Log::warning("Route file not found: {$path}");
                            continue;
                        }

                        $dedupKey = "{$prefix}|{$path}";
                        if (isset($loadedRoutes[$dedupKey])) {
                            Log::debug("Skipping duplicate route load: {$dedupKey}");
                            continue;
                        }

                        // Create the base route group
                        $routeGroup = Route::middleware($middleware)
                            ->prefix($prefix)
                            ->name($namePrefix);

                        // For web zones, add the session debug middleware as a separate group
                        if ($isWebZone) {
                            $routeGroup->middleware(['codex.session.log'])->group($path);
                        } else {
                            $routeGroup->group($path);
                        }

                        $loadedRoutes[$dedupKey] = true;

                        Log::info('Registered routes', collect(app('router')->getRoutes()->getRoutes())->map(function ($r) {
                            return [
                                'method' => implode('|', $r->methods()),
                                'uri' => $r->uri(),
                                'name' => $r->getName(),
                                'action' => $r->getActionName(),
                            ];
                        })->filter(fn($r) => str_starts_with($r['name'], 'Z') || str_starts_with($r['name'], 'negative'))->values()->all());
                    }
                }
            }
        } else {
            Log::info("Codex Route Zones loading is disabled in configuration.");
            return;
        }
    }




    protected static function isWebZone(array $zone): bool
    {
        $webIndicators = [
            'web',
            'session',
            'auth',
            'verified',
            'guest',
            'password.confirm'
        ];

        foreach ($zone['middleware'] ?? [] as $middleware) {
            if (
                in_array($middleware, $webIndicators, true) ||
                str_contains(strtolower($middleware), 'session')
            ) {
                return true;
            }
        }

        return !in_array('api', $zone['middleware'] ?? [], true);
    }

    protected static function normalizeMiddleware(array $middleware, bool $isWebZone): array
    {
        $middleware = array_unique($middleware);

        if ($isWebZone && !in_array('web', $middleware, true)) {
            array_unshift($middleware, 'web');
        }

        if ($isWebZone && !in_array(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class, $middleware, true)) {
            $middleware[] = \Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class;
        }

        // Ensure 'web' is always first
        if (($key = array_search('web', $middleware)) !== false) {
            unset($middleware[$key]);
            array_unshift($middleware, 'web');
        }

        return array_values($middleware);
    }

    protected static function sanitizePrefix(string $prefix): string
    {
        return $prefix === '/' ? '' : trim(preg_replace('#/+#', '/', $prefix), '/');
    }

    protected static function generateNamePrefix(string $zoneName, string $prefix): string
    {
        $nameSegment = str_replace('/', '.', $prefix);
        $nameSegment = preg_replace('/[^a-z0-9\._]+/i', '', $nameSegment);
        $nameSegment = trim($nameSegment, '.');

        return $nameSegment ? "{$zoneName}.{$nameSegment}." : "{$zoneName}.";
    }

    /**
     * Load all zone route files unconditionally.
     *
     * This is the canonical way for services to register their routes through
     * the CodexSecure zone system. Unlike loadZones(), it is never gated by a
     * feature flag — routes must always exist regardless of whether zone
     * enforcement is enabled or disabled.
     *
     * Enforcement behaviour (e.g. TIU checks, method gating) is controlled
     * separately inside the zone middleware stack.
     *
     * Usage (in bootstrap/app.php):
     *   Route::loadCodexSecureRoutes();
     */
    public static function loadAlways(): void
    {
        $zones = config('root_route_zones', []);
        $loadedRoutes = [];

        Log::info('CodexRouteManager::loadAlways — registering zone routes', [
            'zones' => array_keys($zones),
        ]);

        foreach ($zones as $zoneKey => $zone) {
            $zoneName = $zone['name'] ?? $zoneKey;
            $prefixes = (array) ($zone['prefixes'] ?? []);
            $routeFiles = array_unique(array_merge(
                (array) ($zone['route_files'] ?? []),
                (array) ($zone['zoned_routes'] ?? [])
            ));

            $isWebZone = self::isWebZone($zone);
            $middleware = self::normalizeMiddleware($zone['middleware'] ?? [], $isWebZone);

            // An empty prefixes array means the zone sits at the root (no prefix).
            // Normalise to [''] so the foreach always runs at least once.
            if (empty($prefixes)) {
                $prefixes = [''];
            }

            foreach ($prefixes as $rawPrefix) {
                $prefix = self::sanitizePrefix($rawPrefix);
                $namePrefix = self::generateNamePrefix($zoneName, $prefix);

                foreach ($routeFiles as $file) {
                    $path = base_path($file);

                    if (!file_exists($path)) {
                        Log::warning("CodexRouteManager: route file not found — {$path}");
                        continue;
                    }

                    $dedupKey = "{$prefix}|{$path}";
                    if (isset($loadedRoutes[$dedupKey])) {
                        continue;
                    }

                    $routeGroup = Route::middleware($middleware)
                        ->prefix($prefix)
                        ->name($namePrefix);

                    if ($isWebZone) {
                        $routeGroup->middleware(['codex.session.log'])->group($path);
                    } else {
                        $routeGroup->group($path);
                    }

                    $loadedRoutes[$dedupKey] = true;
                }
            }
        }
    }
}
