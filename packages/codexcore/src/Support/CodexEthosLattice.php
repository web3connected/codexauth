<?php

namespace Web3Codex\CodexCore\Support;

use Spatie\Emoji\Emoji;

/**
 * CodexEthosLattice
 *
 * Defines the Codex Ethos Lattice structure for ethical data routing and intent alignment.
 * Each zone (Z1-Z12) represents a core ethical layer that determines if data belongs
 * in specific parts of the system. This lattice enforces intent alignment across
 * the Codex system, including login, access, agent behavior, and UI overlays.
 *
 * Purpose: Data Gateway & Intent Validation - NOT emotional processing
 * CodexMind handles complex emotional analysis - this handles data routing
 */
class CodexEthosLattice
{
    // Canonical Zone IDs
    public const ZONE_IDENTITY = 'Z1';
    public const ZONE_TIME = 'Z2';
    public const ZONE_POWER = 'Z3';
    public const ZONE_KNOWLEDGE = 'Z4';
    public const ZONE_CHANGE = 'Z5';
    public const ZONE_HARMONY = 'Z6';
    public const ZONE_TRUST = 'Z7';
    public const ZONE_JUSTICE = 'Z8';
    public const ZONE_JUSTICE_EQUALITY = 'Z8.1';
    public const ZONE_JUSTICE_RESTITUTION = 'Z8.2';
    public const ZONE_JUSTICE_NON_DISCRIMINATION = 'Z8.3';
    public const ZONE_FOUNDATION = 'Z9';
    public const ZONE_OVERSIGHT = 'Z10';
    public const ZONE_SECURITY = 'Z11';
    public const ZONE_SECURITY_DEFENSE = 'Z11.1';
    public const ZONE_TRANSCENDENCE = 'Z12';

    private static ?array $definitionsCache = null;
    private static ?array $flattenedCache = null;

    public static function definitions(): array
    {
        if (self::$definitionsCache === null) {
            self::$definitionsCache = self::buildDefinitions();
        }

        return unserialize(serialize(self::$definitionsCache));
    }

    private static function buildDefinitions(): array
    {
        return [
            self::ZONE_IDENTITY => self::zone('IDENTITY', 'Identity / Self', 'lock', '🔐', 'Autonomy, uniqueness, personal integrity', true),
            self::ZONE_TIME => self::zone('TIME', 'Time / Patience', 'hourglass', '⏳', 'Urgency, delay, timing of action', true),
            self::ZONE_POWER => self::zone('POWER', 'Power / Strength', 'zap', '⚡', 'Influence, force, control', true),
            self::ZONE_KNOWLEDGE => self::zone('KNOWLEDGE', 'Knowledge / Truth', 'brain', '🧠', 'Logic, evidence, understanding', true),
            self::ZONE_CHANGE => self::zone('CHANGE', 'Change / Inversion', 'refresh-ccw', '🌀', 'Transformation, evolution, disruption', true),
            self::ZONE_HARMONY => self::zone('HARMONY', 'Harmony / Resonance', 'radio', '📡', 'Alignment, coherence, relationship', true),
            self::ZONE_TRUST => self::zone('TRUST', 'Trust / Transparency', 'handshake', '🤝', 'Honesty, verification, credibility', true),
            self::ZONE_JUSTICE => self::zone('JUSTICE', 'Justice / Ethics', 'scale', '⚖️', 'Fairness, equality, moral protection', true, [
                self::ZONE_JUSTICE_EQUALITY => self::zone('EQUALITY', 'Equality', 'equal', '🟰', 'Fair access for all'),
                self::ZONE_JUSTICE_RESTITUTION => self::zone('RESTITUTION', 'Restitution', 'undo', '↩️', 'Repairing past harm ethically'),
                self::ZONE_JUSTICE_NON_DISCRIMINATION => self::zone('NON_DISCRIMINATION', 'Non-Discrimination', 'ban', '🚫', 'Eliminating bias or unfair treatment'),
            ]),
            self::ZONE_FOUNDATION => self::zone('FOUNDATION', 'Foundation / Order', 'dna', '🧬', 'Structure, law, discipline', true),
            self::ZONE_OVERSIGHT => self::zone('OVERSIGHT', 'Oversight / Observation', 'satellite', '🛰️', 'Monitoring, accountability, feedback', true),
            self::ZONE_SECURITY => self::zone('SECURITY', 'Security / Protection', 'shield', '🛡️', 'Safety, stability, risk reduction', true, [
                self::ZONE_SECURITY_DEFENSE => self::zone('DEFENSE', 'Defense', 'shield-off', '🛡️', 'Active protection from harm'),
            ]),
            self::ZONE_TRANSCENDENCE => self::zone('TRANSCENDENCE', 'Transcendence / Purpose', 'planet', '🪐', 'Legacy, vision, cosmic scope', true),
        ];
    }

