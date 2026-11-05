<?php

namespace Web3Codex\CodexSecure\Http\Middleware;

/**
 * CodexZoneAnalysisMiddleware
 * This middleware is responsible for analyzing the route and ensuring it belongs to a specific zone.
 * It checks if the zone ID is set and validates TIU sync if necessary.
 *
 * @package App\Http\Middleware
 */

use Closure;
use Illuminate\Http\Request;
use App\Facades\CodexSecure;
use App\Services\Zones\CodexRouteAnalyzer;

class CodexZoneAnalysisMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $route = $request->route();

        if ($route instanceof \Illuminate\Routing\Route) {
            $analyzer = app(CodexRouteAnalyzer::class);

            $analysis = $analyzer->analyzeRoute($route);

            if (!isset($analysis['zone_id']) || $analysis['zone_id'] === CodexRouteAnalyzer::UNASSIGNED_ZONE_ID) {
                abort(403, 'Unauthorized Zone Access (ZoneConfig Missing)');
            }

            // (Optional) You can also validate TIU sync here
            CodexSecure::validateTiuSync();
        }

        return $next($request);
    }
}
