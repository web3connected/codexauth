<?php

namespace Web3Codex\CodexAuth\Services;

/**
 * CodexSession provides secure session management with replay attack protection,
 * secure token issuance, and device context initialization.
 *
 * This class is designed
 * to handle user sessions securely, ensuring that session tokens
 * are issued and validated with context binding to prevent replay attacks.
 *
 * @version 1.0.0
 * @package Web3Codex\CodexAuth\Services
 */

use Web3Codex\CodexCore\Support\CodexCache;
use Web3Codex\CodexAuth\Services\CodexDevices;

class CodexSession
{
    protected CodexCache $cache;

    protected ?CodexDevices $devices;

    /**
     * @var CodexTimeClient|mixed|null
     */
    protected $time;

    public function __construct(
        CodexCache $cache,
        $time = null, // CodexTimeClient|mixed|null
        ?CodexDevices $devices = null
    ) {
        $this->cache = $cache;
        $this->time = $time ?? app(CodexTimeClient::class);
        $this->devices = $devices;
    }

    /**
     * Issue session token with replay attack protection
     */
    public function issueSessionToken(string $userIdentifier): string
    {
        $token = bin2hex(random_bytes(32));
        $key = "session:{$this->normalize($userIdentifier)}";

        $context = hash('sha256', request()->ip());
        $nonce = bin2hex(random_bytes(16));

        $this->cache->put($key, [
            'token'   => $this->hashToken($token),
            'context' => $context,
            'nonce'   => $nonce,
        ], config('session.lifetime', 60 * 60 * 24));

        return "{$token}|{$context}|{$nonce}";
    }

    /**
     * Validate session token with context binding
     */
    public function validateSessionToken(string $userIdentifier, string $compoundToken): bool
    {
        $parts = explode('|', $compoundToken, 3);
        if (count($parts) < 3) return false;

        [$token, $context, $nonce] = $parts;
        $key = "session:{$this->normalize($userIdentifier)}";
        $stored = $this->cache->get($key);

        return $stored &&
            hash_equals($stored['token'], $this->hashToken($token)) &&
            hash_equals($stored['context'], $context) &&
            hash_equals($stored['nonce'], $nonce);
    }

    /**
     * Secure token generation with rate limiting
     */
    public function issueResetToken(string $email, int $ttl = 30): string
    {
        if (!app()->environment('local')) {
            $this->validateResetTokenRateLimit($email);
        }

        $token = bin2hex(random_bytes(32));
        $key = $this->resetTokenKey($email);

        $this->cache->tags(["reset:user:{$email}"])->put(
            $key,
            $this->hashToken($token),
            $ttl * 60
        );

        return $token;
    }

    /**
     * Validate reset token for password recovery
     */
    public function validateResetToken(string $email, string $token): bool
    {
        $key = $this->resetTokenKey($email);
        $storedHash = $this->cache->get($key);

        return $storedHash && hash_equals($storedHash, $this->hashToken($token));
    }

    /**
     * Revoke reset token after successful password reset
     */
    public function revokeResetToken(string $email): void
    {
        $this->cache->forget($this->resetTokenKey($email));
    }

    /**
     * Initialize user session with device context
     */
    public function initializeUserSession(array $deviceContext = [], string $guard = 'web'): void
    {
        request()->session()->put('codex_secure', [
            'device_key' => $deviceContext['device_key'] ?? null,
            'auth_guard' => $guard,
            'tiu_anchor' => $this->time->getCurrentTIU()
        ]);
    }

    /**
     * Validate reset token request rate limit
     */
    protected function validateResetTokenRateLimit(string $email): void
    {
        $key = "reset:attempts:{$this->normalize($email)}";
        $attempts = (int) $this->cache->get($key, 0);

        if ($attempts >= config('codexsecure.reset_token_rate_limit', 5)) {
            logger()->warning('Reset token limit hit', [
                'email' => $email,
                'ip' => request()->ip()
            ]);
            throw new \RuntimeException('Reset token request limit exceeded');
        }

        $this->cache->put($key, $attempts + 1, now()->addHour()->timestamp);
    }

    /**
     * Generate a unique key for reset token storage
     */
    protected function resetTokenKey(string $email): string
    {
        return "reset:token:{$this->normalize($email)}";
    }

    /**
     * Hash the session token for secure storage
     */
    protected function hashToken(string $token): string
    {
        return hash('sha256', $token);
    }

    /**
     * Normalize user identifier
     */
    public function normalize(string $input): string
    {
        return strtolower(trim($input));
    }

    /**
     * Set devices service
     */
    public function setDevices(CodexDevices $devices): void
    {
        $this->devices = $devices;
    }

    /**
     * Get devices service
     */
    public function getDevices(): ?CodexDevices
    {
        return $this->devices;
    }
}
