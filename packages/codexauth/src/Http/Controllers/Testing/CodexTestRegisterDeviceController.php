<?php

namespace Web3Codex\CodexAuth\Http\Controllers\Test;

/**
 * CodexTestRegisterDeviceController
 *
 * Test version of RegisterDeviceController for testing device registration.
 * Handles device registration and management for testing purposes.
 */

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Validator;
use Web3Codex\CodexAuth\Services\CodexDevices;

class CodexTestRegisterDeviceController extends Controller
{
    protected CodexDevices $devices;

    public function __construct(CodexDevices $devices)
    {
        $this->devices = $devices;
    }

    /**
     * Register a new device for testing.
     */
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'device_name' => 'required|string|max:255',
            'device_type' => 'required|string|in:web,mobile,desktop',
            'user_agent' => 'nullable|string',
            'ip_address' => 'nullable|ip',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'testing_mode' => true
            ], 422);
        }

        $deviceData = [
            'device_name' => $request->input('device_name'),
            'device_type' => $request->input('device_type'),
            'user_agent' => $request->input('user_agent', $request->header('User-Agent')),
            'ip_address' => $request->input('ip_address', $request->ip()),
            'testing_mode' => true
        ];

        try {
            // TODO: Check CodexDevices service methods
            // $device = $this->devices->registerDevice($deviceData);
            $device = [
                'device_id' => 'test-device-' . time(),
                'device_name' => $deviceData['device_name'],
                'device_type' => $deviceData['device_type'],
                'registered_at' => now(),
                'testing_mode' => true
            ];

            return response()->json([
                'success' => true,
                'message' => 'Test device registered successfully',
                'device' => $device,
                'testing_mode' => true,
                'controller' => 'CodexTestRegisterDeviceController'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Test device registration failed: ' . $e->getMessage(),
                'testing_mode' => true
            ], 500);
        }
    }

    /**
     * Get device information for testing.
     */
    public function getDevice(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'device_id' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'testing_mode' => true
            ], 422);
        }

        try {
            // TODO: Check CodexDevices service methods
            // $device = $this->devices->getDevice($request->input('device_id'));
            $device = [
                'device_id' => $request->input('device_id'),
                'device_name' => 'Test Device',
                'device_type' => 'web',
                'registered_at' => now(),
                'testing_mode' => true
            ];

            if (!$device) {
                return response()->json([
                    'success' => false,
                    'message' => 'Test device not found',
                    'testing_mode' => true
                ], 404);
            }

            return response()->json([
                'success' => true,
                'device' => $device,
                'testing_mode' => true,
                'controller' => 'CodexTestRegisterDeviceController'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving test device: ' . $e->getMessage(),
                'testing_mode' => true
            ], 500);
        }
    }

    /**
     * List all registered devices for testing.
     */
    public function listDevices(Request $request): JsonResponse
    {
        try {
            // TODO: Check CodexDevices service methods
            // $devices = $this->devices->listDevices();
            $devices = [
                [
                    'device_id' => 'test-device-1',
                    'device_name' => 'Test Device 1',
                    'device_type' => 'web',
                    'registered_at' => now(),
                    'testing_mode' => true
                ],
                [
                    'device_id' => 'test-device-2',
                    'device_name' => 'Test Device 2',
                    'device_type' => 'mobile',
                    'registered_at' => now(),
                    'testing_mode' => true
                ]
            ];

            return response()->json([
                'success' => true,
                'devices' => $devices,
                'testing_mode' => true,
                'controller' => 'CodexTestRegisterDeviceController'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error listing test devices: ' . $e->getMessage(),
                'testing_mode' => true
            ], 500);
        }
    }

    /**
     * Unregister a device for testing.
     */
    public function unregister(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'device_id' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'testing_mode' => true
            ], 422);
        }

        try {
            // TODO: Check CodexDevices service methods
            // $result = $this->devices->unregisterDevice($request->input('device_id'));
            $result = [
                'device_id' => $request->input('device_id'),
                'unregistered_at' => now(),
                'testing_mode' => true
            ];

            return response()->json([
                'success' => true,
                'message' => 'Test device unregistered successfully',
                'result' => $result,
                'testing_mode' => true,
                'controller' => 'CodexTestRegisterDeviceController'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error unregistering test device: ' . $e->getMessage(),
                'testing_mode' => true
            ], 500);
        }
    }
}
