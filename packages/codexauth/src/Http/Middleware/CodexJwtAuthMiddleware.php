<?php

namespace Web3Codex\CodexAuth\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Admin\Admin;

/**
 * CodexJwtAuthMiddleware
 *
 * JWT-based authentication middleware for API routes.
 * Falls back to session authentication for hybrid support.
 */
class CodexJwtAuthMiddleware
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
        $authenticated = false;
        $authMethod = 'none';

        // Try JWT authentication first
        $jwtToken = $this->extractJwtToken($request);
        if ($jwtToken) {
            $payload = $this->verifyJwtToken($jwtToken);
            if ($payload && isset($payload['user_id'])) {
                $user = Admin::find($payload['user_id']);
                if ($user && $user->is_active) {
                    Auth::guard('admin')->setUser($user);
                    $authenticated = true;
                    $authMethod = 'jwt';
                }
            }
        }

        // Fallback to session authentication
        if (!$authenticated && Auth::guard('admin')->check()) {
            $authenticated = true;
            $authMethod = 'session';
        }

        // Also check manual session data as fallback
        if (!$authenticated && session('authenticated_user_id')) {
            $user = Admin::find(session('authenticated_user_id'));
            if ($user && $user->is_active) {
                Auth::guard('admin')->setUser($user);
                $authenticated = true;
                $authMethod = 'session_manual';
            }
        }

        Log::info('[CodexJwtAuthMiddleware] Authentication check', [
            'url' => $request->url(),
            'authenticated' => $authenticated,
            'auth_method' => $authMethod,
            'has_jwt_token' => !empty($jwtToken),
            'session_id' => $request->session()->getId(),
            'user_id' => $authenticated ? Auth::guard('admin')->user()->id : null,
        ]);

        if (!$authenticated) {
            Log::warning('[CodexJwtAuthMiddleware] User not authenticated, redirecting to login');
            return redirect()->route('admin.login');
        }

        Log::info('[CodexJwtAuthMiddleware] User authenticated via ' . $authMethod . ', proceeding');
        return $next($request);
    }

    /**
     * Extract JWT token from request
     *
     * @param Request $request
     * @return string|null
     */
    protected function extractJwtToken(Request $request): ?string
    {
        // Check Authorization header
        $authHeader = $request->header('Authorization');
        if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
            return substr($authHeader, 7);
        }

        // Check session storage
        return session('codex_jwt_token');
    }

    /**
     * Verify JWT token
     *
     * @param string $token
     * @return array|null
     */
    protected function verifyJwtToken(string $token): ?array
    {
        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            return null;
        }

        [$encodedHeader, $encodedPayload, $encodedSignature] = $parts;

        $signature = hash_hmac(
            'sha256',
            $encodedHeader . '.' . $encodedPayload,
            config('app.key'),
            true
        );

        $expectedSignature = $this->base64UrlEncode($signature);

        if (!hash_equals($expectedSignature, $encodedSignature)) {
            return null;
        }

        $payload = json_decode($this->base64UrlDecode($encodedPayload), true);

        // Check expiration
        if (isset($payload['exp']) && time() > $payload['exp']) {
            return null;
        }

        return $payload;
    }

    /**
     * Base64 URL encode
     *
     * @param string $data
     * @return string
     */
    protected function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    /**
     * Base64 URL decode
     *
     * @param string $data
     * @return string
     */
    protected function base64UrlDecode(string $data): string
    {
        return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
    }
}
