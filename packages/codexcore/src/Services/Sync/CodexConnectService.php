<?php

namespace Web3Codex\CodexCore\Services\Sync;

/**
 * CodexConnectService
 *
 * This service handles communication with the Codex Connect API.
 * It provides methods to ping the service, send tasks, and manage batch operations.
 *
 * @version 2.0.0
 * @package Web3Codex\CodexCore\Services\Sync
 */

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\RequestException;

class CodexConnectService
{
    protected string $baseUrl;
    protected int $timeout;
    protected array $defaultHeaders;
    protected ?string $authToken;

    public function __construct()
    {
        $this->baseUrl = config('codex.agents.url', 'http://localhost:50001/api');
        $this->timeout = config('codex.agents.timeout', 5);
        $this->authToken = config('codex.agents.token');
        $this->defaultHeaders = [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ];
    }

    /**
     * Set base URL for the service
     */
    public function setBaseUrl(string $baseUrl): self
    {
        $this->baseUrl = $baseUrl;
        return $this;
    }

    /**
     * Ping the Codex Connect service
     */
    public function ping(): array
    {
        return $this->get('/ping');
    }

    /**
     * Send a task to the Codex Connect service
     */
    public function sendTask(array $payload): array
    {
        return $this->post('/task', $payload);
    }

    /**
     * Send a batch of tasks to the Codex Connect service
     */
    public function sendBatch(array $tasks): array
    {
        return $this->post('/batch', ['tasks' => $tasks]);
    }

    /**
     * Make a GET request to the Codex Connect service
     */
    public function get(string $endpoint, array $query = []): array
    {
        return $this->request('GET', $endpoint, [], $query);
    }

    /**
     * Make a POST request to the Codex Connect service
     */
    public function post(string $endpoint, array $payload = []): array
    {
        return $this->request('POST', $endpoint, $payload);
    }

    /**
     * Make a PUT request to the Codex Connect service
     */
    public function put(string $endpoint, array $payload = []): array
    {
        return $this->request('PUT', $endpoint, $payload);
    }

    /**
     * Make a DELETE request to the Codex Connect service
     */
    public function delete(string $endpoint, array $payload = []): array
    {
        return $this->request('DELETE', $endpoint, $payload);
    }

    /**
     * Configure the base HTTP request
     */
    protected function withRequest(array $additionalHeaders = []): PendingRequest
    {
        $request = Http::timeout($this->timeout)
            ->retry(3, 100)
            ->withHeaders(array_merge($this->defaultHeaders, $additionalHeaders));

        if ($this->authToken) {
            $request->withToken($this->authToken);
        }

        return $request;
    }

    protected function buildUrl(string $endpoint): string
    {
        return rtrim($this->baseUrl, '/') . '/' . ltrim($endpoint, '/');
    }

    /**
     * Make a request to the Codex Connect service
     */
    protected function request(string $method, string $endpoint, array $payload = [], array $query = []): array
    {
        $url = $this->buildUrl($endpoint);

        try {
            $request = $this->withRequest();

            $response = match (strtoupper($method)) {
                'POST' => $request->post($url, $payload),
                'GET' => $request->get($url, $query),
                'PUT' => $request->put($url, $payload),
                'DELETE' => $request->delete($url, $payload),
                default => throw new \InvalidArgumentException("Unsupported HTTP method: {$method}"),
            };

            return $this->handleResponse($response, $url);
        } catch (RequestException $e) {
            $this->logError($e, $url, $payload);
            return [
                'success' => false,
                'status' => $e->response?->status() ?? 500,
                'error' => $e->getMessage(),
                'details' => $e->response?->json(),
            ];
        } catch (\Throwable $e) {
            $this->logError($e, $url, $payload);
            return [
                'success' => false,
                'status' => 500,
                'error' => 'Internal server error',
                'details' => null,
            ];
        }
    }

    /**
     * Handle HTTP response
     */
    protected function handleResponse($response, string $url): array
    {
        $status = $response->status();
        $json = $response->json();

        if ($status >= 200 && $status < 300) {
            return [
                'success' => true,
                'status' => $status,
                'data' => $json,
            ];
        }

        // Handle specific error cases
        if ($status === 422 && isset($json['error']) && $json['error'] === 'TIU mismatch') {
            return [
                'success' => false,
                'status' => $status,
                'error' => 'TIU mismatch',
                'details' => $json['details'] ?? null,
            ];
        }

        return [
            'success' => false,
            'status' => $status,
            'error' => $json['error'] ?? 'Request failed',
            'details' => $json,
        ];
    }

    /**
     * Log errors for debugging
     */
    protected function logError(\Throwable $e, string $url, array $payload = []): void
    {
        Log::error('CodexConnect API Error', [
            'url' => $url,
            'error' => $e->getMessage(),
            'payload' => $payload,
            'trace' => $e->getTraceAsString(),
        ]);
    }

    /**
     * Get service status
     */
    public function getStatus(): array
    {
        return $this->get('/status');
    }

    /**
     * Health check for the service
     */
    public function healthCheck(): bool
    {
        $result = $this->ping();
        return $result['success'] ?? false;
    }
}
