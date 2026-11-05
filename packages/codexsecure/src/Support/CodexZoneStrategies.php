<?php

namespace Web3Codex\CodexSecure\Support;

use Exception;
use Illuminate\Support\Str;

class CodexZoneStrategies
{
    protected array $customStrategies = [];
    protected ?array $cachedStrategies = null;
    protected ?array $cachedControllerMap = null;
    protected ?array $cachedModelMap = null;

    public function getZoneStrategies($zone = null): array
    {
        if ($this->cachedStrategies === null) {
            $this->cachedStrategies = [
                'negative' => $this->getNegativeZoneStrategies(),
                'public' => $this->getPublicZoneStrategies(),
                'identity' => $this->getIdentityStrategies(),
                'ops' => $this->getOpsStrategies(),
                'protected' => $this->getProtectedStrategies(),
                'system' => $this->getSystemStrategies(),
                'eventlogs' => $this->getEventlogsStrategies(),
                'comms' => $this->getCommsStrategies(),
                'payments' => $this->getPaymentsStrategies(),
                'analytics' => $this->getAnalyticsStrategies(),
                'behavior' => $this->getBehaviorStrategies(),
                'realtime' => $this->getRealtimeStrategies(),
                'admin' => $this->getAdminStrategies()
            ];
        }

        if ($zone !== null) {
            return $this->customStrategies[$zone]
                ?? ($this->cachedStrategies[$zone] ?? []);
        }

        return array_merge_recursive($this->cachedStrategies, $this->customStrategies);
    }

    public function getControllerStrategies(): array
    {
        if ($this->cachedControllerMap !== null) {
            return $this->cachedControllerMap;
        }

        $zoneMap = config('zone_registry', []);
        $nameToId = array_flip($zoneMap);

        $rawStrategies = [
            'Home' => 'public',
            'Login' => 'identity',
            'Register' => 'identity',
            'Logout' => 'identity',
            'Dashboard' => 'protected',
            'Profile' => 'protected',
            'Settings' => 'protected',
            'File' => 'protected',
            'User' => 'protected',
            'Export' => 'protected',
            'Log' => 'eventlogs',
            'Event' => 'eventlogs',
            'CodexHash' => 'system',
            'System' => 'system',
            'Job' => 'system',
            'Task' => 'system',
            'Notification' => 'comms',
            'Message' => 'comms',
            'Chat' => 'comms',
            'Payment' => 'payments',
            'Invoice' => 'payments',
            'Analytics' => 'analytics',
            'Report' => 'analytics',
            'Stream' => 'realtime',
            'Admin' => 'admin',
            'Spam' => 'negative',
        ];

        $this->cachedControllerMap = $this->buildZonePatterns($rawStrategies, $nameToId);
        return $this->cachedControllerMap;
    }

    public function getModelStrategies(): array
    {
        if ($this->cachedModelMap !== null) {
            return $this->cachedModelMap;
        }

        $zoneMap = config('zone_registry', []);
        $nameToId = array_flip($zoneMap);

        $rawStrategies = [
            'User' => 'protected',
            'Order' => 'payments',
            'Product' => 'analytics',
            'Category' => 'analytics',
            'Cart' => 'payments',
            'Transaction' => 'payments',
            'Invoice' => 'payments',
            'Notification' => 'comms',
            'Message' => 'comms',
            'Chat' => 'comms',
            'Log' => 'eventlogs',
            'Event' => 'eventlogs',
            'System' => 'system',
            'Task' => 'system',
            'Job' => 'system',
            'Admin' => 'admin',
            'Profile' => 'protected',
            'Settings' => 'protected',
            'File' => 'protected',
            'Export' => 'protected',
            'Analytics' => 'analytics',
            'Report' => 'analytics',
            'Stream' => 'realtime',
            'Spam' => 'negative'
        ];

        $this->cachedModelMap = $this->buildZonePatterns($rawStrategies, $nameToId);
        return $this->cachedModelMap;
    }

    protected function buildZonePatterns(array $rawStrategies, array $nameToId): array
    {
        $zonePatterns = [];

        foreach ($rawStrategies as $key => $zoneName) {
            if (!isset($nameToId[$zoneName])) continue;

            $zoneId = $nameToId[$zoneName];
            $zonePatterns[$zoneId][] = $key;
        }

        return $zonePatterns;
    }

    public function detectRouteZone($route): string
    {
        $uri = $route->uri();
        $controller = $route->getActionName();

        // Fast path for root URL
        if ($uri === '/') {
            return 'public';
        }

        $zoneRegistry = config('zone_registry', []);
        if (!is_array($zoneRegistry)) {
            throw new Exception("Zone registry config is missing or malformed.");
        }

        // URI-based detection (case-insensitive)
        $lowerUri = Str::lower($uri);
        $zoneStrategies = $this->getZoneStrategies();

        foreach ($zoneStrategies as $zoneName => $keywords) {
            foreach ($keywords as $keyword) {
                if (str_contains($lowerUri, $keyword)) {
                    return $zoneName;
                }
            }
        }

        // Controller-based fallback
        $controllerStrategies = $this->getControllerStrategies();
        foreach ($controllerStrategies as $zoneId => $patterns) {
            foreach ($patterns as $pattern) {
                if (str_contains($controller, $pattern)) {
                    return $zoneRegistry[$zoneId] ?? 'unknown';
                }
            }
        }

        return 'unknown';
    }

