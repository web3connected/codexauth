<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Web3Codex\CodexAuth\Services\CodexHashClient;
use Web3Codex\CodexAuth\Services\CodexTimeClient;
use Illuminate\Support\Facades\Log;

/**
 * Authentication Controller
 *
 * All password hashing operations go through the centralized Python CodexHash API.
 *
 * Flow:
 * 1. User sends email + password
 * 2. Call CodexHash API (Python FastAPI) to hash/verify password
 * 3. Compare with stored hash from database
 * 4. If valid, create JWT token for session handling
 * 5. Return token to client
 *
 * Architecture:
 * Client → CodexAuth API (here) → CodexHash Python API (port 8001)
 */
class AuthController extends Controller
{
    protected CodexHashClient $hashClient;
    protected CodexTimeClient $codexTime;

    public function __construct()
    {
        $this->hashClient = new CodexHashClient();
        $this->codexTime = new CodexTimeClient();
    }

    /**
     * Login with email and password
     * Uses CodexHash API for password verification
     * Returns JWT token for session handling
     *
     * POST /api/auth/login
     * Body: { "email": "user@example.com", "password": "secret" }
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        try {
            // Find user in database
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ], 401);
            }

            // Get current TIU from CodexTime
            $currentTIU = $this->codexTime->getCurrentTIU();

            $storedHash = null;
            $salt = null;
            $storedTIU = null;
            $rounds = 16;

            // Check for modern Codex credential storage (JSON/Array in 'codex' column)
            if (!empty($user->codex) && is_array($user->codex)) {
                $record = $user->codex;
                $storedHash = $record['hash'] ?? null;
                $salt = $record['salt'] ?? null;
                $storedTIU = $record['tiu'] ?? null;
                $rounds = $record['rounds'] ?? 16;

                if (!$storedHash || !$salt || !$storedTIU) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Corrupted credential data.'
                    ], 500);
                }
            }
            // Fallback: Legacy pipe-separated format in 'password' column
            else {
                $hashParts = explode('|', $user->password ?? '');
                if (count($hashParts) !== 4) {
                    return response()->json([
                        'success' => false,
                        // This specific legacy error was blocking the user
                        'message' => 'CodexAuth has detected a legacy password. Please reset your password to ensure compatibility'
                    ], 500);
                }
                [$storedHash, $salt, $storedTIU, $rounds] = $hashParts;
            }

            // Verify with CodexHash API (Python FastAPI)
            $isValid = $this->hashClient->verifyPassword(
                password: $request->password,
                storedHash: $storedHash,
                salt: $salt,
                storedTIU: (float) $storedTIU,
                rounds: (int) $rounds
            );

            if (!$isValid) {
                Log::info('Login failed: invalid credentials', ['email' => $request->email]);
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ], 401);
            }

            Log::info('Login successful', ['email' => $request->email]);

            // Create JWT token for session handling
            $token = JWTAuth::fromUser($user);

            return response()->json([
                'success' => true,
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'first_name' => $user->first_name ?? '',
                    'last_name' => $user->last_name ?? '',
                ],
                'expires_in' => config('jwt.ttl') * 60, // TTL in seconds
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication failed',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Register new user
     * Uses CodexHash API to create secure password hash with TIU
     *
     * POST /api/auth/register
     * Body: { "email": "user@example.com", "password": "secret", "first_name": "John", "last_name": "Doe" }
     */
    public function register(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
        ]);

        try {
            // Get current TIU from CodexTime
            $currentTIU = $this->codexTime->getCurrentTIU();

            // Generate secure hash using CodexHash API (Python FastAPI)
            $hashResult = $this->hashClient->hashPassword(
                password: $request->password,
                deviceId: $request->email, // Use email as salt/deviceId for registration
                tiu: $currentTIU
            );

            // Store in modern codex format (JSON)
            $codexPacket = [
                'hash' => $hashResult['hash'],
                'salt' => $hashResult['salt'],
                'tiu' => $hashResult['tiu'],
                'rounds' => $hashResult['rounds'],
                'algorithm' => $hashResult['algorithm'] ?? 'sha3_512',
                'registered_at' => now()->toIso8601String(),
            ];

            // Insert user into database with codex field
            $user = User::create([
                'email' => $request->email,
                'password' => '', // Empty - using codex field instead
                'codex' => $codexPacket,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
            ]);

            Log::info('User registered successfully', ['email' => $request->email]);

            // Create JWT token
            $token = JWTAuth::fromUser($user);

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                ],
                'expires_in' => config('jwt.ttl') * 60, // TTL in seconds
            ], 201);
        } catch (\Exception $e) {
            Log::error('Registration failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get current authenticated user
     *
     * GET /api/auth/me
     * Headers: Authorization: Bearer {token}
     */
    public function me()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 401);
        }
    }

    /**
     * Logout user
     * Invalidates JWT token
     *
     * POST /api/auth/logout
     * Headers: Authorization: Bearer {token}
     */
    public function logout()
    {
        try {
            JWTAuth::parseToken()->invalidate();

            return response()->json([
                'success' => true,
                'message' => 'Successfully logged out'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Refresh JWT token
     *
     * POST /api/auth/refresh
     * Headers: Authorization: Bearer {token}
     */
    public function refresh()
    {
        try {
            $newToken = JWTAuth::parseToken()->refresh();

            return response()->json([
                'success' => true,
                'token' => $newToken,
                'expires_in' => config('jwt.ttl') * 60 // TTL in seconds
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token refresh failed',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 401);
        }
    }

    /**
     * Request password reset
     * Generates a reset token and sends email (or returns token in dev mode)
     *
     * POST /api/auth/request-reset
     * Body: { "email": "user@example.com" }
     */
    public function requestReset(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = strtolower(trim($request->email));

        try {
            // Check if user exists
            $user = User::where('email', $email)->first();

            if (!$user) {
                // Return success anyway to prevent email enumeration
                return response()->json([
                    'success' => true,
                    'message' => 'If an account exists with this email, a reset link will be sent.',
                ]);
            }

            // Generate secure reset token
            $token = bin2hex(random_bytes(32));
            $ttl = 30; // 30 minutes

            // Store token in cache
            $cacheKey = 'password_reset:' . $email;
            \Illuminate\Support\Facades\Cache::put($cacheKey, [
                'token' => hash('sha256', $token), // Store hashed token
                'email' => $email,
                'created_at' => now()->toIso8601String(),
            ], now()->addMinutes($ttl));

            Log::info('Password reset requested', ['email' => $email]);

            // In development mode, return the token directly
            if (config('app.debug')) {
                return response()->json([
                    'success' => true,
                    'message' => 'Reset token generated (dev mode)',
                    'token' => $token, // Only in dev mode
                    'expires_in_minutes' => $ttl,
                ]);
            }

            // In production, send email (implement mail service)
            // Mail::to($email)->send(new PasswordResetMail($token));

            return response()->json([
                'success' => true,
                'message' => 'If an account exists with this email, a reset link will be sent.',
            ]);
        } catch (\Exception $e) {
            Log::error('Password reset request failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to process reset request',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Reset password with token
     * Validates token and updates password using CodexHash
     *
     * POST /api/auth/reset-password
     * Body: { "email": "user@example.com", "token": "reset_token", "password": "new_password", "password_confirmation": "new_password" }
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $email = strtolower(trim($request->email));

        try {
            // Get stored token from cache
            $cacheKey = 'password_reset:' . $email;
            $stored = \Illuminate\Support\Facades\Cache::get($cacheKey);

            if (!$stored) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid or expired reset token'
                ], 400);
            }

            // Verify token (compare hashed versions)
            if (!hash_equals($stored['token'], hash('sha256', $request->token))) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid or expired reset token'
                ], 400);
            }

            // Find user
            $user = User::where('email', $email)->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            // Get current TIU from CodexTime
            $currentTIU = $this->codexTime->getCurrentTIU();

            // Generate new hash using CodexHash API (Python FastAPI)
            $hashResult = $this->hashClient->hashPassword(
                password: $request->password,
                deviceId: $email, // Use email as salt/deviceId for reset
                tiu: $currentTIU
            );

            // Store in modern codex format
            $codexPacket = [
                'hash' => $hashResult['hash'],
                'salt' => $hashResult['salt'],
                'tiu' => $hashResult['tiu'],
                'rounds' => $hashResult['rounds'],
                'algorithm' => $hashResult['algorithm'] ?? 'sha3_512',
                'updated_at' => now()->toIso8601String(),
            ];

            // Update user's password
            $user->update([
                'password' => '', // Clear legacy password field
                'codex' => $codexPacket,
            ]);

            // Remove used token
            \Illuminate\Support\Facades\Cache::forget($cacheKey);

            Log::info('Password reset successful', ['email' => $email]);

            return response()->json([
                'success' => true,
                'message' => 'Password has been reset successfully. You can now log in.'
            ]);
        } catch (\Exception $e) {
            Log::error('Password reset failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to reset password',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}
