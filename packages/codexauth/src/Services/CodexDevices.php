<?php

namespace Web3Codex\CodexAuth\Services;

/**
 * CodexDevices - A secure device management service for Codex users
 *
 * This service provides methods for registering, verifying, and managing devices
 * with enhanced security features including device fingerprinting, time integrity checks,
 * and secure data storage.
 *
 * @version 1.0.0
 * @package Web3Codex\CodexAuth\Services
 */

use Jenssegers\Agent\Agent;
use Web3Codex\CodexCore\Support\CodexCache;
use Web3Codex\CodexCore\Support\CodexEthosLattice;
use Web3Codex\CodexSecure\Services\CodexSecureCore;

class CodexDevices extends CodexSecureCore
{
    /**
     * @var CodexHashClient|mixed|null
     */
    protected $codex;
    /**
     * @var CodexTimeClient|mixed|null
     */
    protected $time;
    protected Agent $agent;

    public const int MAX_DEVICES = 3; // Maximum number of devices allowed per user

    public function __construct(
        $codex = null, // CodexHashClient|mixed|null
        $time = null,  // CodexTimeClient|mixed|null
        ?CodexEthosLattice $ethos = null,
        ?CodexCache $cache = null,
        ?Agent $agent = null
    ) {
        parent::__construct($codex, $time, $ethos, $cache);
        $this->codex = $codex;
        $this->time = $time;
        $this->agent = $agent ?? new Agent();
    }

    /**
     * Register a device with enhanced security validation
     */
    public function registerDevice(string $deviceUID, string $secret): array
    {
        $this->validateDeviceUID($deviceUID);


        $currentTiu = $this->time->getCurrentTIU();
        $hashData = $this->codex->hashPassword(
            $secret,
            $this->generateDeviceSalt($deviceUID),
            $currentTiu
        );

        $hashData += [
            'buffer' => $this->getBuffer(),
            'tiu' => $currentTiu,
            'device_uid' => $deviceUID,
            'zone' => CodexEthosLattice::ZONE_IDENTITY,
            'registered_at' => now()->toDateTimeString(),
        ];

        $this->ethos()->validate(CodexEthosLattice::ZONE_IDENTITY, [
            'device_uid' => $deviceUID,
            'tiu' => $currentTiu,
            'hash' => $hashData['hash'],
        ]);

        $this->storeDeviceData($deviceUID, $hashData);

        return $hashData;
    }

    /**
     * Verify device credentials with enhanced validation
     */
    public function verifyDevice(
        string $deviceUID,
        string $attemptedSecret,
        ?float $overrideBuffer = null,
        ?bool $overrideStrict = null,
        bool $validateTiuDrift = true,
        float $maxAllowedDrift = 0.05
    ): bool {
        $deviceKey = $this->buildDeviceKey($deviceUID);
        $record = $this->getDeviceData($deviceKey);

        if (!$record) {
            return false;
        }

        $storedTiu = (float) $record['tiu'];
        $currentTiu = $this->time->getCurrentTIU();
        if ($validateTiuDrift && !$this->time->validateTIUDrift($storedTiu, $maxAllowedDrift)) {
            return false;
        }
        $this->ethos()->validate(CodexEthosLattice::ZONE_IDENTITY, [
            'device_uid' => $deviceUID,
            'attempt' => $attemptedSecret,
            'stored_tiu' => $storedTiu,
            'current_tiu' => $currentTiu,
        ]);
        return $this->codex->verifyPassword(
            $attemptedSecret,
            $record['hash'],
            $record['salt'],
            $storedTiu,
            (int) $record['rounds']
        );
    }

    // ...existing code...
    // [Rest of the methods remain the same - including all the device management functionality]

    /**
     * Generate a secure device fingerprint ID
     */
    public function generateDeviceID(string $extraEntropy = ''): string
    {
        $this->agent->setUserAgent(request()->header('User-Agent') ?? 'unknown');

        $fingerprint = $this->buildFingerprintString($extraEntropy);
        $hash = $this->codex()->hash($fingerprint)['hash'];

        return 'did:' . substr($hash, 0, 24); // Increased to 24 chars for better uniqueness
    }

    /**
     * Check if device is registered and valid
     */
    public function isTrustedDevice(string $deviceUID): bool
    {
        return $this->cache()->has(
            $this->deviceDataKey($this->buildDeviceKey($deviceUID))
        );
    }

    /**
     * Initialize device context with enhanced security
     */
    public function initializeDevice(?string $agentString = null, bool $forceFresh = false): array
    {
        $agentString ??= request()->header('User-Agent', 'unknown');
        $deviceID = $this->normalize($agentString);
        $deviceKey = $this->buildDeviceKey($deviceID, $agentString);

        if ($forceFresh || !$this->cache()->has("device:meta:{$deviceKey}")) {
            $this->agent->setUserAgent($agentString);
            $deviceInfo = $this->buildDeviceInfo();

            $this->cache()->put(
                "device:meta:{$deviceKey}",
                $deviceInfo,
                config('codexsecure.device_meta_ttl', 60 * 60 * 24 * 30)
            );
        }

        return [
            'device_id' => $deviceID,
            'device_key' => $deviceKey,
            'device_info' => $this->getDeviceInfo($deviceKey),
            'registered' => $this->isTrustedDevice($deviceID),
            'trust_score' => $this->calculateTrustScore($deviceKey),
        ];
    }

