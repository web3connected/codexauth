<?php

namespace Web3Codex\CodexSecure\Services\Zones;

/**
 * CodexRouteAnalyzer
 * Analyzes application routes to determine their zone assignments based on defined strategies.
 * Refactored to remove circular dependencies and improve maintainability.
 *
 * @version 2.0.0
 * @package Web3Codex\CodexCore\Services\Zones
 */

use Illuminate\Support\Str;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Web3Codex\CodexSecure\Support\CodexZoneStrategies;
use Illuminate\Support\Facades\Route;
use Web3Codex\CodexSecure\Services\Zones\CodexRouteServer;
use Illuminate\Routing\Route as RouteObject;

class CodexRouteAnalyzer
{
    public const int SYSTEM_ZONE_ID = 5;
    public const int UNASSIGNED_ZONE_ID = -1;

    protected array $ZONE_CONFIG = [];
    protected array $zoneRegistry = [];
    protected array $strategies = [];
    protected CodexRouteServer $routeServer;
    protected array $MATCH_STRATEGIES = [];
    protected int $unassignedWarnings = 0;

    public function __construct(CodexRouteServer $routeServer)
    {
        $this->routeServer = $routeServer;
        $this->zoneRegistry = config('codexcore.zone_registry', []);

        // Support both old and new configuration
        if (empty($this->zoneRegistry)) {
            $zones = config('codexcore.zones.zones', []);
            foreach ($zones as $key => $zone) {
                $this->zoneRegistry[$zone['zone_id']] = $zone['name'];
            }
        }

        $this->initializeZoneConfig();
        $this->strategies = (new CodexZoneStrategies())->getZoneStrategies(null);
        $this->MATCH_STRATEGIES = $this->getMatchStrategies();
    }

    public function getZonedBuckets(): array
    {
        return $this->zoneRegistry;
    }

    protected function initializeZoneConfig(): void
    {
        foreach ($this->zoneRegistry as $id => $name) {
            $this->ZONE_CONFIG[] = [
                'zone_id' => $id,
                'name' => $name,
                'key' => strtolower($name),
                'rules' => [],
                'description' => ucfirst($name) . ' zone',
            ];
        }
    }

    protected function getMatchStrategies(): array
    {
        $zoneMap = array_flip($this->zoneRegistry);
        $uriPatterns = [];

        foreach ($this->strategies as $zoneName => $patterns) {
            if (!isset($zoneMap[$zoneName])) continue;
            $zoneId = $zoneMap[$zoneName];
            $uriPatterns[implode('|', $patterns)] = $zoneId;
        }

        $zoneStrategies = new CodexZoneStrategies();

        return [
            'uri' => ['patterns' => $uriPatterns],
            'controller' => ['patterns' => $zoneStrategies->getControllerStrategies()],
            'model' => ['patterns' => $zoneStrategies->getModelStrategies()],
        ];
    }

    public function analyze(): array
    {
        $routes = collect(Route::getRoutes())->map(fn($route) => $this->formatRoute($route));

        return [
            'routes' => $routes->toArray(),
            'zones' => $this->groupRoutesByZone($routes),
            'stats' => $this->generateStats($routes),
        ];
    }

    public function analyzeRoute(RouteObject $route): array
    {
        $base = $this->createBaseRouteFormat($route);
        return [...$base, ...$this->determineZoneAssignment($base)];
    }

    protected function formatRoute(RouteObject $route): array
    {
        $base = $this->createBaseRouteFormat($route);
        $zone = $this->determineZoneAssignment($base);

        if ($zone['zone_id'] === self::UNASSIGNED_ZONE_ID && $this->unassignedWarnings < 10) {
            Log::warning("Zone not assigned for route: {$base['uri']}");
            $this->unassignedWarnings++;
        }

        return [...$base, ...$zone];
    }

    protected function createBaseRouteFormat(RouteObject $route): array
    {
        return [
            'uri' => $route->uri(),
            'methods' => $route->methods(),
            'action' => $this->parseAction($route->getActionName()),
            'middleware' => $route->gatherMiddleware(),
            'match_score_details' => [
                'uri_match' => false,
                'controller_match' => false,
                'middleware_match' => false,
            ],
        ];
    }

