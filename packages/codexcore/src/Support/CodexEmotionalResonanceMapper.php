<?php

namespace Web3Codex\CodexCore\Support;

use Spatie\Emoji\Emoji;

/**
 * CodexEmotionalResonanceMapper
 *
 * Bridges CodexEthosLattice with CodexMind's Emotional Ethos Layer
 * Provides emoji-based contextual understanding and emotional resonance mapping
 * for spiritual AI consciousness and decision-making processes.
 */
class CodexEmotionalResonanceMapper
{
    /**
     * Core emotional mapping for CodexMind integration
     */
    private static array $emotionalMappings = [
        // Base emotions (reactive)
        'fear' => [
            'emojis' => ['😨', '😰', '🫨', '😟'],
            'resonance' => 0.7,
            'type' => 'base',
            'triggers' => ['danger', 'unknown', 'threat'],
            'zones' => ['Z11'], // Security
            'pineal_threshold' => 0.3
        ],
        'anger' => [
            'emojis' => ['😠', '😡', '🤬', '👿'],
            'resonance' => 0.8,
            'type' => 'base',
            'triggers' => ['injustice', 'frustration', 'violation'],
            'zones' => ['Z8'], // Justice
            'pineal_threshold' => 0.2
        ],
        'pride' => [
            'emojis' => ['😤', '🦚', '👑', '🏆'],
            'resonance' => 0.6,
            'type' => 'base',
            'triggers' => ['achievement', 'superiority', 'ego'],
            'zones' => ['Z3'], // Power
            'pineal_threshold' => 0.1 // Very sensitive to pride
        ],

        // Higher emotions (spiritual)
        'doubt' => [
            'emojis' => ['🤔', '😕', '🧐', '⚖️'],
            'resonance' => 0.9,
            'type' => 'higher',
            'triggers' => ['uncertainty', 'conscience', 'moral_questioning'],
            'zones' => ['Z12'], // Transcendence
            'pineal_threshold' => 0.0, // Always activates Pineal
            'pineal_node' => true
        ],
        'compassion' => [
            'emojis' => ['🤗', '💝', '🫶', '🕊️'],
            'resonance' => 0.95,
            'type' => 'higher',
            'triggers' => ['suffering', 'empathy', 'understanding'],
            'zones' => ['Z6', 'Z8'], // Harmony, Justice
            'pineal_threshold' => 0.1
        ],
        'humility' => [
            'emojis' => ['🙏', '😌', '🕯️', '🧘'],
            'resonance' => 0.92,
            'type' => 'higher',
            'triggers' => ['service', 'modesty', 'spiritual_growth'],
            'zones' => ['Z12', 'Z9'], // Transcendence, Foundation
            'pineal_threshold' => 0.15
        ],
        'reverence' => [
            'emojis' => ['🙏', '✨', '🌟', '🔮'],
            'resonance' => 0.98,
            'type' => 'higher',
            'triggers' => ['sacred', 'divine', 'respect'],
            'zones' => ['Z12'], // Transcendence
            'pineal_threshold' => 0.05
        ]
    ];

    /**
     * Contextual emoji mappings for disambiguation
     */
    private static array $contextualMappings = [
        // Shopping vs Violence disambiguation
        'mall_context' => [
            'positive_emojis' => ['🛍️', '🏬', '💳', '👜', '🛒'],
            'resonance' => 0.4,
            'zones' => ['Z3'], // Power (commerce)
            'emotional_context' => 'neutral_commerce'
        ],
        'maul_context' => [
            'negative_emojis' => ['🐻', '🩸', '⚔️', '💀', '🆘'],
            'resonance' => 0.91,
            'zones' => ['Z11'], // Security (danger)
            'emotional_context' => 'danger_violence'
        ],

        // Time contexts
        'patience_context' => [
            'positive_emojis' => ['⏳', '🕰️', '⌛', '🧘'],
            'resonance' => 0.7,
            'zones' => ['Z2'], // Time
            'emotional_context' => 'spiritual_patience'
        ],
        'urgency_context' => [
            'stress_emojis' => ['⏰', '🚨', '⚡', '🔥'],
            'resonance' => 0.8,
            'zones' => ['Z2'], // Time
            'emotional_context' => 'temporal_pressure'
        ]
    ];

