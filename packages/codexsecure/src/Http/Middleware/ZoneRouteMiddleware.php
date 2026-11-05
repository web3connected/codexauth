<?php

namespace Web3Codex\CodexSecure\Http\Middleware;

/**
 * ZoneRouteMiddleware
 *
 * This middleware analyzes the current route and determines the zone it belongs to.
 * It sets the zone information in the request attributes and adds a response header.
 *
 * @package App\Http\Middleware
 */

use Closure;
use Illuminate\Http\Request;
use Web3Codex\CodexSecure\Services\Zones\CodexRouteServer;
use Web3Codex\CodexSecure\Services\Zones\CodexRouteAnalyzer;

class ZoneRouteMiddleware
{
    protected CodexRouteAnalyzer $analyzer;
    protected CodexRouteServer $server;

    public function __construct(CodexRouteAnalyzer $analyzer, CodexRouteServer $server)
    {
        $this->analyzer = $analyzer;
        $this->server = $server;
    }

    public function handle(Request $request, Closure $next, ?string $forcedZoneId = null)
    {
        $route = $request->route();

        $zone = $this->analyzer->analyzeRoute($route);

        if ($forcedZoneId !== null) {
            $zone['zone_id'] = (int) $forcedZoneId;
            $zone['forced'] = true;
        }

        $request->attributes->set('codex_zone', $zone);
        $response = $next($request);
        $response->headers->set('X-Codex-Zone', (string) ($zone['zone_id'] ?? 'unknown'));

        return $response;
    }
}
