<?php

namespace Web3Codex\CodexAuth\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use OTPHP\TOTP;

class CodexAuth2FAService
{
    protected string $issuer = 'Web3Connected'; // Change per project

    /**
     * Generate a new 2FA TOTP secret.
     *
     * @param string $userIdentifier
     * @return array An associative array with 'secret' and 'qr_code_url' keys
     */
    public function generate2FASecret(string $userIdentifier): array
    {
        $secret = Str::random(32); // 32 chars = good enough entropy
        $totp = TOTP::create($secret);
        $totp->setLabel($userIdentifier);
        $totp->setIssuer($this->issuer);

        $qrCodeUrl = $totp->getProvisioningUri();

        // 🔥 Cache this temporary until user confirms
        Cache::put("2fa:setup:{$userIdentifier}", $secret, now()->addMinutes(10));

        return [
            'secret' => $secret,
            'qr_code_url' => $qrCodeUrl,
        ];
    }

    /**
     * Verify a user submitted 2FA code.
     *
     * @param string $userIdentifier
     * @param string $code
     * @param string|null $knownSecret
     * @return bool
     */
    public function verify2FACode(string $userIdentifier, string $code, ?string $knownSecret = null): bool
    {
        $secret = $knownSecret ?? Cache::get("2fa:setup:{$userIdentifier}");

        if (!$secret) {
            return false;
        }

        $totp = TOTP::create($secret);

        return $totp->verify($code);
    }

    /**
     * Forget temp secret (after confirmed setup)
     *
     * @param string $userIdentifier
     * @return void
     */
    public function forgetSetupSecret(string $userIdentifier): void
    {
        Cache::forget("2fa:setup:{$userIdentifier}");
    }
}
