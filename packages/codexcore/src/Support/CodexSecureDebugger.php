<?php

namespace Web3Codex\CodexCore\Support;

/*
 * CodexSecureDebugger
 *
 * This class provides debugging utilities for the CodexSecure system,
 * allowing developers to inspect device and session information.
 *
 * @version 1.0.0
 * @package App\Support
 */

use App\Facades\CodexSecure;
use Illuminate\Support\Facades\Cache;

class CodexSecureDebugger
{
    /**
     * Dump basic CodexSecure device/session information.
     *
     * @param string $deviceUID
     * @return array
     */
    public static function debugDevice(string $deviceUID): array
    {
        $device = Cache::get("device:{$deviceUID}");
        $session = Cache::get("session:{$deviceUID}");
        $resetToken = Cache::get("codex:reset_token:{$deviceUID}");

        return [
            'device_registered' => $device ? true : false,
            'device_info' => $device ?? null,
            'session_active' => $session ? true : false,
            'session_token' => $session ?? null,
            'reset_token_exists' => $resetToken ? true : false,
            'reset_token_value' => $resetToken ?? null,
            'current_tiu' => CodexSecure::getTIU(),
            'cached_tiu' => Cache::get('codex:tiu_sync'),
        ];
    }
}
