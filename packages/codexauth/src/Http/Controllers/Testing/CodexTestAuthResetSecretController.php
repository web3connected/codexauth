<?php

namespace Web3Codex\CodexAuth\Http\Controllers\Test;

/**
 * CodexTestAuthResetSecretController
 *
 * Test version of CodexSecureAuthResetSecretController for testing secret reset functionality.
 * Handles Codex secret reset for admins in testing mode.
 */

use App\Models\Admin\Admin;
use Illuminate\Http\Request;
use Web3Codex\CodexSecure\Facades\CodexSecure;
use Illuminate\Routing\Controller;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\JsonResponse;

class CodexTestAuthResetSecretController extends Controller
{
    public function __construct()
    {
        // Only guests on the admin guard may access this
        $this->middleware('guest:admin');
    }

    /**
     * Show the secret-reset form for testing.
     */
    public function showResetForm()
    {
        return view('admin.auth.reset_secret', [
            'testing_mode' => true,
            'controller' => 'CodexTestAuthResetSecretController',
            'message' => 'This is the TEST secret reset form'
        ]);
    }

    /**
     * Handle Codex secret reset for admins (testing).
     */
    public function resetSecret(Request $request)
    {
        $data = $request->validate([
            'email'                 => 'required|email|exists:admins,email',
            'token'                 => 'required|string',
            'new_secret'            => 'required|string|min:8|confirmed',
            // expects a new_secret_confirmation field too
        ]);

        // Test validation of reset token
        if (! CodexSecure::validateResetToken($data['email'], $data['token'])) {
            throw ValidationException::withMessages([
                'token' => ['Invalid or expired reset token (TEST).'],
            ]);
        }

        // Fetch the admin user
        $admin = Admin::where('email', $data['email'])->firstOrFail();

        // Test registration of new Codex secret
        $codex = CodexSecure::registerUser($data['email'], $data['new_secret']);

        if ($codex) {
            return redirect()->route('login')
                ->with('success', 'Test secret reset successful! You may now log in with your new secret.');
        }

        throw ValidationException::withMessages([
            'new_secret' => ['Failed to reset secret (TEST). Please try again.'],
        ]);
    }

    /**
     * API endpoint for secret reset (testing).
     */
    public function resetSecretApi(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email'                 => 'required|email',
            'token'                 => 'required|string',
            'new_secret'            => 'required|string|min:8|confirmed',
        ]);

        // Test validation
        if (! CodexSecure::validateResetToken($data['email'], $data['token'])) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired reset token (TEST)',
                'testing_mode' => true
            ], 401);
        }

        // Simulate secret reset
        try {
            $codex = CodexSecure::registerUser($data['email'], $data['new_secret']);

            return response()->json([
                'success' => true,
                'message' => 'Test secret reset successful',
                'testing_mode' => true,
                'controller' => 'CodexTestAuthResetSecretController'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reset secret (TEST): ' . $e->getMessage(),
                'testing_mode' => true
            ], 500);
        }
    }
}