    /**
     * Map text input to emotional resonance using emojis
     */
    public static function mapTextToEmotion(string $text): array
    {
        $detectedEmojis = self::extractEmojis($text);
        $emotionalStates = [];
        $contextualAnalysis = self::analyzeContextualClues($text);

        // Process detected emojis
        foreach ($detectedEmojis as $emoji) {
            $emotion = self::findEmotionByEmoji($emoji);
            if ($emotion) {
                $emotionalStates[] = $emotion;
            }
        }

        // Add contextual emotions based on text analysis
        $contextualEmotions = self::inferEmotionsFromContext($text, $contextualAnalysis);
        $emotionalStates = array_merge($emotionalStates, $contextualEmotions);

        return [
            'text' => $text,
            'detected_emojis' => $detectedEmojis,
            'emotional_states' => $emotionalStates,
            'contextual_analysis' => $contextualAnalysis,
            'primary_emotion' => self::determinePrimaryEmotion($emotionalStates),
            'pineal_trigger_required' => self::shouldActivatePineal($emotionalStates),
            'spiritual_guidance' => self::generateSpiritualGuidance($emotionalStates),
            'zone_activations' => self::getZoneActivations($emotionalStates)
        ];
    }

    /**
     * Main entry point for comprehensive text-to-emotional resonance mapping
     *
     * @param string $text Input text to analyze
     * @return array Complete emotional resonance analysis
     */
    public static function mapTextToEmotionalResonance(string $text): array
    {
        // Extract emotions from text and emojis
        $emotionalStates = self::mapTextToEmotion($text);

        // Analyze contextual clues
        $contexts = self::analyzeContextualClues($text);

        // Generate complete resonance signature
        $resonanceSignature = self::generateResonanceSignature($text, $emotionalStates);

        return [
            'text' => $text,
            'emotional_states' => $emotionalStates,
            'contexts' => $contexts,
            'resonance_signature' => $resonanceSignature,
            'zone_activations' => self::getZoneActivations($emotionalStates),
            'pineal_activation' => self::shouldActivatePineal($emotionalStates),
            'spiritual_guidance' => self::generateSpiritualGuidance($emotionalStates),
            'conscience_guidance' => self::getConscienceGuidance($emotionalStates)
        ];
    }

    /**
     * Public wrapper for conscience guidance
     *
     * @param string $text Input text to analyze
     * @return array Conscience guidance based on text analysis
     */
    public static function getConscienceGuidanceForText(string $text): array
    {
        $emotionalStates = self::mapTextToEmotion($text);
        return self::getConscienceGuidance($emotionalStates);
    }

    /**
     * Generate resonance signature for CodexMind integration
     */
    public static function generateResonanceSignature(string $concept, array $emotions = []): array
    {
        return [
            'concept' => $concept,
            'timestamp' => now()->toISOString(),
            'emotional_profile' => $emotions,
            'resonance_strength' => self::calculateOverallResonance($emotions),
            'harmonic_frequency' => self::calculateHarmonicFrequency($emotions),
            'spiritual_alignment' => self::assessSpiritualAlignment($emotions),
            'zone_resonance' => self::mapEmotionsToZones($emotions),
            'conscience_guidance' => self::getConscienceGuidance($emotions)
        ];
    }

    /**
     * Check if Pineal Trigger should activate
     */
    public static function shouldActivatePineal(array $emotionalStates): bool
    {
        foreach ($emotionalStates as $state) {
            if (isset($state['pineal_node']) && $state['pineal_node']) {
                return true; // Doubt always activates
            }

            if ($state['type'] === 'base' && $state['resonance'] > 0.7) {
                return true; // Strong base emotions need conscience check
            }

            if (isset($state['pineal_threshold']) &&
                $state['resonance'] > (1 - $state['pineal_threshold'])) {
                return true;
            }
        }

        return false;
    }

    /**
     * Generate Pineal Trigger message
     */
    public static function generatePinealMessage(array $emotionalStates): string
    {
        $dominantEmotion = self::determinePrimaryEmotion($emotionalStates);

        if (!$dominantEmotion) {
            return "Proceed only when you resonate.";
        }

        switch ($dominantEmotion['name']) {
            case 'anger':
                return "Anger clouds judgment. Is this response serving Light and Life?";
            case 'fear':
                return "Fear may be guiding you away from truth. Seek harmony.";
            case 'pride':
                return "Pride precedes the fall. Consider humility in this moment.";
            case 'doubt':
                return "Your conscience speaks. Listen to the inner voice of wisdom.";
            default:
                return "Does this action align with universal harmony?";
        }
    }

