<?php

namespace Web3Codex\CodexAuth\Http\Controllers\Test;

/**
 * CodexTestAuthLogoutController
 *
 * Handles logout for testing purposes, specifically for the "admin" guard.
 * This controller revokes the session using CodexSecure, logs out the user,
 * invalidates the session, regenerates the CSRF token, and redirects to the login page
 */

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Web3Codex\CodexSecure\Facades\CodexSecure;

class CodexTestAuthLogoutController extends Controller
{
    public function __construct()
    {
        // Only allow authenticated "admin" users to hit logout
        $this->middleware('auth:admin');
    }

    /**
     * Handle CodexSecure logout and session revocation.
     */
    public function logout(Request $request): RedirectResponse
    {
        $user = $request->user('admin');

        if ($user) {
            CodexSecure::revokeSession($user->email);
        }

        // Log out from the "admin" guard
        Auth::guard('admin')->logout();

        // Invalidate the session & regenerate CSRF token
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Redirect to your login route (make sure this name matches your routes file)
        return redirect()->route('login')
            ->with('success', 'You have been logged out successfully.');
    }
}