    // ...existing code... [All remaining methods from the original file]

    protected function buildDeviceKey(string $deviceUID, ?string $agentString = null): string
    {
        $agentString = $agentString ?? request()->header('User-Agent', 'unknown');
        $agentHash = $this->fingerprintAgent($agentString);

        return $this->normalize($deviceUID) . ':' . $agentHash;
    }

    protected function fingerprintAgent(string $agentString): string
    {
        $normalized = $this->normalize($agentString);
        return substr(hash('sha256', $normalized), 0, 16);
    }

    protected function storeDeviceData(string $deviceUID, array $data): void
    {
        $this->cache()->tags(["device:{$deviceUID}"])->put(
            $this->deviceDataKey($this->buildDeviceKey($deviceUID)),
            $data,
            config('codexsecure.device_data_ttl', 60 * 60 * 24 * 30)
        );
    }

    protected function getDeviceData(string $deviceKey): ?array
    {
        return $this->cache()->get($this->deviceDataKey($deviceKey));
    }

    protected function deviceDataKey(string $deviceKey): string
    {
        return "device:data:{$deviceKey}";
    }

    protected function generateDeviceSalt(string $deviceUID): string
    {
        return hash_hmac('sha3-512', $deviceUID, config('app.key'));
    }

    protected function validateDeviceUID(string $deviceUID): void
    {
        if (empty($deviceUID)) {
            throw new \InvalidArgumentException('Device UID cannot be empty');
        }

        if (!preg_match('/^[a-zA-Z0-9\-_]{6,64}$/', $deviceUID)) {
            throw new \InvalidArgumentException('Invalid device UID format');
        }
    }

    protected function buildFingerprintString(string $extraEntropy): string
    {
        $this->agent->setUserAgent(request()->header('User-Agent') ?? 'unknown');

        return implode('|', [
            $this->normalize($this->agent->browser() ?? 'unknown'),
            $this->normalize($this->agent->version($this->agent->browser()) ?? 'unknown'),
            $this->normalize($this->agent->platform() ?? 'unknown'),
            $this->normalize($this->agent->device() ?? 'unknown'),
            $this->normalize(request()->header('Accept-Language', 'unknown')),
            $this->normalizeIp(request()->ip()),
            $extraEntropy,
        ]);
    }

    protected function buildDeviceInfo(): array
    {
        return [
            'browser' => $this->agent->browser() ?? 'Unknown',
            'platform' => $this->agent->platform() ?? 'Unknown',
            'device' => $this->agent->device() ?: 'Unknown',
            'is_robot' => $this->agent->isRobot(),
            'languages' => $this->agent->languages(),
            'fingerprint' => $this->buildFingerprintString(''),
            'detected_at' => $this->time()->now()->toDateTimeString(),
        ];
    }

    protected function getDeviceInfo(string $deviceKey): array
    {
        return $this->cache()->get("device:meta:{$deviceKey}", $this->buildDeviceInfo());
    }

    protected function calculateTrustScore(string $deviceKey): float
    {
        $info = $this->getDeviceInfo($deviceKey);
        $score = 0.0;

        // Basic scoring based on device characteristics
        if (!$info['is_robot']) $score += 0.3;
        if (in_array($info['device'], ['Desktop', 'Mobile'])) $score += 0.2;
        if (count($info['languages']) > 0) $score += 0.1;

        // Additional points if device is registered
        if ($this->isTrustedDevice(explode(':', $deviceKey)[0])) {
            $score += 0.4;
        }

        return min(1.0, max(0.0, $score));
    }

    protected function normalize(string $string): string
    {
        return strtolower(trim(preg_replace('/[^a-zA-Z0-9\-_]/', '', $string)));
    }

    protected function normalizeIp(?string $ip): string
    {
        return $ip ? hash('sha256', $ip) : 'unknown';
    }

    public function getDeviceUID(): string
    {
        $agentString = request()->header('User-Agent', 'unknown');
        return $this->normalize($agentString);
    }

    public function getDeviceStatusForUser(int $userId, string $deviceUID): string
    {
        $key = "codex:user:{$this->normalize((string)$userId)}:devices";
        $registeredDevices = $this->cache()->get($key, []);

        if (!in_array($deviceUID, $registeredDevices, true)) {
            return 'unregistered';
        }

        $deviceKey = $this->buildDeviceKey($deviceUID);
        $deviceData = $this->getDeviceData($deviceKey);

        if (!$deviceData) return 'missing';

        $registeredAt = $deviceData['registered_at'] ?? null;
        $expiresAt = $deviceData['expires_at'] ?? null;

        if ($expiresAt && now()->greaterThan($expiresAt)) {
            return 'expired';
        }

        return 'active';
    }

    // Additional methods from original file would be included here...
    // [Binding, unbinding, cleanup methods, etc.]
}
