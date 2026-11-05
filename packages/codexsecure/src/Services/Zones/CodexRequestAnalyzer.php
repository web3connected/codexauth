<?php

namespace Web3Codex\CodexSecure\Services\Zones;

/**
 * CodexRequestAnalyzer
 *
 * This service analyzes incoming requests to determine sync accuracy
 * against the expected route fingerprint.
 *
 * @package Web3Codex\CodexCore\Services\Zones
 */

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Routing\Route as RouteObject;
use Web3Codex\CodexSecure\Services\Zones\CodexRouteAnalyzer;

class CodexRequestAnalyzer
{
    protected Request $request;
    protected CodexRouteAnalyzer $routeAnalyzer;

    public function __construct(Request $request, CodexRouteAnalyzer $routeAnalyzer)
    {
        $this->request = $request;
        $this->routeAnalyzer = $routeAnalyzer;
    }

    /**
     * Analyze the incoming request for sync accuracy.
     */
    public function analyze(RouteObject $route, array $input = []): array
    {
        $routeFingerprint = $this->generateRouteFingerprint($route);
        $filteredInput = $this->filterIntentFields($input);
        $inputFingerprint = app('Web3Codex\CodexHash\Services\CodexHarmonicHash')->generate($filteredInput);

        $drift = app('Web3Codex\CodexHash\Services\CodexHarmonicHash')->calculateDrift($routeFingerprint, $inputFingerprint);

        $syncStatus = match (true) {
            $drift === 0.0 => 'perfect',
            $drift <= config('codexsecure.tiu_sync_threshold', 0.01) => 'good',
            $drift <= 0.05 => 'warning',
            default => 'error',
        };

        return [
            'route_fingerprint' => $routeFingerprint,
            'input_fingerprint' => $inputFingerprint,
            'drift' => $drift,
            'sync_status' => $syncStatus,
            'details' => [
                'route' => $route->uri(),
                'controller' => $route->getActionName(),
                'input_sample' => array_slice($filteredInput, 0, 5),
            ],
        ];
    }

    public function generateRouteFingerprint(RouteObject $route): string
    {
        $data = [
            'uri' => $route->uri(),
            'controller' => class_basename(optional($route->getAction())['controller'] ?? ''),
            'method' => optional($route->getAction())['method'] ?? '',
        ];

        ksort($data);

        return app('Web3Codex\CodexHash\Services\CodexHarmonicHash')->generate($data);
    }

    /**
     * Generate a fingerprint of the important input data.
     */
    protected function generateInputFingerprint(): string
    {
        $input = $this->filterIntentFields($this->request->all());

        return app('Web3Codex\CodexHash\Services\CodexHarmonicHash')->generate($input);
    }

    /**
     * Extract only intent-driven fields.
     */
    protected function filterIntentFields(array $input): array
    {
        // Step 1: Remove common noise fields
        unset($input['_token'], $input['_method'], $input['csrf_token']);

        // Step 2: Normalize input
        $normalized = [];
        foreach ($input as $key => $value) {
            if (is_string($value)) {
                $value = strtolower(trim($value));
            }
            if (is_array($value)) {
                $value = array_map(fn($v) => is_string($v) ? strtolower(trim($v)) : $v, $value);
            }
            $normalized[trim(strtolower($key))] = $value;
        }

        // Step 3: Intent-Driven Field Filter
        $intentFields = [
            'email',
            'username',
            'password',
            'query',
            'search',
            'title',
            'content',
            'message'
        ];

        $filtered = array_filter($normalized, function ($key) use ($intentFields) {
            foreach ($intentFields as $intentWord) {
                if (Str::contains($key, $intentWord)) {
                    return true;
                }
            }
            return false;
        }, ARRAY_FILTER_USE_KEY);

        // Step 4: If filtering removed everything, fallback
        if (empty($filtered)) {
            $filtered = $normalized;
        }

        // Always sort the final keys to stabilize hashing
        ksort($filtered);

        return $filtered;
    }
}
