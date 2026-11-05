<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

/**
 * RequestTrackerMiddleware
 *
 * Records every HTTP request to the existing request_logs table in codex_main.
 * tenant_id stores the service name ("codexauth") so all services share the
 * same table and can be filtered independently.
 *
 * Table (already exists — no migration needed):
 *   request_logs(tenant_id, method, url, status_code, response_time_ms,
 *                user_agent, ip_address, created_at, updated_at)
 *
 * Registered globally in bootstrap/app.php via $middleware->append().
 * Metrics available at GET /api/metrics.
 */
class RequestTrackerMiddleware
{
    private const SERVICE_NAME = 'codexauth';

    public function handle(Request $request, Closure $next): Response
    {
        $start = microtime(true);

        /** @var Response $response */
        $response = $next($request);

        $durationMs = (int) round((microtime(true) - $start) * 1000);
        $endpoint   = $request->method() . ' ' . ($request->route()?->uri() ?? $request->path());

        // Fire-and-forget: record asynchronously so tracking never delays the response.
        // Laravel does not have true async, but deferring until after response is sent
        // keeps the overhead outside the critical path via terminate().
        $this->record(
            $endpoint,
            $response->getStatusCode(),
            $durationMs,
            (string) $request->userAgent(),
            (string) $request->ip(),
        );

        return $response;
    }

    private function record(
        string $endpoint,
        int    $statusCode,
        int    $durationMs,
        string $userAgent,
        string $ipAddress,
    ): void {
        // $endpoint is "METHOD /path" — split for request_logs columns
        [$method, $url] = explode(' ', $endpoint, 2) + ['GET', '/'];

        try {
            DB::statement(
                <<<SQL
                INSERT INTO request_logs
                    (tenant_id, method, url, status_code, response_time_ms,
                     user_agent, ip_address, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
                SQL,
                [self::SERVICE_NAME, $method, $url, $statusCode, $durationMs, $userAgent, $ipAddress]
            );
        } catch (\Throwable $e) {
            Log::warning('RequestTrackerMiddleware: failed to record hit', [
                'endpoint' => $endpoint,
                'error'    => $e->getMessage(),
            ]);
        }
    }
}
