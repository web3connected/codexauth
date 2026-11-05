<?php

namespace Web3Codex\CodexSecure\Http\Middleware;

/**
 * CodexTIUMiddleware
 * This middleware is responsible for ensuring that the user is authenticated,
 * the session token is valid, and TIU sync is successful.
 *
 * @package App\Http\Middleware
 */

use Closure;
use Illuminate\Http\Request;
use App\Facades\CodexSecure;
use Illuminate\Support\Facades\Auth;

class CodexTIUMiddleware
{
    protected string $defaultGuard;

    public function __construct(string $defaultGuard = 'web')
    {
        $this->defaultGuard = $defaultGuard;
    }

    public function handle(Request $request, Closure $next, ?string $guard = 'admin')
    {
        $guard = $guard ?? $this->defaultGuard;
        $user = Auth::guard($guard)->user();

        if (!$user) {
            return $this->reject($request, 'Authentication required.', 'admin.login');
        }

        $sessionToken = session('codex_token');

        if (!$sessionToken || !CodexSecure::validateSessionToken($user->email, $sessionToken)) {
            Auth::guard($guard)->logout();
            return $this->reject($request, 'Codex session expired or invalid.', 'identity.admin.login', 'session');
        }

        if (!CodexSecure::validateTiuSync()) {
            Auth::guard($guard)->logout();
            return $this->reject($request, 'TIU sync error. Please log in again.', 'identity.admin.login', 'tiu');
        }

        return $next($request);
    }

    protected function reject(Request $request, string $message, string $route, string $key = 'auth')
    {
        if ($request->expectsJson()) {
            return response()->json(['error' => $message], 403);
        }

        return redirect()->route($route)->withErrors([$key => $message]);
    }
}