    protected static function zone(
        string $code,
        string $label,
        string $icon,
        string $emoji,
        string $meaning,
        bool $locked = false,
        array $children = []
    ): array {
        return compact('code', 'label', 'icon', 'emoji', 'meaning', 'locked', 'children');
    }

    public static function get(string $zoneId): ?array
    {
        $parts = explode('.', $zoneId);
        $zones = self::definitions();
        $current = $zones;
        $zone = null;

        foreach ($parts as $part) {
            $fullKey = implode('.', array_slice($parts, 0, array_search($part, $parts) + 1));

            if (!isset($current[$fullKey])) {
                return null;
            }

            $zone = $current[$fullKey];

            if ($zone['locked'] && $zoneId !== $fullKey) {
                throw new \Exception("Cannot override locked zone: {$fullKey}");
            }

            $current = $zone['children'] ?? [];
        }

        return $zone ? unserialize(serialize($zone)) : null;
    }

    public static function flatten(): array
    {
        if (self::$flattenedCache === null) {
            self::$flattenedCache = self::flattenDefinitions(self::definitions());
        }

        return unserialize(serialize(self::$flattenedCache));
    }

    private static function flattenDefinitions(array $zones, string $prefix = ''): array
    {
        $flat = [];

        foreach ($zones as $key => $zone) {
            $flat[$key] = $zone;
            if (!empty($zone['children'])) {
                $flat += self::flattenDefinitions($zone['children'], $key);
            }
        }

        return $flat;
    }

    public static function getParentZoneId(string $zoneId): ?string
    {
        $parts = explode('.', $zoneId);
        array_pop($parts);
        return $parts ? implode('.', $parts) : null;
    }

    public static function getParentZone(string $zoneId): ?array
    {
        $parentId = self::getParentZoneId($zoneId);
        return $parentId ? self::get($parentId) : null;
    }

    public static function resolveZoneIdByCode(string $code): ?string
    {
        return collect(self::flatten())->search(
            fn($zone) => strtoupper($zone['code']) === strtoupper($code)
        );
    }

    public static function findByCode(string $code): ?array
    {
        return collect(self::flatten())->first(
            fn($zone) => strtoupper($zone['code']) === strtoupper($code)
        );
    }

    public static function getZoneHierarchy(string $zoneId): array
    {
        $parts = explode('.', $zoneId);
        $hierarchy = [];
        $currentId = '';

        foreach ($parts as $part) {
            $currentId = $currentId ? "$currentId.$part" : $part;
            $zone = self::get($currentId);
            if ($zone) {
                $hierarchy[$currentId] = $zone;
            }
        }

        return $hierarchy;
    }

    public static function isLocked(string $zoneId): bool
    {
        $zone = self::get($zoneId);
        return $zone['locked'] ?? false;
    }

