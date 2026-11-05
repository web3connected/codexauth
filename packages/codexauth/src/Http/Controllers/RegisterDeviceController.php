<?php

namespace Web3Codex\CodexAuth\Http\Controllers;

/**
 * AI: Check aiPrompt.md in projects root directory - For More Details
 *
 * RegisterDeviceController - Device Registration Controller (LIVE VERSION)
 *
 * This controller handles device registration and management for the Codex Admin system.
 * Essential part of the secure authentication flow.
 *
 * PURPOSE: Device registration and trust management.
 * DESIGN: Secure device validation and registration.
 * INTEGRATION: Works with CodexDevices service and auth flow.
 *
 * DEVELOPMENT NOTE:
 * - This is a LIVE controller used in production
 * - Part of the secure authentication ecosystem
 * - Test versions available in /test/ folder for experimentation
 * - Critical for device-based security validation
 *
 * @package CodexAuth
 * @author  Web3Connected
 * @version 1.0.0
 * @license MIT
 */

use Illuminate\Http\Request;
use Web3Codex\CodexAuth\Services\CodexDevices;
use Illuminate\Routing\Controller;

class RegisterDeviceController extends Controller
{
    protected CodexDevices $devices;

    public function __construct(CodexDevices $devices)
    {
        $this->devices = $devices;
    }

    public function index(Request $request)
    {
        if ($this->devices->isTrustedDevice($this->devices->generateDeviceID())) {
            return redirect()->route('admin.dashboard');
        }

        return view('codex.register_device', [
            'deviceUID' => $this->devices->generateDeviceID(),
            'maxDevices' => CodexDevices::MAX_DEVICES,
        ]);
    }
}
