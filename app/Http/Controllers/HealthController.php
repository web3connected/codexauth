<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

/**
 * Liveness only: answers when the application itself is running. It does not
 * check Redis, CodexHash or CodexTime.
 */
class HealthController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'service' => 'codexauth',
            'status' => 'ok',
        ]);
    }
}