    public function validate(
        string $zoneId,
        array $data,
        bool $strict = false
    ): bool {
        $zone = self::get($zoneId);

        if (!$zone) {
            throw new \Exception("Zone not found: {$zoneId}");
        }

        if ($strict && empty($zone['locked'])) {
            throw new \Exception("Zone is not locked: {$zoneId}");
        }

        // 🔎 Example: check required fields
        $expectedKeys = $zone['rules']['required'] ?? [];
        foreach ($expectedKeys as $key) {
            if (!array_key_exists($key, $data)) {
                if ($strict) {
                    throw new \Exception("Missing required key `{$key}` for zone {$zoneId}`");
                }
                return false;
            }
        }

        // ✅ Could also check value types or regex here...

        return true;
    }
    public function reportSuspiciousActivity($identifier)
    {
        // Log suspicious activity with identifier
        logger()->warning('Suspicious activity detected', [
            'identifier' => $identifier,
            'ip' => $this->getClientIp(),
            'timestamp' => now()->toDateTimeString(),
        ]);
    }

    protected function getClientIp(): ?string
    {
        return request()->ip() ?: null;
    }

    /**
     * Data Routing and Intent Alignment
     * Determines if data/requests belong in specific ethical zones
     */

    /**
     * Validate if data aligns with zone intent
     *
     * @param string $zoneId Target zone
     * @param array $requestData Incoming data/request
     * @return array Validation result with routing decision
     */
    public static function validateIntentAlignment(string $zoneId, array $requestData): array
    {
        $zone = self::get($zoneId);
        if (!$zone) {
            return [
                'allowed' => false,
                'reason' => 'Zone not found',
                'zone_id' => $zoneId
            ];
        }

        // Extract intent indicators from request
        $intentIndicators = self::extractIntentIndicators($requestData);

        // Check if intent aligns with zone purpose
        $alignment = self::checkZoneAlignment($zone, $intentIndicators);

        return [
            'allowed' => $alignment['matches'],
            'confidence' => $alignment['confidence'],
            'zone_id' => $zoneId,
            'zone_code' => $zone['code'],
            'intent_indicators' => $intentIndicators,
            'reason' => $alignment['reason'],
            'routing_suggestion' => $alignment['suggested_zone'] ?? null
        ];
    }

    /**
     * Route data to appropriate zone based on intent
     *
     * @param array $requestData Incoming data
     * @return array Routing decision
     */
    public static function routeByIntent(array $requestData): array
    {
        $intentIndicators = self::extractIntentIndicators($requestData);
        $zones = self::flatten();
        $bestMatch = null;
        $highestConfidence = 0;

        foreach ($zones as $zoneId => $zone) {
            $alignment = self::checkZoneAlignment($zone, $intentIndicators);

            if ($alignment['confidence'] > $highestConfidence) {
                $highestConfidence = $alignment['confidence'];
                $bestMatch = [
                    'zone_id' => $zoneId,
                    'zone_code' => $zone['code'],
                    'confidence' => $alignment['confidence'],
                    'reason' => $alignment['reason']
                ];
            }
        }

        return [
            'routed_to' => $bestMatch,
            'intent_indicators' => $intentIndicators,
            'confidence_threshold_met' => $highestConfidence >= 0.6,
            'requires_human_review' => $highestConfidence < 0.6
        ];
    }

    /**
     * Extract intent indicators from request data
     *
     * @param array $requestData
     * @return array Intent indicators
     */
    private static function extractIntentIndicators(array $requestData): array
    {
        $indicators = [
            'emojis' => [],
            'keywords' => [],
            'action_type' => null,
            'data_type' => null,
            'urgency_level' => 'normal'
        ];

        // Extract text content for analysis
        $textContent = '';
        if (isset($requestData['message'])) {
            $textContent = $requestData['message'];
        } elseif (isset($requestData['description'])) {
            $textContent = $requestData['description'];
        } elseif (isset($requestData['content'])) {
            $textContent = $requestData['content'];
        }

        if ($textContent) {
            $indicators['emojis'] = self::extractEmojisFromText($textContent);
            $indicators['keywords'] = self::extractKeywordsForCodexMind($textContent);
        }

        // Determine action type from request
        if (isset($requestData['action'])) {
            $indicators['action_type'] = $requestData['action'];
        } elseif (isset($requestData['method'])) {
            $indicators['action_type'] = strtolower($requestData['method']);
        }

        // Determine data type
        if (isset($requestData['type'])) {
            $indicators['data_type'] = $requestData['type'];
        }

        // Check for urgency indicators
        if (in_array('⚡', $indicators['emojis']) ||
            in_array('🚨', $indicators['emojis']) ||
            isset($indicators['keywords']['TIME'])) {
            $indicators['urgency_level'] = 'high';
        }

        return $indicators;
    }

