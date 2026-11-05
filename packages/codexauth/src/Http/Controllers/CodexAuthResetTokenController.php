<?php

namespace Web3Codex\CodexAuth\Http\Controllers;

/**
 * AI: Check aiPrompt.md in projects root directory - For More Details
 *
 * CodexAuthResetTokenController
 *
 * Handles the reset token request for Codex Secure Authentication.
 * Issues a reset token to admin users and sends it via email.
 *
 * @package Web3Codex\CodexAuth\Http\Controllers
 * @version 1.0.0
 */

use App\Models\User;
use Illuminate\Support\Str;
use Web3Codex\CodexAuth\Facades\CodexAuthSecure;
use Illuminate\Http\Request;
use Web3Codex\CodexAuth\Mail\CodexResetTokenMail;
use Illuminate\Routing\Controller;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class CodexAuthResetTokenController extends Controller
{
    public function __construct()
    {
        // Guests only
        // $this->middleware('guest:api');

        // Throttle to 5 requests per minute to prevent abuse
        $this->middleware('throttle:5,1')->only('resetToken');
    }

    /**
     * Show the reset-token request form.
     */
    public function showRequestForm()
    {
        // If you mount via your React shell:
        return view('app', ['component' => 'AuthResetRequest']);
    }

    /**
     * Show the Codex repair guidance screen.
     *
     * @return View
     */
    public function repair(): View
    {
        return view('auth.repair');
    }

    /**
     * Issue and email a Codex reset token for admin users.
     */
    public function resetToken(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $email = Str::lower(trim($data['email']));

        try {
            // Issue the reset token
            $token = CodexAuthSecure::issueResetToken($email);

            // Send Email
            Mail::to($email)->send(new CodexResetTokenMail($token, $email));

            // Log for audit
            \Illuminate\Support\Facades\Log::error("CodexSecure Reset Token sent to {$email} via Mailtrap");

            // DEV: Log the link for easy access
            $resetLink = "http://localhost:3010/reset-password?token={$token}&email=" . urlencode($email);
            \Illuminate\Support\Facades\Log::error("DEV RESET LINK: {$resetLink}");

            return response()->json([
                'status' => 'success',
                'message' => 'Reset token sent to email.',
                'email' => $email
            ]);
        } catch (\Throwable $e) {
            // Log and revoke if something went wrong
            logger()->error('Failed issuing Codex reset token', [
                'email' => $email,
                'error' => $e->getMessage(),
            ]);

            try {
                CodexAuthSecure::revokeResetToken($email);
            } catch (\Exception $ex) {
                // Ignore revocation errors
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to issue reset token. ' . $e->getMessage()
            ], 500);
        }
    }
}
