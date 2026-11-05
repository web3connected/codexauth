<?php

namespace Web3Codex\CodexSecure\Http\Middleware;

/**
 * CodexEnforceMethodMiddleware
 * This middleware checks if the request method is allowed for the current route's zone.
 * If the method is not allowed, it aborts with a 405 Method Not Allowed response.
 *
 * @package App\Http\Middleware
 */

use Closure;
use Illuminate\Http\Request;
use Web3Codex\CodexSecure\Services\Zones\CodexRouteAnalyzer;

class CodexEnforceMethodMiddleware
{
    protected CodexRouteAnalyzer $analyzer;

    public function __construct(CodexRouteAnalyzer $analyzer)
    {
        $this->analyzer = $analyzer;
    }

    public function handle(Request $request, Closure $next)
    {
        $route = $request->route();

        if (!$route) {
            return $next($request);
        }

        $analysis = $this->analyzer->analyzeRoute($route);

        if ($this->analyzer->hasMethodViolation($analysis)) {
            abort(405, 'Method Not Allowed for this Zone.');
        }

        return $next($request);
    }
}