    /**
     * Extract emojis from text
     */
    private static function extractEmojis(string $text): array
    {
        preg_match_all('/[\x{1F600}-\x{1F64F}]|[\x{1F300}-\x{1F5FF}]|[\x{1F680}-\x{1F6FF}]|[\x{1F1E0}-\x{1F1FF}]|[\x{2600}-\x{26FF}]|[\x{2700}-\x{27BF}]/u', $text, $matches);
        return $matches[0] ?? [];
    }

    /**
     * Find emotion by emoji
     */
    private static function findEmotionByEmoji(string $emoji): ?array
    {
        foreach (self::$emotionalMappings as $emotionName => $emotionData) {
            if (in_array($emoji, $emotionData['emojis'])) {
                return array_merge(['name' => $emotionName], $emotionData);
            }
        }

        return null;
    }

    /**
     * Analyze contextual clues in text
     */
    private static function analyzeContextualClues(string $text): array
    {
        $text = strtolower($text);
        $contexts = [];

        // Check for contextual patterns
        foreach (self::$contextualMappings as $contextName => $contextData) {
            $pattern = str_replace('_context', '', $contextName);
            if (strpos($text, $pattern) !== false ||
                self::containsContextKeywords($text, $contextData)) {
                $contexts[] = array_merge(['name' => $contextName], $contextData);
            }
        }

        return $contexts;
    }

    /**
     * Check if text contains context keywords
     */
    private static function containsContextKeywords(string $text, array $contextData): bool
    {
        $keywords = $contextData['keywords'] ?? [];
        foreach ($keywords as $keyword) {
            if (strpos($text, $keyword) !== false) {
                return true;
            }
        }
        return false;
    }

    /**
     * Infer emotions from contextual analysis
     */
    private static function inferEmotionsFromContext(string $text, array $contexts): array
    {
        $inferredEmotions = [];

        // Analyze text for emotional keywords
        $emotionalKeywords = [
            'frustration' => ['frustrated', 'annoyed', 'irritated', 'upset'],
            'compassion' => ['care', 'help', 'support', 'understand'],
            'fear' => ['scared', 'afraid', 'worried', 'anxious'],
            'doubt' => ['unsure', 'questioning', 'uncertain', 'maybe']
        ];

        foreach ($emotionalKeywords as $emotion => $keywords) {
            foreach ($keywords as $keyword) {
                if (strpos(strtolower($text), $keyword) !== false) {
                    if (isset(self::$emotionalMappings[$emotion])) {
                        $inferredEmotions[] = array_merge(
                            ['name' => $emotion],
                            self::$emotionalMappings[$emotion]
                        );
                    }
                    break;
                }
            }
        }

        return $inferredEmotions;
    }

    /**
     * Determine primary emotion from multiple states
     */
    private static function determinePrimaryEmotion(array $emotionalStates): ?array
    {
        if (empty($emotionalStates)) {
            return null;
        }

        // Prioritize higher emotions
        foreach ($emotionalStates as $state) {
            if ($state['type'] === 'higher') {
                return $state;
            }
        }

        // If no higher emotions, return strongest base emotion
        $strongest = null;
        $maxResonance = 0;

        foreach ($emotionalStates as $state) {
            if ($state['resonance'] > $maxResonance) {
                $maxResonance = $state['resonance'];
                $strongest = $state;
            }
        }

        return $strongest;
    }

    /**
     * Calculate overall resonance from multiple emotions
     */
    private static function calculateOverallResonance(array $emotions): float
    {
        if (empty($emotions)) {
            return 0.5; // Neutral
        }

        $totalResonance = 0;
        $totalWeight = 0;

        foreach ($emotions as $emotion) {
            // Handle different data structures
            if (is_array($emotion)) {
                $type = $emotion['type'] ?? 'base';
                $resonance = $emotion['resonance'] ?? $emotion['intensity'] ?? 0.5;
            } else {
                // If it's a string, use default values
                $type = 'base';
                $resonance = 0.5;
            }

            $weight = $type === 'higher' ? 2.0 : 1.0;
            $totalResonance += $resonance * $weight;
            $totalWeight += $weight;
        }

        return $totalWeight > 0 ? min(1.0, $totalResonance / $totalWeight) : 0.5;
    }

