<?php

namespace Web3Codex\CodexAuth\Http\Controllers;

/**
 * AI: Check aiPrompt.md in projects root directory - For More Details
 *
 * CodexAuthTokenController
 *
 * Handles the validation of Codex session tokens.
 * This controller is used to verify session tokens before full login.
 *
 * @package Web3Codex\CodexAuth\Http\Controllers
 * @version 1.0.0
 */

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Web3Codex\CodexSecure\Facades\CodexSecure;

class CodexAuthTokenController extends Controller
{
    public function __construct()
    {
        // Only guests may validate (you're verifying before full login)
        $this->middleware('guest:admin')->only('validateToken');

        // Throttle to prevent brute‐forcing tokens
        $this->middleware('throttle:token,10,1')->only('validateToken');
    }

    /**
     * Validate a Codex session token and redirect appropriately.
     */
    public function validateToken(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'token' => ['required', 'string'],
        ]);

        $isValid = CodexSecure::validateSessionToken($data['email'], $data['token']);

        if (! $isValid) {
            throw ValidationException::withMessages([
                'token' => ['Invalid or expired session token.'],
            ]);
        }

        return redirect()
            ->route('login')
            ->with('success', 'Session token verified successfully.');
    }
}
