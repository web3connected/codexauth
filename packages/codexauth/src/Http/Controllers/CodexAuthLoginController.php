<?php

namespace Web3Codex\CodexAuth\Http\Controllers;

/**
 * AI: Check aiPrompt.md in projects root directory - For More Details
 *
 * CodexAuthLoginController - Main Authentication Controller (LIVE VERSION)
 *
 * This is the MAIN and PRIMARY authentication controller for the Codex Admin system.
 * Handles all forms of authentication including web login, API login, and device management.
 *
 * PURPOSE: Single source of truth for all authentication in the Web3Connected ecosystem.
 * DESIGN: Secure login with device initialization, user authentication, and session management.
 * INTEGRATION: Works with all Codex services for complete authentication flow.
 *
 * DEVELOPMENT NOTE:
 * - This is the LIVE controller that should handle all login flows
 * - Test versions are in /test/ folder for experimentation
 * - All authentication should eventually flow through this controller
 * - AdminAuthController should delegate to this controller
 *
 * Key Features:
 * - Web-based login with views
 * - API login for frontend applications
 * - Device registration and management
 * - Session token management
 * - Test credentials support (development)
 * - Codex Auth token validation
 * - User information retrieval
 * - Secure logout functionality
 *
 * @package CodexAuth
 * @author  Web3Connected
 * @version 2.0.0
 * @license MIT
 */


use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Web3Codex\CodexAuth\Services\CodexTimeClient;
use Web3Codex\CodexAuth\Services\CodexDevices;
use Web3Codex\CodexAuth\Services\CodexSession;
use Web3Codex\CodexAuth\Services\CodexAuthSecure;
use Web3Codex\CodexCore\Support\CodexEthosLattice;
use Web3Codex\CodexAuth\Services\CodexAuthOrchestrator;



class CodexAuthLoginController extends Controller
{
    protected CodexAuthSecure $secure;
    protected CodexDevices $devices;
    protected CodexSession $session;
    protected CodexAuthOrchestrator $auth;
    /**
     * @var CodexTimeClient|mixed|null
     */
    protected $time;
    protected CodexEthosLattice $ethos;

    public function __construct(
        CodexAuthSecure $secure,
        CodexDevices $devices,
        CodexSession $session,
        CodexAuthOrchestrator $auth,
        $time, // CodexTimeClient|mixed|null
        CodexEthosLattice $ethos
    ) {
        $this->secure = $secure;
        $this->devices = $devices;
        $this->session = $session;
        $this->auth = $auth;
        $this->time = $time;
        $this->ethos = $ethos;
    }

