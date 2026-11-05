<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Routes are now managed via Codex Request Zones (Zone 2 - Identity).
| See: routes/zones/api/Z2/identity.php
|
| Note: CodexRouteManager handles loading specific zone files.
|
*/

// Routes are loaded via CodexRouteManager defined in root_route_zones.php

// ---------------------------------------------------------------------------
// Usage Metrics (public — same pattern as CodexSecure /metrics)
// ---------------------------------------------------------------------------
Route::get('/metrics', function (\Illuminate\Http\Request $request) {
    $hours = (int) $request->query('hours', 24);

    $rows = DB::select(
        <<<SQL
        SELECT
            method || ' ' || url          AS endpoint,
            COUNT(*)                       AS total_hits,
            AVG(response_time_ms)::BIGINT  AS avg_response_ms,
            MAX(updated_at)                AS last_hit
        FROM request_logs
        WHERE tenant_id = 'codexauth'
          AND created_at >= NOW() - ($hours * INTERVAL '1 hour')
        GROUP BY method, url
        ORDER BY total_hits DESC
        SQL
    );

    $totalHits = array_sum(array_column($rows, 'total_hits'));

    return response()->json([
        'service'      => 'codexauth',
        'total_hits'   => $totalHits,
        'period_hours' => $hours,
        'endpoints'    => array_map(fn($r) => [
            'endpoint'       => $r->endpoint,
            'hits'           => (int) $r->total_hits,
            'avg_response_ms'=> (int) $r->avg_response_ms,
            'last_hit'       => $r->last_hit,
        ], $rows),
    ]);
});

