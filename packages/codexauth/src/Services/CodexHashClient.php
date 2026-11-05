<?php

namespace Web3Codex\CodexAuth\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CodexHashClient
{
    protected string $baseUrl;
    protected ?string $apiKey;
    protected int $timeout;

    public function __construct()
    {
        $this->baseUrl = config('services.codexhash.url', 'http://localhost:8001');
        $this->apiKey = config('services.codexhash.api_key');
        $this->timeout = config('services.codexhash.timeout', 5);
    }

    /**
     * Generate CodexHarmonic hash via HTTP call to codexhash-api
     */
    public function hashPassword(string $password, string $deviceId, ?float $tiu = null): array
    {
        try {
            $tiu = $tiu ?? $this->getCurrentTIU();

            $response = Http::timeout($this->timeout)
                ->withHeaders($this->getHeaders())
                ->post("{$this->baseUrl}/api/hash/generate", [
                    'secret' => $password,
                    'salt' => $deviceId, // Use deviceId as salt
                    'tiu' => $tiu,
                    'rounds' => 16,
                    'email' => null, // Not needed for device-based auth
                    'record_chain' => false,
                ]);

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'hash' => $data['hash'],
                    'salt' => $data['salt'],
                    'tiu' => $data['tiu'],
                    'rounds' => $data['rounds'],
                    'algorithm' => $data['algorithm'],
                ];
            }

            Log::error('CodexHash API error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            throw new \Exception("Hash generation failed: {$response->status()}");

        } catch (\Exception $e) {
            Log::error('CodexHashClient::hashPassword failed', [
                'error' => $e->getMessage(),
                'deviceId' => $deviceId,
            ]);

            // Fallback to basic hash if API is down
            return $this->fallbackHash($password, $deviceId, $tiu);
        }
    }

    /**
     * Verify password against stored hash via HTTP call
     */
    public function verifyPassword(string $password, string $storedHash, string $salt, float $storedTIU, int $rounds = 16): bool
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders($this->getHeaders())
                ->post("{$this->baseUrl}/api/hash/validate", [
                    'attempted' => $password,
                    'storedHash' => $storedHash,
                    'salt' => $salt,
                    'tiu' => $storedTIU,
                    'rounds' => $rounds,
                    'buffer' => 0.000001,
                    'verify_chain' => false,
                ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['valid'] ?? false;
            }

            Log::error('CodexHash API validation error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return false;

        } catch (\Exception $e) {
            Log::error('CodexHashClient::verifyPassword failed', [
                'error' => $e->getMessage(),
            ]);

            // Fallback to basic verification if API is down
            return $this->fallbackVerify($password, $storedHash, $salt, $storedTIU, $rounds);
        }
    }

    /**
     * Get current TIU from codextime-api
     */
    protected function getCurrentTIU(): float
    {
        try {
            $timeClient = app(CodexTimeClient::class);
            return $timeClient->getCurrentTIU();
        } catch (\Exception $e) {
            Log::warning('Failed to get TIU from CodexTimeClient, using fallback', [
                'error' => $e->getMessage(),
            ]);
            return microtime(true);
        }
    }

    /**
     * Get HTTP headers for API calls
     */
    protected function getHeaders(): array
    {
        $headers = [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ];

        if ($this->apiKey) {
            $headers['X-API-Key'] = $this->apiKey;
        }

        return $headers;
    }

    /**
     * Fallback hash implementation (basic SHA-256)
     */
    protected function fallbackHash(string $password, string $deviceId, float $tiu): array
    {
        $combined = $password . ':' . $deviceId . ':' . $tiu;
        $hash = hash('sha256', $combined);

        return [
            'hash' => $hash,
            'salt' => $deviceId,
            'tiu' => $tiu,
            'rounds' => 1,
            'algorithm' => 'sha256_fallback',
        ];
    }

    /**
     * Fallback verification (basic SHA-256)
     */
    protected function fallbackVerify(string $password, string $storedHash, string $salt, float $storedTIU, int $rounds): bool
    {
        $regenerated = $this->fallbackHash($password, $salt, $storedTIU);
        return hash_equals($regenerated['hash'], $storedHash);
    }
}
