Prompt:

Build a Laravel-based authentication service called CodexAuth that is token-format agnostic but enforces Codex security policies on every issued credential.

Core Requirements:

CodexAuth Core Layer

Handles zone binding, TIU time-locks, CodexHash context binding, and trust scoring.

Issues and validates tokens by delegating to a configurable TokenDriver interface.

All validation must enforce Codex claims, not just token signature validity.

TokenDriver Interface

php
Copy
Edit
interface TokenDriver {
    public function issue(array $claims): string;
    public function validate(string $token): array; // returns claims
    public function supportsFormat(string $format): bool;
}
Format-agnostic: drivers can be JWT, PASETO, macaroons, or blockchain signatures.

JWT Driver Implementation

First driver should use lcobucci/jwt or firebase/php-jwt.

Must support RS256 or ES256 signing.

Claims must include:

zone (string, CodexMCP Zone ID)

tiu (int, CodexTime TIU expiration)

ctx (string, CodexHash device/env binding)

trust (int, current trust score)

Driver Registration

Register drivers in a Laravel service provider.

Load default driver from .env:

ini
Copy
Edit
CODEXAUTH_TOKEN_DRIVER=jwt
Allow swapping drivers without changing business logic.

API Endpoints

POST /auth/issue → issues a token after successful login (wallet, password, CodexIdentity proof).

POST /auth/validate → validates token and returns claims if valid. Must fail if Codex claims don’t pass policy.

Security Enforcement

Reject tokens if:

Zone doesn’t match current service zone.

TIU has expired.

ctx hash doesn’t match device/env.

Trust score is below policy threshold.

Support short TTL + rolling refresh via refresh token endpoint.

NPM SDK

Build a small JS/React SDK that wraps /auth/issue and /auth/validate.

Must be format-agnostic; reads token format from API metadata.

Goal:
The output should be a Laravel service that can issue JWT today but can swap in PASETO or another signing format tomorrow without rewriting the core Codex logic. All tokens must be unusable without CodexAuth’s context validation.