    /**
     * Check if intent aligns with zone purpose
     *
     * @param array $zone
     * @param array $intentIndicators
     * @return array Alignment assessment
     */
    private static function checkZoneAlignment(array $zone, array $intentIndicators): array
    {
        $confidence = 0.0;
        $reasons = [];
        $matches = false;

        // Check emoji alignment
        if (!empty($intentIndicators['emojis'])) {
            foreach ($intentIndicators['emojis'] as $emoji) {
                if ($zone['emoji'] === $emoji) {
                    $confidence += 0.4;
                    $reasons[] = "Direct emoji match: {$emoji}";
                    $matches = true;
                }
            }
        }

        // Check keyword alignment
        if (!empty($intentIndicators['keywords'])) {
            foreach ($intentIndicators['keywords'] as $zoneCode => $keywords) {
                if ($zone['code'] === $zoneCode) {
                    $confidence += 0.3;
                    $reasons[] = "Keyword match in {$zoneCode}: " . implode(', ', $keywords);
                    $matches = true;
                }
            }
        }

        // Check action type alignment
        $actionAlignments = [
            'IDENTITY' => ['login', 'authenticate', 'profile', 'personal'],
            'SECURITY' => ['protect', 'secure', 'defend', 'block', 'encrypt'],
            'JUSTICE' => ['report', 'appeal', 'fair', 'equal', 'rights'],
            'TRUST' => ['verify', 'validate', 'confirm', 'honest'],
            'KNOWLEDGE' => ['learn', 'search', 'analyze', 'understand'],
            'POWER' => ['admin', 'control', 'manage', 'override'],
            'TIME' => ['schedule', 'urgent', 'deadline', 'timing'],
            'HARMONY' => ['connect', 'collaborate', 'align', 'balance'],
            'TRANSCENDENCE' => ['vision', 'purpose', 'mission', 'goal']
        ];

        if (isset($actionAlignments[$zone['code']]) && $intentIndicators['action_type']) {
            foreach ($actionAlignments[$zone['code']] as $alignedAction) {
                if (strpos($intentIndicators['action_type'], $alignedAction) !== false) {
                    $confidence += 0.2;
                    $reasons[] = "Action alignment: {$intentIndicators['action_type']}";
                    $matches = true;
                }
            }
        }

        // Urgency affects TIME zone alignment
        if ($zone['code'] === 'TIME' && $intentIndicators['urgency_level'] === 'high') {
            $confidence += 0.3;
            $reasons[] = "High urgency aligns with TIME zone";
            $matches = true;
        }

        return [
            'matches' => $matches,
            'confidence' => min(1.0, $confidence),
            'reason' => implode('; ', $reasons) ?: 'No clear alignment detected',
            'suggested_zone' => $matches ? null : self::suggestAlternativeZone($intentIndicators)
        ];
    }

    /**
     * Suggest alternative zone when no clear match found
     *
     * @param array $intentIndicators
     * @return string|null
     */
    private static function suggestAlternativeZone(array $intentIndicators): ?string
    {
        // Default routing suggestions based on common patterns
        if ($intentIndicators['action_type']) {
            $defaultRouting = [
                'get' => 'KNOWLEDGE',
                'post' => 'FOUNDATION',
                'put' => 'CHANGE',
                'delete' => 'SECURITY',
                'login' => 'IDENTITY',
                'search' => 'KNOWLEDGE',
                'admin' => 'POWER'
            ];

            return $defaultRouting[$intentIndicators['action_type']] ?? 'FOUNDATION';
        }

        return 'FOUNDATION'; // Default fallback
    }

