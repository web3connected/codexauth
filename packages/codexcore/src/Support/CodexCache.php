<?php

namespace Web3Codex\CodexCore\Support;

/**
 * CodexCache - A robust Redis cache implementation for the Codex ecosystem
 *
 * This class provides a comprehensive caching solution using Redis,
 * with support for serialization, tagging, and locking mechanisms.
 *
 * @version 1.0.4
 * @package App\Support
 */

use Predis\Client;
use Predis\Pipeline\Pipeline;
use Web3Codex\CodexCore\Exceptions\CodexCacheException;

/**
 * Robust Redis cache implementation for Codex ecosystem
 */
class CodexCache
{
    private Client $redis;
    private string $prefix;
    private bool $isConnected = false;
    private array $config;

    public function __construct(array|null $config)
    {
        $this->config = array_merge([
            'scheme' => 'tcp',
            'host' => env('CODEX_REDIS_HOST', 'codex-admin-redis'),
            'port' => 6379,
            'prefix' => 'codex',
            'timeout' => 5,
            'retry_interval' => 100,
            'read_write_timeout' => 5,
            'persistent' => true,
            'serializer' => extension_loaded('igbinary') ? 'igbinary' : 'json',
            'compression' => 'none',
        ], $config ?? []);

        $this->prefix = rtrim($this->config['prefix'], ':') . ':';
        $this->connect();
    }

    private function connect(): void
    {
        try {
            $this->redis = new Client([
                'scheme' => $this->config['scheme'],
                'host' => env('CODEX_REDIS_HOST', 'codex-admin-redis'),
                'port' => $this->config['port'],
                'timeout' => $this->config['timeout'],
                'read_write_timeout' => $this->config['read_write_timeout'],
                'persistent' => $this->config['persistent'],
                'retry_interval' => $this->config['retry_interval'],
            ]);

            $this->redis->ping();
            $this->isConnected = true;
        } catch (\Throwable $e) {
            $this->isConnected = false;
            throw CodexCacheException::connectionError($e->getMessage(), $this->config, $e);
        }
    }

    private function ensureConnection(): void
    {
        if (!$this->isConnected) {
            $this->connect();
        }
    }

    private function key(string $key): string
    {
        return $this->prefix . preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', $key);
    }

    private function serialize($value): string
    {
        try {
            return match ($this->config['serializer']) {
                'igbinary' => extension_loaded('igbinary') && function_exists('igbinary_serialize')
                    ? \igbinary_serialize($value)
                    : throw new \RuntimeException('igbinary extension is not installed.'),
                'php' => serialize($value),
                default => json_encode($value, JSON_THROW_ON_ERROR),
            };
        } catch (\Throwable $e) {
            throw CodexCacheException::serializationError($e->getMessage(), $value, $e);
        }
    }

    private function unserialize(string $value)
    {
        try {
            return match ($this->config['serializer']) {
                'igbinary' => function_exists('igbinary_unserialize')
                    ? igbinary_unserialize($value)
                    : throw new \RuntimeException('igbinary extension is not installed.'),
                'php' => unserialize($value),
                default => json_decode($value, true, 512, JSON_THROW_ON_ERROR),
            };
        } catch (\Throwable $e) {
            throw CodexCacheException::serializationError($e->getMessage(), $value, $e);
        }
    }

    public function put(string $key, $value, ?int $ttl = null): bool
    {
        $this->ensureConnection();

        try {
            $serialized = $this->serialize($value);
            $prefixedKey = $this->key($key);

            if ($ttl) {
                return $this->redis->setex($prefixedKey, $ttl, $serialized) === true;
            }
            return $this->redis->set($prefixedKey, $serialized) === true;
        } catch (\Throwable $e) {
            throw CodexCacheException::operationError('put', $key, $e->getMessage(), $e);
        }
    }

    public function get(string $key, $default = null)
    {
        $this->ensureConnection();

        try {
            $value = $this->redis->get($this->key($key));
            return $value !== null ? $this->unserialize($value) : $default;
        } catch (\Throwable $e) {
            throw CodexCacheException::operationError('get', $key, $e->getMessage(), $e);
        }
    }

    public function remember(string $key, int $ttl, callable $callback)
    {
        try {
            if ($value = $this->get($key)) {
                return $value;
            }

            $value = $callback();
            $this->put($key, $value, $ttl);
            return $value;
        } catch (\Throwable $e) {
            throw CodexCacheException::operationError('remember', $key, $e->getMessage(), $e);
        }
    }

    public function forget(string $key): bool
    {
        $this->ensureConnection();

        try {
            return $this->redis->del([$this->key($key)]) > 0;
        } catch (\Throwable $e) {
            throw CodexCacheException::operationError('forget', $key, $e->getMessage(), $e);
        }
    }

    public function has(string $key): bool
    {
        $this->ensureConnection();

        try {
            return $this->redis->exists($this->key($key)) > 0;
        } catch (\Throwable $e) {
            throw CodexCacheException::operationError('has', $key, $e->getMessage(), $e);
        }
    }

    public function increment(string $key, int $by = 1): int
    {
        $this->ensureConnection();

        try {
            return $this->redis->incrby($this->key($key), $by);
        } catch (\Throwable $e) {
            throw CodexCacheException::operationError('increment', $key, $e->getMessage(), $e);
        }
    }

    public function decrement(string $key, int $by = 1): int
    {
        $this->ensureConnection();

        try {
            return $this->redis->decrby($this->key($key), $by);
        } catch (\Throwable $e) {
            throw CodexCacheException::operationError('decrement', $key, $e->getMessage(), $e);
        }
    }

    public function pipeline(callable $operations): array
    {
        $this->ensureConnection();

        try {
            return $this->redis->pipeline(function (Pipeline $pipe) use ($operations) {
                return $operations($pipe);
            });
        } catch (\Throwable $e) {
            throw CodexCacheException::operationError('pipeline', 'multi', $e->getMessage(), $e);
        }
    }

    public function flush(): bool
    {
        $this->ensureConnection();

        try {
            $keys = $this->redis->keys($this->key('*'));
            if (!empty($keys)) {
                $this->redis->del($keys);
            }
            return true;
        } catch (\Throwable $e) {
            throw CodexCacheException::operationError('flush', '*', $e->getMessage(), $e);
        }
    }

    public function ttl(string $key): ?int
    {
        $this->ensureConnection();

        try {
            $ttl = $this->redis->ttl($this->key($key));
            return $ttl >= 0 ? $ttl : null;
        } catch (\Throwable $e) {
            throw CodexCacheException::operationError('ttl', $key, $e->getMessage(), $e);
        }
    }

    public function tags(array $tags): TaggedCache
    {
        return new TaggedCache($this, $tags);
    }

    public function lock(string $name, int $seconds = 10): Lock
    {
        return new Lock($this->redis, $this->key($name), $seconds);
    }
}
