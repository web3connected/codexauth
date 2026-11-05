<?php

namespace Web3Codex\CodexSecure\Http\Middleware;

/**
 * EnsureDeviceIsRegistered Middleware
 *
 * Ensures the current device is registered and trusted for the authenticated user.
 */

use Closure;
use Illuminate\Http\Request;
use Web3Codex\CodexAuth\Services\CodexDevices;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureDeviceIsRegistered
{
    protected CodexDevices $devices;

    public function __construct(CodexDevices $devices)
    {
        $this->devices = $devices;
    }

    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $deviceUID = $this->devices->getDeviceUID();
        $status = $this->devices->getDeviceStatusForUser($user->id, $deviceUID);

        if ($status !== 'active') {
            return response()->json([
                'error' => 'Device not registered or inactive.',
                'status' => $status,
            ], 403);
        }

        return $next($request);
    }
}
