<?php

namespace Web3Codex\CodexAuth\Http\Controllers\Test;

/**
 * CodexTestAuthResetTokenController
 *
 * Test version of CodexSecureAuthResetTokenController for testing token reset functionality.
 * Handles reset token generation and management for testing purposes.
 */

use App\Models\Admin\Admin;
use Illuminate\Support\Str;
use Web3Codex\CodexSecure\Facades\CodexSecure;
use Illuminate\Http\Request;
use App\Mail\CodexResetTokenMail;
use Illuminate\Routing\Controller;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\JsonResponse;

class CodexTestAuthResetTokenController extends Controller
{
    public function __construct()
    {
        // Only guests on the admin guard may request a reset token
        $this->middleware('guest:admin');

        // Throttle to 5 requests per minute to prevent abuse
        // $this->middleware('throttle:reset-token,5,1')->only('resetToken');
    }

    /**
     * Show the reset-token request form for testing.
     */
    public function showRequestForm()
    {
        // If you mount via your React shell:
        return view('app', [
            'component' => 'AuthResetRequest',
            'testing_mode' => true,
            'controller' => 'CodexTestAuthResetTokenController'
        ]);

        // Or if you use a Blade view:
        // return view('auth.passwords.email');
    }

    /**
     * Show the Codex repair guidance screen for testing.
     */
    public function repair(): View
    {
        return view('auth.repair', [
            'testing_mode' => true,
            'controller' => 'CodexTestAuthResetTokenController',
            'message' => 'This is the TEST repair page'
        ]);
    }

    /**
     * Issue and email a Codex reset token for admin users (testing).
     */
    public function resetToken(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email|exists:admins,email',
        ]);

        // Generate a test reset token
        $token = Str::random(60);

        // Create reset token in CodexSecure (testing)
        $resetCreated = CodexSecure::createResetToken($data['email'], $token);

        if (! $resetCreated) {
            throw ValidationException::withMessages([
                'email' => ['Unable to create reset token (TEST). Please try again.'],
            ]);
        }

        // Send test email
        try {
            // Mail::to($data['email'])->send(new CodexResetTokenMail($token, now()->addHours(1)));
            // Skip actual email sending in test mode
        } catch (\Exception $e) {
            // Log but don't fail for test
            Log::warning('Test email failed: ' . $e->getMessage());
        }

        return redirect()->route('login')
            ->with('success', 'Test reset token has been sent to your email address.');
    }

    /**
     * API endpoint for reset token request (testing).
     */
    public function resetTokenApi(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => 'required|email',
        ]);

        // Generate a test reset token
        $token = 'test-reset-' . Str::random(40);

        try {
            // Simulate token creation
            $resetCreated = CodexSecure::createResetToken($data['email'], $token);

            if (! $resetCreated) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unable to create reset token (TEST)',
                    'testing_mode' => true
                ], 500);
            }

            return response()->json([
                'success' => true,
                'message' => 'Test reset token created successfully',
                'email' => $data['email'],
                'token' => $token, // Include token in test response
                'testing_mode' => true,
                'controller' => 'CodexTestAuthResetTokenController',
                'note' => 'In production, token would be sent via email'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating reset token (TEST): ' . $e->getMessage(),
                'testing_mode' => true
            ], 500);
        }
    }

    /**
     * Validate reset token for testing.
     */
    public function validateResetToken(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
        ]);

        try {
            $isValid = CodexSecure::validateResetToken($data['email'], $data['token']);

            return response()->json([
                'success' => $isValid,
                'message' => $isValid ? 'Test reset token is valid' : 'Test reset token is invalid or expired',
                'email' => $data['email'],
                'token_valid' => $isValid,
                'testing_mode' => true,
                'controller' => 'CodexTestAuthResetTokenController'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error validating reset token (TEST): ' . $e->getMessage(),
                'testing_mode' => true
            ], 500);
        }
    }
}
