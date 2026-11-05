<?php

namespace Web3Codex\Support;

/**
 * CodexCache Stub - Fallback implementation
 *
 * This provides the missing Web3Codex\Support\CodexCache class that CodexSecure is importing.
 * Uses Laravel's built-in caching instead of Redis.
 */
class CodexCache
{
    public function __construct($config = [])
    {
        // Use Laravel's cache instead of Redis
    }

    public function get($key, $default = null)
    {
        return cache()->get($key, $default);
    }

    public function put($key, $value, $ttl = null)
    {
        return cache()->put($key, $value, $ttl);
    }

    public function forget($key)
    {
        return cache()->forget($key);
    }

    public function flush()
    {
        return cache()->flush();
    }

    public function has($key)
    {
        return cache()->has($key);
    }

    public function remember($key, $ttl, $callback)
    {
        return cache()->remember($key, $ttl, $callback);
    }

    public function pull($key, $default = null)
    {
        return cache()->pull($key, $default);
    }

    public function increment($key, $value = 1)
    {
        return cache()->increment($key, $value);
    }

    public function decrement($key, $value = 1)
    {
        return cache()->decrement($key, $value);
    }

    public function forever($key, $value)
    {
        return cache()->forever($key, $value);
    }

    public function many(array $keys)
    {
        return cache()->many($keys);
    }

    public function putMany(array $values, $ttl = null)
    {
        return cache()->putMany($values, $ttl);
    }

    public function add($key, $value, $ttl = null)
    {
        return cache()->add($key, $value, $ttl);
    }

    public function lock($name, $seconds = null, $owner = null)
    {
        return cache()->lock($name, $seconds, $owner);
    }
}