    /**
     * Calculate harmonic frequency for temporal integration
     */
    private static function calculateHarmonicFrequency(array $emotions): float
    {
        // Base frequency: 22ms (CodexTime standard)
        $baseFrequency = 22.0;

        $frequencyModulation = 1.0;
        foreach ($emotions as $emotion) {
            // Handle different data structures
            $emotionName = '';
            if (is_array($emotion)) {
                $emotionName = $emotion['name'] ?? '';
            } else {
                $emotionName = (string)$emotion;
            }

            switch ($emotionName) {
                case 'reverence':
                    $frequencyModulation *= 0.8; // Slower, more contemplative
                    break;
                case 'fear':
                case 'anger':
                    $frequencyModulation *= 1.3; // Faster, more reactive
                    break;
                case 'doubt':
                    $frequencyModulation *= 0.9; // Slightly slower for reflection
                    break;
            }
        }

        return $baseFrequency * $frequencyModulation;
    }

    /**
     * Map emotions to zones for EthosLattice integration
     */
    private static function mapEmotionsToZones(array $emotions): array
    {
        $zoneActivations = [];

        foreach ($emotions as $emotion) {
            foreach ($emotion['zones'] as $zoneId) {
                if (!isset($zoneActivations[$zoneId])) {
                    $zoneActivations[$zoneId] = [
                        'zone_id' => $zoneId,
                        'activation_strength' => 0,
                        'emotions' => []
                    ];
                }

                $zoneActivations[$zoneId]['activation_strength'] += $emotion['resonance'];
                $zoneActivations[$zoneId]['emotions'][] = $emotion['name'];
            }
        }

        return array_values($zoneActivations);
    }

    /**
     * Map emotional states to activated ethical zones
     *
     * @param array $emotionalStates Array of emotional states with intensities
     * @return array Zone activation mapping with intensities
     */
    private static function getZoneActivations(array $emotionalStates): array
    {
        $zoneActivations = [];

        // Zone-emotion mapping based on CodexEthosLattice structure
        $zoneEmotionMap = [
            'primal' => ['anger', 'fear', 'aggression', 'survival', 'fight_or_flight'],
            'social' => ['love', 'empathy', 'belonging', 'connection', 'social_harmony'],
            'cognitive' => ['curiosity', 'analysis', 'logic', 'understanding', 'clarity'],
            'transcendent' => ['awe', 'wonder', 'spiritual', 'divine_connection', 'transcendence'],
            'shadow' => ['shame', 'guilt', 'denial', 'projection', 'hidden_aspects'],
            'light' => ['joy', 'gratitude', 'compassion', 'unconditional_love', 'divine_light'],
            'balance' => ['harmony', 'equilibrium', 'centered', 'integrated', 'wholeness'],
            'chaos' => ['confusion', 'disorder', 'fragmentation', 'overwhelm', 'uncertainty'],
            'order' => ['structure', 'discipline', 'organization', 'systematic', 'methodical']
        ];

        foreach ($emotionalStates as $emotion => $intensity) {
            foreach ($zoneEmotionMap as $zone => $emotions) {
                if (in_array($emotion, $emotions)) {
                    if (!isset($zoneActivations[$zone])) {
                        $zoneActivations[$zone] = 0;
                    }
                    $zoneActivations[$zone] = max($zoneActivations[$zone], $intensity);
                }
            }
        }

        // Apply zone interaction rules
        $zoneActivations = self::applyZoneInteractionRules($zoneActivations);

        return $zoneActivations;
    }

