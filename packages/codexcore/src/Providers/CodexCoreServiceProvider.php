<?php

namespace Web3Codex\CodexCore\Providers;

use Illuminate\Support\ServiceProvider;
use Web3Codex\CodexCore\Services\CodexCore;
use Web3Codex\CodexCore\Clients\CodexAgentClient;

class CodexCoreServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(
            __DIR__ . '/../../config/services/codexcore.php',
            'codexcore'
        );

        // Register CodexCache first
        $this->app->singleton(\Web3Codex\CodexCore\Support\CodexCache::class, function ($app) {
            return new \Web3Codex\CodexCore\Support\CodexCache([
                'prefix' => config('codexcore.cache.prefix', 'codex_core')
            ]);
        });

        $this->app->singleton(CodexCore::class, function ($app) {
            return new CodexCore(
                $app->make(\Web3Codex\CodexCore\Support\CodexCache::class)
            );
        });

        // Register UsageTrackerService
        $this->app->singleton(\Web3Codex\CodexCore\Services\UsageTrackerService::class, function ($app) {
            return new \Web3Codex\CodexCore\Services\UsageTrackerService();
        });

        // Register Sync Services
        $this->app->singleton(\Web3Codex\CodexCore\Services\Sync\CodexConnectService::class, function ($app) {
            return new \Web3Codex\CodexCore\Services\Sync\CodexConnectService();
        });

        $this->app->singleton(\Web3Codex\CodexCore\Services\Sync\CodexSyncService::class, function ($app) {
            return new \Web3Codex\CodexCore\Services\Sync\CodexSyncService();
        });

        $this->app->singleton(\Web3Codex\CodexCore\Support\TaggedCache::class, function ($app) {
            return new \Web3Codex\CodexCore\Support\TaggedCache(
                $app->make(\Web3Codex\CodexCore\Support\CodexCache::class),
                []
            );
        });

        $this->app->singleton(\Web3Codex\CodexCore\Support\Lock::class, function ($app) {
            return function (string $name, int $seconds = 10) {
                return new \Web3Codex\CodexCore\Support\Lock(
                    app(\Predis\Client::class),
                    $name,
                    $seconds
                );
            };
        });

        $this->app->singleton(\Web3Codex\CodexCore\Support\CodexEthosLattice::class, function ($app) {
            return new \Web3Codex\CodexCore\Support\CodexEthosLattice();
        });

        $this->app->singleton(\Web3Codex\CodexCore\Support\CodexSecureDebugger::class, function ($app) {
            return new \Web3Codex\CodexCore\Support\CodexSecureDebugger();
        });

        // Register CodexAgentClient
        $this->app->singleton(CodexAgentClient::class, function ($app) {
            return new CodexAgentClient($app->make(\Web3Codex\CodexCore\Services\Sync\CodexConnectService::class));
        });

        $this->app->alias(CodexCore::class, 'codex.core');
        $this->app->alias(\Web3Codex\CodexCore\Support\CodexCache::class, 'codex.core.cache');
        $this->app->alias(\Web3Codex\CodexCore\Services\UsageTrackerService::class, 'codex.core.usage-tracker');
        $this->app->alias(\Web3Codex\CodexCore\Services\Sync\CodexConnectService::class, 'codex.core.connect');
        $this->app->alias(\Web3Codex\CodexCore\Services\Sync\CodexSyncService::class, 'codex.core.sync');
        $this->app->alias(\Web3Codex\CodexCore\Support\TaggedCache::class, 'codex.core.tagged-cache');
        $this->app->alias(\Web3Codex\CodexCore\Support\CodexEthosLattice::class, 'codex.core.ethos-lattice');
        $this->app->alias(\Web3Codex\CodexCore\Support\CodexSecureDebugger::class, 'codex.core.secure-debugger');
    }

    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__ . '/../../config/services' => config_path(),
            ], 'codex-service-config');
        }

        $this->mergeConfigFrom(
            __DIR__ . '/../../config/services/codexcore.php', 'codexcore'
        );

        // api.formatter stays here — it's a core concern, not zone enforcement
        $this->app['router']->aliasMiddleware(
            'api.formatter',
            \Web3Codex\CodexCore\Http\Middleware\ApiResponseFormatter::class
        );
    }
}
