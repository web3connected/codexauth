<?php

namespace Web3Codex\CodexAuth\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CodexTimeClient
{
    protected string $baseUrl;
    protected ?string $apiKey;
    protected int $timeout;

    public function __construct()
    {
        $this->baseUrl = config('services.codextime.url', 'http://localhost:3001');
        $this->apiKey = config('services.codextime.api_key');
        $this->timeout = config('services.codextime.timeout', 5);
    }

    /**
     * Get current TIU from codextime-api
     */
    public function getCurrentTIU(): float
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders($this->getHeaders())
                ->get(rtrim($this->baseUrl, '/').'/api/time/current-tiu');

            if ($response->successful()) {
                $data = $response->json();
                return (float) ($data['tiu'] ?? $data['timestamp'] ?? microtime(true));
            }

            Log::error('CodexTime API error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            throw new \Exception("TIU fetch failed: {$response->status()}");

        } catch (\Exception $e) {
            Log::error('CodexTimeClient::getCurrentTIU failed', [
                'error' => $e->getMessage(),
            ]);

            // Fallback to microtime
            return microtime(true);
        }
    }

    /**
     * Validate TIU drift
     */
    public function validateTIUDrift(float $storedTIU, float $maxDrift = 2.5): bool
    {
        $currentTIU = $this->getCurrentTIU();
        $drift = abs($currentTIU - $storedTIU);
        return $drift <= $maxDrift;
    }

    /**
     * Get harmonic tolerance (placeholder)
     */
    public function getHarmonicTolerance(): float
    {
        return config('codextime.harmonic_tolerance', 0.05);
    }

    /**
     * Get HTTP headers for API calls
     */
    protected function getHeaders(): array
    {
        $headers = [
            'Accept' => 'application/json',
        ];

        if ($this->apiKey) {
            $headers['X-API-Key'] = $this->apiKey;
        }

        return $headers;
    }
}
