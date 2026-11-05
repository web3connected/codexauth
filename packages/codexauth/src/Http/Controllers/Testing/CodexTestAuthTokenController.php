<?php

namespace Web3Codex\CodexAuth\Http\Controllers\Testing;

/**
 * CodexTestAuthTokenController
 *
 * Test version of CodexSecureAuthTokenController for testing token validation.
 * Handles session token validation for testing purposes.
 */

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Web3Codex\CodexSecure\Facades\CodexSecure;
use Illuminate\Routing\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;

class CodexTestAuthTokenController extends Controller
{
    public function __construct()
    {
        // Only guests may validate (you're verifying before full login)
        $this->middleware('guest:admin')->only('validateToken');

        // Throttle to prevent brute‐forcing tokens
        $this->middleware('throttle:token,10,1')->only('validateToken');
    }

    /**
     * Validate a Codex session token for testing.
     */
    public function validateToken(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'token' => ['required', 'string'],
        ]);

        // Test validation logic
        $isValid = CodexSecure::validateSessionToken($data['email'], $data['token']);

        if (! $isValid) {
            throw ValidationException::withMessages([
                'token' => ['Invalid or expired session token (TEST).'],
            ]);
        }

        return redirect()
            ->route('login')
            ->with('success', 'Test session token verified successfully.');
    }

    /**
     * API endpoint to validate token for testing.
     */
    public function validateTokenApi(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'token' => ['required', 'string'],
        ]);

        // Test validation logic
        $isValid = CodexSecure::validateSessionToken($data['email'], $data['token']);

        if (! $isValid) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired session token (TEST)',
                'testing_mode' => true
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Test session token verified successfully',
            'testing_mode' => true,
            'controller' => 'CodexTestAuthTokenController'
        ]);
    }

    /**
     * Generate a test token for development.
     */
    public function generateTestToken(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
        ]);

        // Generate a test token
        $testToken = 'test-' . hash('sha256', $data['email'] . time());

        return response()->json([
            'success' => true,
            'message' => 'Test token generated',
            'token' => $testToken,
            'email' => $data['email'],
            'testing_mode' => true,
            'controller' => 'CodexTestAuthTokenController',
            'note' => 'This is a test token for development purposes only'
        ]);
    }
}