    /**
     * Simple emoji extraction for CodexMind integration
     *
     * @param string $text Input text
     * @return array List of detected emojis
     */
    public static function extractEmojisFromText(string $text): array
    {
        // Simple emoji extraction for CodexMind to process
        preg_match_all('/[\x{1F600}-\x{1F64F}]|[\x{1F300}-\x{1F5FF}]|[\x{1F680}-\x{1F6FF}]|[\x{1F1E0}-\x{1F1FF}]|[\x{2600}-\x{26FF}]|[\x{2700}-\x{27BF}]/u', $text, $matches);

        return $matches[0] ?? [];
    }

    /**
     * Get zone information for CodexMind integration
     *
     * @param string $text Input text containing emojis
     * @return array Zone mappings for CodexMind to process
     */
    public static function getZonesForCodexMind(string $text): array
    {
        $detectedEmojis = self::extractEmojisFromText($text);
        $zoneMappings = [];

        foreach ($detectedEmojis as $emoji) {
            $zoneMapping = self::findZoneByEmoji($emoji);
            if ($zoneMapping) {
                $zoneMappings[] = [
                    'zone_id' => $zoneMapping['zone_id'],
                    'zone_code' => $zoneMapping['zone']['code'],
                    'zone_label' => $zoneMapping['zone']['label'],
                    'emoji' => $emoji,
                    'context' => $zoneMapping['context'] ?? 'direct'
                ];
            }
        }

        return [
            'text' => $text,
            'detected_emojis' => $detectedEmojis,
            'zone_mappings' => $zoneMappings,
            'textual_keywords' => self::extractKeywordsForCodexMind($text)
        ];
    }

    /**
     * Simple zone lookup by emoji for routing decisions
     *
     * @param string $emoji
     * @return array|null
     */
    private static function findZoneByEmoji(string $emoji): ?array
    {
        $flattened = self::flatten();

        foreach ($flattened as $zoneId => $zone) {
            if ($zone['emoji'] === $emoji) {
                return ['zone_id' => $zoneId, 'zone' => $zone];
            }
        }

        return null;
    }

    /**
     * Extract ethical keywords for CodexMind processing
     *
     * @param string $text Input text
     * @return array Keywords organized by zone
     */
    private static function extractKeywordsForCodexMind(string $text): array
    {
        $text = strtolower($text);
        $keywords = [];

        // Basic keyword patterns for CodexMind to understand ethical context
        $zoneKeywords = [
            'IDENTITY' => ['self', 'identity', 'personal', 'individual', 'unique', 'authentic'],
            'HARMONY' => ['balance', 'peace', 'harmony', 'align', 'resonance', 'together'],
            'JUSTICE' => ['fair', 'just', 'equal', 'right', 'wrong', 'ethical', 'moral'],
            'TRUST' => ['trust', 'honest', 'reliable', 'authentic', 'transparent'],
            'POWER' => ['power', 'control', 'influence', 'force', 'authority', 'strength'],
            'KNOWLEDGE' => ['know', 'learn', 'understand', 'wisdom', 'truth', 'evidence'],
            'SECURITY' => ['safe', 'secure', 'protect', 'defense', 'stable', 'shield'],
            'TRANSCENDENCE' => ['spiritual', 'higher', 'purpose', 'meaning', 'transcend', 'divine']
        ];

        foreach ($zoneKeywords as $zone => $words) {
            $matches = array_filter($words, fn($word) => strpos($text, $word) !== false);
            if (!empty($matches)) {
                $keywords[$zone] = $matches;
            }
        }

        return $keywords;
    }
}
