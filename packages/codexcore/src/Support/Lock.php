<?php

namespace Web3Codex\CodexCore\Support;

use Predis\Client;
use Web3Codex\CodexCore\Exceptions\CodexCacheException;

class Lock
{
    private Client $redis;
    private string $name;
    private int $seconds;
    private string $ownerId;
    private int $attempts = 0;

    public function __construct(Client $redis, string $name, int $seconds = 10)
    {
        $this->redis = $redis;
        $this->name = "lock:$name";
        $this->seconds = $seconds;
        $this->ownerId = uniqid('', true);
    }

    public function acquire(): bool
    {
        $this->attempts++;

        try {
            $result = $this->redis->set(
                $this->name,
                $this->ownerId,
                'NX',
                'EX',
                $this->seconds
            );

            if ($result) {
                $this->redis->hmset("lockmeta:{$this->name}", [
                    'acquired_at' => microtime(true),
                    'owner_id' => $this->ownerId
                ]);
                return true;
            }

            return $this->isOwnedByCurrentProcess();
        } catch (\Throwable $e) {
            throw CodexCacheException::lockError($this->name, 'Failed to acquire lock', $e);
        }
    }

    public function release(): bool
    {
        $lua = <<<'LUA'
        if redis.call("GET", KEYS[1]) == ARGV[1] then
            redis.call("DEL", KEYS[1])
            redis.call("HDEL", KEYS[2], "acquired_at", "released_at", "owner_id")
            return 1
        else
            return 0
        end
        LUA;

        try {
            $result = $this->redis->eval(
                $lua,
                2,
                $this->name,
                "lockmeta:{$this->name}",
                $this->ownerId
            );

            if ($result) {
                $this->redis->hset("lockmeta:{$this->name}", 'released_at', microtime(true));
                return true;
            }

            return false;
        } catch (\Throwable $e) {
            throw CodexCacheException::lockError($this->name, 'Failed to release lock', $e);
        }
    }

    public function block(int $timeout, callable $callback)
    {
        $start = microtime(true);
        $acquired = false;

        while (!($acquired = $this->acquire())) {
            $elapsed = microtime(true) - $start;

            if ($elapsed >= $timeout) {
                throw CodexCacheException::lockError($this->name, 'Lock acquisition timed out', null);
            }

            usleep(min(250000, ($timeout - $elapsed) * 1000000));
        }

        try {
            return $callback();
        } finally {
            if ($acquired && !$this->release()) {
                throw CodexCacheException::lockError($this->name, 'Failed to release lock after callback', null);
            }
        }
    }

    public function getAcquisitionAttempts(): int
    {
        return $this->attempts;
    }

    public function getState(): string
    {
        try {
            if (!$this->redis->exists($this->name)) {
                return 'unlocked';
            }

            $owner = $this->redis->get($this->name);
            $meta = $this->redis->hgetall("lockmeta:{$this->name}");

            if ($owner === $this->ownerId) {
                return 'owned';
            }

            return $owner ? 'locked' : 'unlocked';
        } catch (\Throwable $e) {
            return 'error';
        }
    }

    public function isOwnedByCurrentProcess(): bool
    {
        try {
            return $this->redis->get($this->name) === $this->ownerId;
        } catch (\Throwable $e) {
            return false;
        }
    }

    public function getRemainingTTL(): ?int
    {
        try {
            $ttl = $this->redis->ttl($this->name);
            return $ttl >= 0 ? $ttl : null;
        } catch (\Throwable $e) {
            return null;
        }
    }

    public function renew(?int $seconds = null): bool
    {
        $lua = <<<'LUA'
        if redis.call("GET", KEYS[1]) == ARGV[1] then
            return redis.call("EXPIRE", KEYS[1], ARGV[2])
        else
            return 0
        end
        LUA;

        try {
            $result = $this->redis->eval(
                $lua,
                1,
                $this->name,
                $this->ownerId,
                $seconds ?? $this->seconds
            );

            if (!$result) {
                throw CodexCacheException::lockError($this->name, 'Failed to renew lock');
            }

            return true;
        } catch (\Throwable $e) {
            throw CodexCacheException::lockError($this->name, 'Error during lock renewal', $e);
        }
    }
}
