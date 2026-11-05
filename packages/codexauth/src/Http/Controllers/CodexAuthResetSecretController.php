<?php

namespace Web3Codex\CodexAuth\Http\Controllers;

/**
 * AI: Check aiPrompt.md in projects root directory - For More Details
 *
 * CodexAuthResetSecretController
 *
 * Handles the secret reset process for Codex Secure Authentication.
 * Allows admins to reset their Codex secret using a valid reset token.
 *
 * @package Web3Codex\CodexAuth\Http\Controllers
 */

use App\Models\User;
use Illuminate\Http\Request;
use Web3Codex\CodexAuth\Facades\CodexAuthSecure;
use Illuminate\Routing\Controller;
use Illuminate\Validation\ValidationException;

class CodexAuthResetSecretController extends Controller
{
    public function __construct()
    {
        // Only guests
        // $this->middleware('guest:api');
    }

    /**
     * Show the secret-reset form.
     */
    public function showResetForm()
    {
        // return view('admin.auth.reset_secret');
        return response()->json(['message' => 'Use POST /api/codex-auth/reset-secret']);
    }

    /**
     * Handle Codex secret reset.
     */
    public function resetSecret(Request $request)
    {
        $data = $request->validate([
            'email'                 => 'required|email|exists:users,email',
            'token'                 => 'required|string',
            'new_secret'            => 'required|string|min:8|confirmed',
            // expects a new_secret_confirmation field too
        ]);

        // Validate the reset token
        if (! CodexAuthSecure::validateResetToken($data['email'], $data['token'])) {
            throw ValidationException::withMessages([
                'token' => ['Invalid or expired reset token.'],
            ]);
        }

        // Fetch the user
        $user = User::where('email', $data['email'])->firstOrFail();

        // Register new Codex secret
        $codex = CodexAuthSecure::registerUser($data['email'], $data['new_secret']);

        // Persist new Codex credentials
        $user->update([
            'codex' => $codex,
        ]);

        // Revoke the used reset token
        CodexAuthSecure::revokeResetToken($data['email']);

        // JSON response for API
        return response()->json(['success' => true, 'message' => 'Your secret has been updated. You can now log in.']);
    }
}
