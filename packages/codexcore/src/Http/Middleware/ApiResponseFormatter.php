<?php

namespace Web3Codex\CodexCore\Http\Middleware;

/**
 * ApiResponseFormatter Middleware
 *
 * This middleware formats all JSON responses from the API to a consistent structure.
 * It ensures that all responses include success status, data, message, meta, and errors.
 *
 * @package App\Http\Middleware
 */

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ApiResponseFormatter
{
    /**
     * Default structure for all API responses.
     */
    protected array $structure = [
        'success' => false,
        'data'    => null,
        'message' => null,
        'meta'    => null,
        'errors'  => null,
    ];

    /**
     * Handle the incoming request and format the JSON response.
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if (!$this->shouldFormat($request, $response)) {
            return $response;
        }

        return $this->format($response);
    }

    /**
     * Determine if the response should be formatted.
     */
    protected function shouldFormat(Request $request, $response): bool
    {
        // Only format JSON responses
        if (!$response instanceof JsonResponse) {
            return false;
        }

        // Avoid double-formatting
        $data = $response->getData(true);
        if (isset($data['success']) && array_key_exists('data', $data)) {
            return false;
        }

        // Optional route-level exclusions
        if ($request->is('api/debug*') || $request->is('telescope*')) {
            return false;
        }

        return true;
    }

    /**
     * Format the actual response.
     */
    protected function format(JsonResponse $response): JsonResponse
    {
        $status     = $response->getStatusCode();
        $successful = $this->isSuccessful($status);
        $payload    = $response->getData(true);

        $formatted = array_merge($this->structure, [
            'success' => $successful,
            'data'    => $this->extractData($payload),
            'message' => $this->extractMessage($status, $payload),
            'errors'  => $successful ? null : ($payload['errors'] ?? null),
            'meta'    => $payload['meta'] ?? null,
        ]);

        return response()->json(
            $formatted,
            $status,
            $response->headers->all(),
            JSON_UNESCAPED_SLASHES | (app()->isLocal() ? JSON_PRETTY_PRINT : 0)
        );
    }

    /**
     * Determine what goes in `data`.
     */
    protected function extractData(array $payload)
    {
        // Handle Laravel pagination format
        if (isset($payload['data'], $payload['links'], $payload['meta'])) {
            return $payload['data'];
        }

        return $payload;
    }

    /**
     * Determine what message to send.
     */
    protected function extractMessage(int $status, array $payload): string
    {
        if (isset($payload['message']) && is_string($payload['message'])) {
            return $payload['message'];
        }

        return $this->defaultStatusMessage($status);
    }

    /**
     * Basic status code to message mapping.
     */
    protected function defaultStatusMessage(int $status): string
    {
        return match ($status) {
            200 => 'OK',
            201 => 'Created',
            204 => 'No Content',
            400 => 'Bad Request',
            401 => 'Unauthorized',
            403 => 'Forbidden',
            404 => 'Not Found',
            422 => 'Validation Failed',
            500 => 'Internal Server Error',
            default => 'Request completed',
        };
    }

    /**
     * Determine if status code is successful.
     */
    protected function isSuccessful(int $status): bool
    {
        return $status >= 200 && $status < 300;
    }
}
