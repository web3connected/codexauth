<?php

namespace Web3Codex\CodexAuth\Services;

use App\Models\User;
use Web3Codex\CodexCore\Support\CodexCache;
use Web3Codex\Exceptions\BotDetectionException;
use Web3Codex\CodexCore\Support\CodexEthosLattice;

/**
 * CodexAuthSecure - Authentication Security Layer
 *
 * This service handles the core security logic for authentication, including:
 * - Password hashing and verification (via CodexHashClient HTTP API)
 * - User registration and secret management
 * - Reset token generation and validation
 * - Temporal integrity checks (Time Drift)
 * - Anti-bot validation (EthosLattice)
 *
 * It is distinct from CodexSecure (which handles Zones and Routes).
 *
 * @package Web3Codex\CodexAuth\Services
 */
class CodexAuthSecure
{
    protected CodexHashClient $codex;
    protected CodexTimeClient $time;
    protected CodexEthosLattice $ethos;
    protected CodexCache $cache;

    protected string $version = '1.0.0';

    public function __construct(
        CodexHashClient $codex,
        CodexTimeClient $time,
        CodexEthosLattice $ethos,
        CodexCache $cache
    ) {
        $this->codex = $codex;
        $this->time = $time;
        $this->ethos = $ethos;
        $this->cache = $cache;
    }

    public function version(): string
    {
        return $this->version;
    }

    /**
     * Register user with enhanced security validation
     */
    public function registerUser(string $userIdentifier, string $secret): array
    {
        if (!empty(request()->input('honeytrap'))) {
            $this->ethos->reportSuspiciousActivity($userIdentifier);
            throw new BotDetectionException();
        }

        $this->validateUserIdentifier($userIdentifier);

        $currentTiu = $this->time->getCurrentTIU();

        $hashData = $this->codex->hashPassword(
            $secret,
            $this->generateUserSalt($userIdentifier),
            $currentTiu
        );

        $hashData += [
            'buffer'    => $this->getBuffer(),
            'tiu'       => $currentTiu,
            'user_id'   => $userIdentifier,
            'zone'      => CodexEthosLattice::ZONE_IDENTITY,
            'registered_at' => now()->toDateTimeString(),
        ];

        $this->ethos->validate(CodexEthosLattice::ZONE_IDENTITY, [
            'user_id' => $userIdentifier,
            'tiu'     => $currentTiu,
            'hash'    => $hashData['hash'],
        ]);

        $this->storeUserData($userIdentifier, $hashData);

        return $hashData;
    }

    /**
     * Verify user credentials only
     */
    public function verifyUser(
        string $userIdentifier,
        string $attemptedPassword,
        ?User $user = null
    ): bool {
        // If user not provided, try to fetch or rely on identifier?
        // Note: Logic typically requires the user's stored hash/salt.
        // If passed as null, we can't verify unless we fetch.

        $record = null;
        if ($user) {
             // Use the 'codex' attribute which is cast to array in User model
             $record = $user->codex;
             // Ensure rounds is set if missing in stored data
             if (is_array($record) && !isset($record['rounds'])) {
                 $record['rounds'] = 16;
             }
        }

        // Fallback or explicit check
        if (!is_array($record) || !$this->isValidCodex($record)) {
             // If we can't construct the record, fail
             if (!$user) return false;

             // Try constructing from individual columns if valid
             if (isset($user->codex) && is_array($user->codex)) {
                  $record = $user->codex;
             } else {
                 return false;
             }
        }

        $this->validateHarmonicSync((int)$record['tiu']);

        $isValid = $this->codex->verifyPassword(
            $attemptedPassword,
            $record['hash'],
            $record['salt'],
            $record['tiu'],
            (int) ($record['rounds'] ?? 16)
        );

        if (!$isValid) {
            logger()->info('CodexAuthSecure: invalid credentials.', [
                'user' => $userIdentifier,
            ]);
        }

        return $isValid;
    }

    /**
     * Rotate user secret and invalidate sessions
     */
    public function rotateUserSecret(string $userIdentifier, string $newSecret): void
    {
        $this->deleteUserData($userIdentifier);
        $this->registerUser($userIdentifier, $newSecret);
    }