    /**
     * Login Endpoint for admin users
     * No Password is used, only secret
     *
     * @param \Illuminate\Http\Request $request
     * @return JsonResponse|RedirectResponse
     */
    public function login(Request $request): JsonResponse|RedirectResponse
    {

        // Log the full incoming request for debugging double login requests
        Log::info('[CodexAdmin] Incoming /api/admin/login request', [
            'headers' => $request->headers->all(),
            'body' => $request->all(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'timestamp' => now()->toDateTimeString(),
        ]);


        $credentials = $request->validate([
            'email' => 'required|email',
            'secret' => 'required|string|min:8|max:32',
            'challenge_id' => 'required|string',
            'challenge_tiu' => 'required|numeric',
        ]);

        $email = $credentials['email'];
        $secret = $credentials['secret'];
        $challengeId = $credentials['challenge_id'];
        $challengeTiu = $credentials['challenge_tiu'];

        // Validate TIU drift (temporal sync) with drift rate analysis
        $currentTiu = $this->time->getCurrentTIU();

        // Calculate current offset: Δt_now = T_codex - T_local
        $currentOffset = $currentTiu - $challengeTiu;

        // Retrieve previous sync data for this user/session
        $sessionKey = "tiu_sync:{$email}:" . session()->getId();
        $previousSync = cache()->get($sessionKey);

        $driftRate = 0;
        $isDriftExcessive = false;
        $isDriftWarning = false;

        if ($previousSync) {
            // Calculate drift rate: (Δt_now - Δt_last) / (T_now - T_last)
            $timeDelta = $currentTiu - $previousSync['timestamp'];
            if ($timeDelta > 0) {
                $offsetDelta = $currentOffset - $previousSync['offset'];
                $driftRate = $offsetDelta / $timeDelta; // TIU units per TIU unit (dimensionless)
            }

            // Security policy thresholds
            $maxDriftPerSecond = config('codexauth.security.max_drift_per_second', 2.5); // TIU/second
            $warningThreshold = config('codexauth.security.warning_drift_threshold', 1.0); // TIU/second

            $isDriftExcessive = abs($driftRate) > $maxDriftPerSecond;
            $isDriftWarning = abs($driftRate) > $warningThreshold;
        }

        // Store current sync data for next comparison
        cache()->put($sessionKey, [
            'timestamp' => $currentTiu,
            'offset' => $currentOffset,
            'email' => $email,
            'updated_at' => now()
        ], 3600); // Store for 1 hour

        Log::info('[CodexAdmin] TIU Drift Analysis', [
            'email' => $email,
            'challenge_tiu' => $challengeTiu,
            'current_tiu' => $currentTiu,
            'current_offset' => $currentOffset,
            'drift_rate' => round($driftRate, 6),
            'drift_rate_per_second' => round($driftRate, 6),
            'is_excessive_drift' => $isDriftExcessive,
            'is_warning_drift' => $isDriftWarning,
            'has_previous_sync' => $previousSync !== null,
            'phase_integrity' => $isDriftExcessive ? 'FAILED' : ($isDriftWarning ? 'WARNING' : 'OK')
        ]);

        // Apply security policy
        if ($isDriftExcessive) {
            Log::warning('[CodexAdmin] Clock drift too high - rejecting authentication', [
                'email' => $email,
                'drift_rate' => $driftRate,
                'threshold' => config('codexauth.security.max_drift_per_second', 2.5)
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Clock drift too high – sync to CodexTime required',
                'error' => 'excessive_drift',
                'drift_analysis' => [
                    'drift_rate' => round($driftRate, 6),
                    'max_allowed' => config('codexauth.security.max_drift_per_second', 2.5),
                    'recommendation' => 'Please sync your device clock and try again'
                ]
            ], 426); // 426 Upgrade Required - client needs to sync time
        }

        if ($isDriftWarning) {
            Log::warning('[CodexAdmin] Clock drift is unstable - auth may be revoked soon', [
                'email' => $email,
                'drift_rate' => $driftRate
            ]);
        }

        $user = User::where('email', $email)->where('is_active', true)->first();

        // Check for test users first (for development/testing)
        $testUser = $this->getTestUser($email, $secret);
        if ($testUser) {
            // Create a mock User object for test users
            $user = new User();
            $user->id = $testUser['id'];
            $user->name = $testUser['name'];
            $user->email = $testUser['email'];
            $user->secret = bcrypt($testUser['password']); // Hash for consistency
            $user->is_active = true;
            $user->role = $testUser['role'];
            $authenticated = true; // Test users are automatically authenticated

            Log::info('[CodexAdmin] Test user login', [
                'email' => $email,
                'test_user_id' => $testUser['id'],
                'role' => $testUser['role']
            ]);
        } else {
            if (!$user) {
                return $this->auth->handleLoginFailure($request, 'Invalid email or secret.');
            }

            // Check if the user has a valid codex, fallback to Laravel hash if not
            if (!empty($user->codex) && $this->secure->isValidCodex($user->codex)) {
                // Verify using CodexSecure
                $authenticated = $this->secure->verifyUser($email, $secret, $user);
            } else {
                // Fallback to Laravel hash verification if codex is not available
                $authenticated = Hash::check($secret, $user->secret ?? $user->password);
            }
        }

        if (!$authenticated) {
            return $this->auth->handleLoginFailure($request, 'Invalid email or secret.');
        }

        // If the user is authenticated, initialize the device context
        $deviceContext = $this->devices->initializeDevice();
        $deviceUID = $deviceContext['device_id'];

        // // Check if the device is registered and trusted
        // $requireTrusted = config('codexsecure.require_trusted_device', true);
        // if ($requireTrusted) {
        //     $deviceStatus = $this->devices->getDeviceStatusForUser($user->id, $deviceUID);
        //     if ($deviceStatus !== 'active') {
        //         return $this->auth->handleLoginFailure($request, 'untrusted_device', $deviceContext);
        //     }
        // }

        // Debug: Log session state before login
        Log::info('[CodexAdmin] Pre-authentication session state', [
            'session_id_before' => session()->getId(),
            'request_session_id' => $request->session()->getId(),
            'cookies' => $request->cookies->all(),
        ]);

        // Store current session ID to prevent regeneration issues
        $originalSessionId = session()->getId();

        // Prevent session regeneration by temporarily disabling it
        $originalRegenerateToken = config('session.regenerate_token', true);
        config(['session.regenerate_token' => false]);

        // If the device is not registered, register it
        $sessionToken = $this->session->issueSessionToken($email);

        // Generate JWT token for API authentication with Codex features
        $jwtPayload = [
            'user_id' => $user->id,
            'email' => $user->email,
            'guard' => $this->guard,
            'device_id' => $deviceUID,
            'session_token' => $sessionToken,
            'tiu_issued' => $currentTiu,
            'drift_rate' => round($driftRate, 6),
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24), // 24 hours
            'iss' => 'codex-admin',
            'aud' => 'web3connected',
        ];

        $jwtToken = $this->generateJwtToken($jwtPayload);

        // Also maintain session-based auth for web routes (hybrid approach)
        // MANUAL AUTH: Don't use Auth::login() to prevent session regeneration
        // Auth::guard($this->guard)->login($user, false);

        // Instead, manually set authentication in session
        $authKey = 'login_' . $this->guard . '_' . sha1(static::class) . '_' . sha1($this->guard);
        session([$authKey => $user->id]);

        // Ensure we're still using the original session
        if (session()->getId() !== $originalSessionId) {
            Log::warning('[CodexAdmin] Session ID changed during auth', [
                'original' => $originalSessionId,
                'new' => session()->getId(),
            ]);
        }

        // Store JWT token in session for hybrid approach
        session(['codex_jwt_token' => $jwtToken]);
        session(['auth.admin' => $user->id]);
        session(['authenticated_user_id' => $user->id]);
        session(['authenticated_email' => $user->email]);

        $this->session->initializeUserSession($deviceContext, $this->guard);

        // Force session save to ensure authentication persists
        session()->save();

        // Debug: Log authentication state after login
        Log::info('[CodexAdmin] Authentication completed', [
            'user_id' => $user->id,
            'email' => $user->email,
            'guard' => $this->guard,
            'is_authenticated' => Auth::guard($this->guard)->check(),
            'session_id_after' => session()->getId(),
            'request_session_after' => $request->session()->getId(),
            'session_driver' => config('session.driver'),
            'auth_user_id' => Auth::guard($this->guard)->user() ? Auth::guard($this->guard)->user()->id : null,
            'jwt_token_length' => strlen($jwtToken),
            'jwt_payload' => $jwtPayload,
            'manual_session_data' => [
                'auth.admin' => session('auth.admin'),
                'authenticated_user_id' => session('authenticated_user_id'),
                'has_jwt_token' => !empty(session('codex_jwt_token')),
            ]
        ]);

        // Validate the user's ethos
        $this->validateEthos($email, $deviceContext, $request);

        // Restore original session configuration
        config(['session.regenerate_token' => $originalRegenerateToken]);

        return $this->auth->handleLoginSuccess($request, $user, $sessionToken, $deviceContext);
    }

