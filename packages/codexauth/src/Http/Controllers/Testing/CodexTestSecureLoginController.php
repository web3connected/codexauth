<?php

namespace Web3Codex\CodexAuth\Http\Controllers\Test;

/**
 * CodexTestSecureLoginController
 *
 * Test version of CodexSecureLoginController for testing purposes.
 * Handles all forms of authentication including web login, API login, and device management.
 * This is the TEST version - main controller is CodexSecureLoginController.
 */

use App\Models\Admin\Admin;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Web3Codex\CodexTime\Services\CodexTime;
use Web3Codex\CodexAuth\Services\CodexDevices;
use Web3Codex\CodexAuth\Services\CodexSession;
use Web3Codex\CodexSecure\Services\CodexSecure;
use Web3Codex\CodexCore\Support\CodexEthosLattice;
use Web3Codex\CodexAuth\Services\CodexAuthOrchestrator;

class CodexTestSecureLoginController extends Controller
{
    protected CodexSecure $secure;
    protected CodexDevices $devices;
    protected CodexSession $session;
    protected CodexAuthOrchestrator $auth;
    protected CodexTime $time;
    protected CodexEthosLattice $ethos;

    protected string $guard = 'admin';

    public function __construct(
        CodexSecure $secure,
        CodexDevices $devices,
        CodexSession $session,
        CodexAuthOrchestrator $auth,
        CodexTime $time,
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
     * Show the login form for testing.
     */
    public function showLoginForm(): View
    {
        // Initialize device context and user session
        $deviceContext = $this->devices->initializeDevice();
        $this->session->initializeUserSession($deviceContext, $this->guard);

        return view('auth/login', [
            'device_context' => $deviceContext,
            'device_registered' => $deviceContext['registered'] ?? false,
            'testing_mode' => true,
            'controller' => 'CodexTestSecureLoginController'
        ]);
    }

    /**
     * Handle test login request.
     */
    public function login(Request $request): JsonResponse|RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                    'testing_mode' => true
                ], 422);
            }
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $credentials = $request->only('email', 'password');

        // Test authentication
        if (Auth::guard($this->guard)->attempt($credentials, $request->boolean('remember'))) {
            $user = Auth::guard($this->guard)->user();
            $request->session()->regenerate();

            // Initialize CodexSecure session for testing
            // $this->secure->initializeSession($user->email); // TODO: Check correct method

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Test login successful',
                    'user' => $user,
                    'testing_mode' => true,
                    'controller' => 'CodexTestSecureLoginController'
                ]);
            }

            return redirect()->intended('/admin/dashboard')
                ->with('success', 'Test login successful');
        }

        if ($request->expectsJson()) {
            return response()->json([
                'success' => false,
                'message' => 'Test login failed - Invalid credentials',
                'testing_mode' => true
            ], 401);
        }

        return redirect()->back()
            ->withErrors(['email' => 'Invalid credentials'])
            ->withInput();
    }

    /**
     * Handle test API login.
     */
    public function apiLogin(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'testing_mode' => true
            ], 422);
        }

        $credentials = $request->only('email', 'password');

        if (Auth::guard($this->guard)->attempt($credentials)) {
            $user = Auth::guard($this->guard)->user();

            // Generate test token
            // $token = $user->createToken('test-auth-token')->plainTextToken; // TODO: Check Sanctum setup
            $token = 'test-token-' . time(); // Temporary test token

            return response()->json([
                'success' => true,
                'message' => 'Test API login successful',
                'token' => $token,
                'user' => $user,
                'testing_mode' => true,
                'controller' => 'CodexTestSecureLoginController'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Test API login failed - Invalid credentials',
            'testing_mode' => true
        ], 401);
    }

    /**
     * Get test user information.
     */
    public function getUser(Request $request): JsonResponse
    {
        $user = $request->user($this->guard);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated',
                'testing_mode' => true
            ], 401);
        }

        return response()->json([
            'success' => true,
            'user' => $user,
            'testing_mode' => true,
            'controller' => 'CodexTestSecureLoginController'
        ]);
    }

    /**
     * Test credentials validation.
     */
    public function testCredentials(Request $request): JsonResponse
    {
        // Test credentials for development
        $testCredentials = [
            'email' => 'test@codex.admin',
            'password' => 'test123456'
        ];

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'testing_mode' => true
            ], 422);
        }

        $credentials = $request->only('email', 'password');

        // Check if using test credentials
        if ($credentials['email'] === $testCredentials['email'] &&
            $credentials['password'] === $testCredentials['password']) {

            return response()->json([
                'success' => true,
                'message' => 'Test credentials validated successfully',
                'is_test_user' => true,
                'testing_mode' => true,
                'controller' => 'CodexTestSecureLoginController'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Test credentials validation failed',
            'testing_mode' => true
        ], 401);
    }
}