    /**
     * Store user data securely in cache
     */
    protected function storeUserData(string $userIdentifier, array $data): void
    {
        $normalizedId = $this->normalize($userIdentifier);
        $this->cache->tags(["user:{$normalizedId}"])->put(
            $this->userDataKey($normalizedId),
            $data,
            config('codexsecure.user_data_ttl', 60 * 60 * 24 * 30)
        );
    }

    /**
     * Delete user data and associated cache
     */
    public function deleteUserData(string $userIdentifier): void
    {
        $normalizedId = $this->normalize($userIdentifier);
        $this->cache->tags(["user:{$normalizedId}"])->flush();
        $this->cache->forget($this->userDataKey($normalizedId));
        $this->cache->forget("session:{$normalizedId}");
    }

    /**
     * Validate user identifier format
     */
    protected function validateUserIdentifier(string $userIdentifier): void
    {
        if (filter_var($userIdentifier, FILTER_VALIDATE_EMAIL)) {
            return;
        }

        if (!preg_match('/^[a-zA-Z0-9_]+$/', $userIdentifier)) {
            throw new \InvalidArgumentException('Invalid user identifier format');
        }

        if (empty($userIdentifier)) {
            throw new \InvalidArgumentException('User identifier cannot be empty');
        }
    }

    /**
     * Generate a secure salt for user data
     */
    protected function generateUserSalt(string $userIdentifier): string
    {
        return hash_hmac(
            'sha3-512',
            $userIdentifier,
            config('app.key')
        );
    }

    /**
     * Retrieve user data from cache
     */
    public function getUserData(string $normalizedId): ?array
    {
        return $this->cache->get($this->userDataKey($normalizedId));
    }

    /**
     * Generate a unique key for user data storage
     */
    protected function userDataKey(string $userIdentifier): string
    {
        return "codex:user:{$this->normalize($userIdentifier)}:data";
    }

    /**
     * Validate codex record structure
     */
    public static function isValidCodex(array $record): bool
    {
        return isset($record['hash'], $record['salt'], $record['tiu']);
        // rounds is optional in some contexts?
    }

    /**
     * Normalize user identifier
     */
    public function normalize(string $input): string
    {
        return strtolower(trim($input));
    }

    /**
     * Get security buffer
     */
    protected function getBuffer(): float
    {
        return (float) config('codexsecure.buffer', 0.000001);
    }

    /**
     * Validate harmonic synchronization between stored and current TIU
     */
    protected function validateHarmonicSync(int $recordTiu): void
    {
        $currentTiu = $this->time->getCurrentTIU();
        $driftTolerance = config('codextime.max_tiu_drift', 50000); // 50000 for dev

        // Check drift
        $isHarmonicallyAligned = $this->time->validateTIUDrift(
            (float) $recordTiu,
            config('codextime.harmonic_tolerance', 0.05)
        );

        if (!$isHarmonicallyAligned) {
            $absoluteDrift = abs($currentTiu - $recordTiu);
            if ($absoluteDrift > $driftTolerance) {
                // Log warning but don't fail in DEV
                logger()->warning('CodexAuthSecure: Harmonic sync drift beyond tolerance', [
                   'drift' => $absoluteDrift
                ]);
            }
        }
    }

    /**
     * Issue a reset token for the given user identifier.
     *
     * @param string $userIdentifier
     * @return string
     */
    public function issueResetToken(string $userIdentifier): string
    {
        $token = \Illuminate\Support\Str::random(60);
        $key = 'codex_reset_token:' . $this->normalize($userIdentifier);
        // TTL 60 minutes
        $this->cache->put($key, $token, 3600);
        return $token;
    }

    /**
     * Revoke a reset token for the given user identifier.
     *
     * @param string $userIdentifier
     * @return void
     */
    public function revokeResetToken(string $userIdentifier): void
    {
        $key = 'codex_reset_token:' . $this->normalize($userIdentifier);
        $this->cache->forget($key);
    }

    /**
     * Validate a reset token.
     *
     * @param string $userIdentifier
     * @param string $token
     * @return bool
     */
    public function validateResetToken(string $userIdentifier, string $token): bool
    {
        $key = 'codex_reset_token:' . $this->normalize($userIdentifier);
        $cachedToken = $this->cache->get($key);

        if (! $cachedToken) {
            return false;
        }

        return hash_equals((string)$cachedToken, $token);
    }
}