    /**
     * Register a new device for the user.
     *
     * @param \Illuminate\Http\Request $request
     * @return mixed|RedirectResponse
     */
    public function completeDeviceRegistration(Request $request): RedirectResponse
    {
        $deviceContext = session()->pull('device_registration_context');

        if (!$deviceContext) {
            return redirect()->route('login')->with('error', 'Invalid registration session.');
        }

        $url = session()->pull('url.intended', route('admin.dashboard'));

        return redirect($url)->with('success', 'Device registered successfully.');
    }

    /**
     * Summary of validateEthos
     * @param string $email
     * @param array $deviceContext
     * @param \Illuminate\Http\Request $request
     * @return void
     */
    protected function validateEthos(string $email, array $deviceContext, Request $request): void
    {
        try {
            $this->ethos->validate(
                CodexEthosLattice::ZONE_TRUST,
                [
                    'event' => 'login',
                    'email' => $email,
                    'device_id' => $deviceContext['device_id'] ?? null,
                    'device_key' => $deviceContext['device_key'] ?? null,
                    'trust_score' => $deviceContext['trust_score'] ?? null,
                    'ip' => $this->normalizeIp($request->ip()),
                    'user_agent' => $request->userAgent(),
                    'tiu' => $this->time->getCurrentTIU(),
                ]
            );
        } catch (\Exception $e) {
            logger()->error('CodexEthos validation failed', [
                'email' => $email,
                'error' => $e->getMessage(),
            ]);
        }
    }
    /**
     * Generate a secure, time-bound authentication challenge for the frontend.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function generateChallenge(Request $request): JsonResponse
    {
        $email = $request->input('email');
        $challengeId = uniqid('codex_challenge_', true);
        $timestamp = now()->toISOString();
        $tiu = $this->time->getCurrentTIU();

        // Optionally: Store challenge in session or cache for later verification
        // session(["codex_challenge_$challengeId" => ["email" => $email, "tiu" => $tiu, "created_at" => $timestamp]]);

        return response()->json([
            'success' => true,
            'challenge' => [
                'challenge_id' => $challengeId,
                'email' => $email,
                'timestamp' => $timestamp,
                'tiu' => $tiu,
            ],
            'message' => 'Codex authentication challenge generated.'
        ]);
    }

    /**
     * Get test user by email and password
     *
     * @param string $email
     * @param string $password
     * @return array|null
     */
    protected function getTestUser(string $email, string $password): ?array
    {
        $testUsers = config('test_users.test_users', []);

        foreach ($testUsers as $user) {
            if ($user['email'] === $email && $user['password'] === $password) {
                return $user;
            }
        }

        return null;
    }

    /**
     * Normalize IP address for security logging and tracking
     *
     * @param string|null $ip
     * @return string
     */
    protected function normalizeIp(?string $ip): string
    {
        if (empty($ip)) {
            return 'unknown';
        }

        // Handle IPv6 mapped IPv4 addresses
        if (str_starts_with($ip, '::ffff:')) {
            $ip = substr($ip, 7);
        }

        // Validate and return
        if (filter_var($ip, FILTER_VALIDATE_IP)) {
            return $ip;
        }

        return 'invalid';
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

    /**
     * Generate JWT token for Codex authentication
     *
     * @param array $payload
     * @return string
     */
    protected function generateJwtToken(array $payload): string
    {
        $header = [
            'typ' => 'JWT',
            'alg' => 'HS256'
        ];

        $encodedHeader = $this->base64UrlEncode(json_encode($header));
        $encodedPayload = $this->base64UrlEncode(json_encode($payload));

        $signature = hash_hmac(
            'sha256',
            $encodedHeader . '.' . $encodedPayload,
            config('app.key'),
            true
        );

        $encodedSignature = $this->base64UrlEncode($signature);

        return $encodedHeader . '.' . $encodedPayload . '.' . $encodedSignature;
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
}