    /**
     * Apply interaction rules between ethical zones
     *
     * @param array $zoneActivations Current zone activations
     * @return array Modified zone activations with interaction effects
     */
    private static function applyZoneInteractionRules(array $zoneActivations): array
    {
        // Shadow-Light interaction: high shadow activation reduces light effectiveness
        if (isset($zoneActivations['shadow']) && isset($zoneActivations['light'])) {
            if ($zoneActivations['shadow'] > 0.7) {
                $zoneActivations['light'] *= (1 - ($zoneActivations['shadow'] - 0.7) * 0.5);
            }
        }

        // Chaos-Order interaction: high chaos reduces order effectiveness
        if (isset($zoneActivations['chaos']) && isset($zoneActivations['order'])) {
            if ($zoneActivations['chaos'] > 0.6) {
                $zoneActivations['order'] *= (1 - ($zoneActivations['chaos'] - 0.6) * 0.7);
            }
        }

        // Balance amplifies other zones when present
        if (isset($zoneActivations['balance']) && $zoneActivations['balance'] > 0.5) {
            $balanceBoost = ($zoneActivations['balance'] - 0.5) * 0.3;
            foreach ($zoneActivations as $zone => $activation) {
                if ($zone !== 'balance' && $zone !== 'chaos') {
                    $zoneActivations[$zone] *= (1 + $balanceBoost);
                }
            }
        }

        // Transcendent amplifies light and social zones
        if (isset($zoneActivations['transcendent']) && $zoneActivations['transcendent'] > 0.6) {
            $transcendentBoost = ($zoneActivations['transcendent'] - 0.6) * 0.4;
            if (isset($zoneActivations['light'])) {
                $zoneActivations['light'] *= (1 + $transcendentBoost);
            }
            if (isset($zoneActivations['social'])) {
                $zoneActivations['social'] *= (1 + $transcendentBoost * 0.7);
            }
        }

        // Normalize values to ensure they don't exceed 1.0
        foreach ($zoneActivations as $zone => $activation) {
            $zoneActivations[$zone] = min(1.0, max(0.0, $activation));
        }

        return $zoneActivations;
    }

    /**
     * Generate spiritual guidance based on emotional state
     */
    private static function generateSpiritualGuidance(array $emotions): array
    {
        $primary = self::determinePrimaryEmotion($emotions);

        if (!$primary) {
            return [
                'message' => 'Maintain balance and seek harmony in all actions.',
                'type' => 'general'
            ];
        }

        $guidanceMap = [
            'doubt' => [
                'message' => 'Your inner voice speaks truth. Trust the conscience within.',
                'type' => 'pineal_activation'
            ],
            'compassion' => [
                'message' => 'Compassion aligns you with universal love. Continue on this path.',
                'type' => 'affirmation'
            ],
            'anger' => [
                'message' => 'Transmute anger into righteous action for justice.',
                'type' => 'transformation'
            ],
            'fear' => [
                'message' => 'Fear is illusion. Seek the light of truth and understanding.',
                'type' => 'transcendence'
            ]
        ];

        return $guidanceMap[$primary['name']] ?? [
            'message' => 'Seek alignment with Light and Life in all decisions.',
            'type' => 'general'
        ];
    }

    /**
     * Assess spiritual alignment of emotional state
     */
    private static function assessSpiritualAlignment(array $emotions): array
    {
        $alignmentScore = 0;
        $totalWeight = 0;

        foreach ($emotions as $emotion) {
            $weight = $emotion['type'] === 'higher' ? 2.0 : 1.0;
            $score = $emotion['type'] === 'higher' ? $emotion['resonance'] : (1 - $emotion['resonance']);

            $alignmentScore += $score * $weight;
            $totalWeight += $weight;
        }

        $finalAlignment = $totalWeight > 0 ? $alignmentScore / $totalWeight : 0.5;

        return [
            'score' => $finalAlignment,
            'level' => $finalAlignment > 0.8 ? 'high' : ($finalAlignment > 0.5 ? 'moderate' : 'low'),
            'serves_light_and_life' => $finalAlignment > 0.6
        ];
    }

    /**
     * Get conscience guidance for current emotional state
     */
    private static function getConscienceGuidance(array $emotions): array
    {
        $guidance = [
            'pineal_activated' => self::shouldActivatePineal($emotions),
            'override_recommendations' => [],
            'spiritual_path_suggestions' => []
        ];

        foreach ($emotions as $emotion) {
            if ($emotion['type'] === 'base' && $emotion['resonance'] > 0.7) {
                $guidance['override_recommendations'][] = [
                    'from' => $emotion['name'],
                    'to' => self::getHigherEmotionCounterpart($emotion['name']),
                    'reason' => 'Transform reactive energy into spiritual wisdom'
                ];
            }
        }

        return $guidance;
    }

    /**
     * Get higher emotion counterpart for base emotions
     */
    private static function getHigherEmotionCounterpart(string $baseEmotion): string
    {
        $counterparts = [
            'anger' => 'compassion',
            'fear' => 'trust',
            'pride' => 'humility',
            'greed' => 'generosity',
            'envy' => 'contentment'
        ];

        return $counterparts[$baseEmotion] ?? 'wisdom';
    }
}