    protected function determineZoneAssignment(array $route): array
    {
        $best = [
            'zone_id' => self::UNASSIGNED_ZONE_ID,
            'score' => 0,
            'details' => $route['match_score_details'],
        ];

        foreach ($this->ZONE_CONFIG as $config) {
            $zoneId = $config['zone_id'];
            $score = 0;
            $details = $route['match_score_details'];

            if ($this->uriMatchesZone($route['uri'], $config)) {
                $score++;
                $details['uri_match'] = true;
            }

            if ($this->actionMatchesZone($route['action'], $config)) {
                $score++;
                $details['controller_match'] = true;
            }

            if (!empty($config['rules']) && $this->middlewareMatchesZone($route['middleware'], $config)) {
                $score++;
                $details['middleware_match'] = true;
            }

            if ($score > $best['score']) {
                $best = [
                    'zone_id' => $zoneId,
                    'zone_name' => $config['name'],
                    'score' => $score,
                    'details' => $details,
                ];
            }
        }

        return $best;
    }

    protected function uriMatchesZone(string $uri, array $config): bool
    {
        if (empty($config['patterns'])) {
            return false;
        }

        foreach ($config['patterns'] as $pattern) {
            if (Str::is($pattern, $uri)) {
                return true;
            }
        }

        return false;
    }

    protected function actionMatchesZone(array $action, array $config): bool
    {
        if (empty($action['controller'])) {
            return false;
        }

        $controllerName = class_basename($action['controller']);
        $zoneName = $config['name'];

        // Simple pattern matching
        return Str::contains(strtolower($controllerName), strtolower($zoneName));
    }

    protected function middlewareMatchesZone(array $middleware, array $config): bool
    {
        // Basic middleware zone matching
        $zoneMiddleware = [
            'admin' => ['auth:admin', 'admin'],
            'identity' => ['guest', 'throttle'],
            'protected' => ['auth', 'verified'],
            'system' => ['api', 'throttle:api'],
        ];

        $expectedMiddleware = $zoneMiddleware[$config['name']] ?? [];

        return !empty(array_intersect($middleware, $expectedMiddleware));
    }

    protected function parseAction(string $actionName): array
    {
        if (str_contains($actionName, '@')) {
            [$controller, $method] = explode('@', $actionName);
            return [
                'controller' => $controller,
                'method' => $method,
                'type' => 'controller',
            ];
        }

        return [
            'controller' => '',
            'method' => '',
            'type' => 'closure',
            'raw' => $actionName,
        ];
    }

    protected function groupRoutesByZone(Collection $routes): array
    {
        $grouped = [];

        foreach ($routes as $route) {
            $zoneId = $route['zone_id'] ?? self::UNASSIGNED_ZONE_ID;
            $zoneName = $route['zone_name'] ?? 'unassigned';

            if (!isset($grouped[$zoneName])) {
                $grouped[$zoneName] = [
                    'zone_id' => $zoneId,
                    'zone_name' => $zoneName,
                    'routes' => [],
                    'count' => 0,
                ];
            }

            $grouped[$zoneName]['routes'][] = $route;
            $grouped[$zoneName]['count']++;
        }

        return $grouped;
    }

    protected function generateStats(Collection $routes): array
    {
        $total = $routes->count();
        $assigned = $routes->where('zone_id', '!=', self::UNASSIGNED_ZONE_ID)->count();

        return [
            'total_routes' => $total,
            'assigned_routes' => $assigned,
            'unassigned_routes' => $total - $assigned,
            'assignment_rate' => $total > 0 ? round(($assigned / $total) * 100, 2) : 0,
            'zones_used' => $routes->pluck('zone_id')->unique()->filter(fn($id) => $id !== self::UNASSIGNED_ZONE_ID)->count(),
        ];
    }

    /**
     * Get zone assignment for a specific route
     */
    public function getRouteZone(RouteObject $route): array
    {
        return $this->analyzeRoute($route);
    }

    /**
     * Check if a route is in a specific zone
     */
    public function isRouteInZone(RouteObject $route, string $zoneName): bool
    {
        $analysis = $this->analyzeRoute($route);
        return ($analysis['zone_name'] ?? '') === $zoneName;
    }
}
