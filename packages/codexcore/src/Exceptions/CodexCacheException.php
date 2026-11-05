<?php

namespace Web3Codex\CodexCore\Exceptions;

use Exception;
use Throwable;

class CodexCacheException extends Exception
{
    protected array $context = [];

    public function __construct(string $message = '', int $code = 0, ?Throwable $previous = null, array $context = [])
    {
        parent::__construct($message, $code, $previous);
        $this->context = $context;
    }

    public static function connectionError(string $message, array $config = [], ?Throwable $previous = null): self
    {
        return new self(
            "Cache connection error: {$message}",
            500,
            $previous,
            ['config' => $config]
        );
    }

    public static function operationError(string $operation, string $key, string $message, ?Throwable $previous = null): self
    {
        return new self(
            "Cache operation '{$operation}' failed for key '{$key}': {$message}",
            500,
            $previous,
            ['operation' => $operation, 'key' => $key]
        );
    }

    public static function serializationError(string $key, string $message, ?Throwable $previous = null): self
    {
        return new self(
            "Cache serialization error for key '{$key}': {$message}",
            500,
            $previous,
            ['key' => $key]
        );
    }

    public static function lockError(string $lockName, string $message, ?Throwable $previous = null): self
    {
        return new self(
            "Lock error for '{$lockName}': {$message}",
            500,
            $previous,
            ['lock_name' => $lockName]
        );
    }

    public function getContext(): array
    {
        return $this->context;
    }
}
