<?php

namespace Web3Codex\CodexAuth\Services;

/**
 * CodexAuth - Orchestrator
 * This service orchestrates authentication processes for the Codex Admin system,
 * handling login, logout, session management, and device registration.
 *
 * @version 1.0.12
 * @package Web3Codex\CodexAuth\Services
 */

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Web3Codex\CodexAuth\Services\CodexAuthSecure;
use Web3Codex\CodexAuth\Services\CodexSession;
use Web3Codex\CodexAuth\Services\CodexDevices;

class CodexAuthOrchestrator
{
    protected CodexAuthSecure $secure;
    protected CodexSession $session;
    protected CodexDevices $devices;

    protected $version = '1.0.12';

    public function __construct(
        CodexAuthSecure $secure,
        CodexSession $session,
        CodexDevices $devices
    ) {
        $this->secure = $secure;
        $this->session = $session;
        $this->devices = $devices;
    }

    public function isLoggedIn(): bool
    {
        return Auth::guard('admin')->check();
    }

    public function getUser(): ?Admin
    {
        $adminId = Auth::guard('admin')->id();
        return $adminId ? Admin::find($adminId) : null;
    }

    public function logout(): void
    {
        Auth::guard('admin')->logout();
        session()->invalidate();
        session()->regenerateToken();
    }

    public function getSessionToken(): ?string
    {
        return session('codex_token');
    }

    public function handleLoginSuccess(
        Request $request,
        Admin $user,
        string $sessionToken,
        array $deviceContext
    ): JsonResponse|RedirectResponse {
        $responseData = [
            'success' => true,
            'status' => 'success',
            'message' => 'Login successful',
            'token' => $sessionToken,
            'user' => $user->only(['id', 'email', 'first_name', 'last_name']),
            'version' => $this->version,
            'device_context' => [
                'device_id' => $deviceContext['device_id'],
                'trust_score' => $deviceContext['trust_score'],
                'registered' => $deviceContext['registered'],
            ],
        ];

        $this->logLogin($user, $deviceContext, $request);

        return $request->wantsJson()
            ? response()->json($responseData)
            : redirect()->route('admin.dashboard')
            ->with('success', true)
            ->with('message', 'Login successful')
            ->with('version', $this->version)
            ->with('device_context', $deviceContext);
    }

    public function handleLoginFailure(
        Request $request,
        string $reason,
        array $deviceContext = []
    ): JsonResponse|RedirectResponse {
        if ($reason === 'untrusted_device') {
            return $this->redirectToDeviceRegistration($request, $deviceContext);
        }

        if(config('app.debug')) {
            logger()->warning('Codex login failed', [
                'email' => $request->input('email'),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'reason' => $reason,
            ]);
        }

        session()->flash('error', $reason);

        return $request->wantsJson()
            ? response()->json([
                'success' => false,
                'message' => $reason
            ], 401)
            : back()->withErrors(['email' => $reason]);
    }

    public function redirectToDeviceRegistration(Request $request, array $deviceContext)
    {
        session()->put('url.intended', url()->current());
        session()->put('device_registration_context', $deviceContext);

        $message = 'Device registration required for secure access.';

        return $request->wantsJson()
            ? response()->json([
                'success' => false,
                'status' => 'device_registration_required',
                'message' => $message,
                'version' => $this->version,
                'redirect_url' => route('admin.device.register'),
                'device_context' => $deviceContext,
            ], 403)
            : redirect()->route('admin.device.register')
            ->with('info', $message)
            ->with('device_context', $deviceContext);
    }

    protected function logLogin(Admin $user, array $deviceContext, Request $request): void
    {
        if(!config('app.debug')) {
            logger()->info('Codex login successful', [
                'ip' => $request->ip(),
                'user_id' => $user->id,
                'email' => $user->email,
                'device_id' => $deviceContext['device_id'],
                'trust_score' => $deviceContext['trust_score'],
                'user_agent' => $request->userAgent(),
                'version' => $this->version,
            ]);
        }

    }
}