    // Strategy generators (optimized with precomputed arrays)
    public function getNegativeZoneStrategies(): array
    {
        return [
            'spam',
            'malware',
            'phishing',
            'fraud',
            'scam',
            'bot',
            'fake',
            'impersonation',
            'spoofing',
            'abuse',
            'harassment',
            'trolling',
            'doxxing'
        ];
    }

    public function getPublicZoneStrategies(): array
    {
        return [
            'public',
            'home',
            'welcome',
            'index',
            'list',
            'show',
            'view',
            'search',
            'browse',
            'explore',
            'pages'
        ];
    }

    public function getIdentityStrategies(): array
    {
        return [
            'login',
            'register',
            'logout',
            'auth',
            'signin',
            'signup',
            'verify',
            'confirm',
            'forgot',
            'reset',
            'password',
            '2fa',
            'mfa',
            'otp',
            'token',
            'key',
            'credential',
            'identity'
        ];
    }

    public function getOpsStrategies(): array
    {
        return [
            'api',
            'uploads',
            'forms',
            'webhooks',
            'data',
            'input',
            'endpoint',
            'request',
            'response',
            'payload'
        ];
    }

    public function getProtectedStrategies(): array
    {
        return [
            'protected',
            'secure',
            'private',
            'restricted',
            'confidential',
            'sensitive',
            'manager',
            'owner',
            'user',
            'member',
            'group',
            'team',
            'account',
            'profile',
            'settings',
            'preferences',
            'config',
            'setup'
        ];
    }

    public function getSystemStrategies(): array
    {
        return [
            'codexhash',
            'harmonic-hash',
            'hash-api',
            'event',
            'jobs',
            'tasks',
            'cron',
            'schedule',
            'queue',
            'worker',
            'process',
            'daemon',
            'service',
            'system',
            'os',
            'platform',
            'environment',
            'server',
            'host',
            'machine'
        ];
    }

    public function getEventlogsStrategies(): array
    {
        return [
            'event',
            'logs',
            'log',
            'history',
            'audit',
            'record',
            'trace',
            'track',
            'monitor',
            'alert',
            'notification',
            'message',
            'signal',
            'trigger'
        ];
    }

    public function getCommsStrategies(): array
    {
        return [
            'comms',
            'communication',
            'message',
            'chat',
            'email',
            'sms',
            'notification',
            'alert',
            'signal',
            'call',
            'contact',
            'connect',
            'link',
            'network',
            'social',
            'media'
        ];
    }

    public function getPaymentsStrategies(): array
    {
        return [
            'payments',
            'payment',
            'transaction',
            'transfer',
            'invoice',
            'bill',
            'charge',
            'fee',
            'cost',
            'price',
            'amount',
            'currency',
            'wallet',
            'balance',
            'checkout',
            'cart',
            'order',
            'purchase',
            'sale',
            'buy',
            'sell',
            'trade',
            'exchange',
            'market',
            'bid',
            'offer'
        ];
    }

    public function getAnalyticsStrategies(): array
    {
        return [
            'analytics',
            'analysis',
            'report',
            'reporting',
            'metrics',
            'metric',
            'data',
            'insights',
            'insight',
            'dashboard',
            'visualization',
            'visualize',
            'chart',
            'graph',
            'table',
            'summary'
        ];
    }

    public function getBehaviorStrategies(): array
    {
        return [
            'behavior',
            'behaviour',
            'behavioral',
            'behavioural',
            'action',
            'activity',
            'interaction',
            'engagement',
            'reaction',
            'feedback',
            'output',
            'event'
        ];
    }

    public function getRealtimeStrategies(): array
    {
        return [
            'realtime',
            'real-time',
            'live',
            'instant',
            'immediate',
            'on-demand',
            'streaming',
            'stream',
            'broadcast',
            'push',
            'update',
            'refresh',
            'sync',
            'synchronous'
        ];
    }

    public function getAdminStrategies(): array
    {
        return [
            'admin',
            'administrator',
            'superuser',
            'root',
            'owner',
            'manager',
            'control',
            'access',
            'privilege',
            'permission',
            'authority',
            'moderator'
        ];
    }

    public function setZoneStrategies(string $zone, array $strategies): void
    {
        $this->customStrategies[$zone] = $strategies;
        // Clear cache since strategies changed
        $this->cachedStrategies = null;
    }
}
