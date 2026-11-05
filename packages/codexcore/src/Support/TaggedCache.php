<?php

namespace Web3Codex\CodexCore\Support;

use Web3Codex\CodexCore\Exceptions\CodexCacheException;
use Predis\Client;

class TaggedCache
{
    public function __construct(
        private CodexCache $cache,
        private array $tags
    ) {}

    public function put(string $key, $value, ?int $ttl = null): bool
    {
        try {
            $success = $this->cache->put($key, $value, $ttl);

            foreach ($this->tags as $tag) {
                $tagKey = "tag:{$tag}";
                $members = $this->cache->get($tagKey, []);
                $members[] = $key;
                $this->cache->put($tagKey, array_values(array_unique($members)));
            }

            return $success;
        } catch (\Throwable $e) {
            throw CodexCacheException::operationError('tagged_put', $key, $e->getMessage(), $e);
        }
    }

    public function flush(): void
    {
        try {
            foreach ($this->tags as $tag) {
                $tagKey = "tag:{$tag}";
                $members = $this->cache->get($tagKey, []);

                foreach ($members as $member) {
                    $this->cache->forget($member);
                }

                $this->cache->forget($tagKey);
            }
        } catch (\Throwable $e) {
            throw CodexCacheException::operationError('tagged_flush', implode(',', $this->tags), $e->getMessage(), $e);
        }
    }
}
