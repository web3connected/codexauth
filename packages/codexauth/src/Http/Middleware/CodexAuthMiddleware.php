<?php

namespace Web3Codex\CodexAuth\Http\Middleware;

/**
 * CodexAuthMiddleware
 *
 * This middleware handles authentication for the CodexAuth package.
 * It ensures that only authenticated users can access certain routes.
 * If the user is not authenticated, they will be redirected to the login page.
 */

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;


class CodexAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response)  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Debug logging
        $isAuthenticated = Auth::guard('admin')->check();
        $user = Auth::guard('admin')->user();

        Log::info('[CodexAuthMiddleware] Dashboard access attempt', [
            'url' => $request->url(),
            'is_authenticated' => $isAuthenticated,
            'user_id' => $user ? $user->id : null,
            'user_email' => $user ? $user->email : null,
            'session_id' => $request->session()->getId(),
            'has_session' => $request->hasSession(),
        ]);

        // Check if the user is authenticated
        if (! $isAuthenticated) {
            Log::warning('[CodexAuthMiddleware] User not authenticated, redirecting to login');
            // Redirect to the login page if not authenticated
            return redirect()->route('admin.login');
        }

        Log::info('[CodexAuthMiddleware] User authenticated, proceeding to dashboard');
        // Proceed with the request if authenticated
        return $next($request);
    }
}

