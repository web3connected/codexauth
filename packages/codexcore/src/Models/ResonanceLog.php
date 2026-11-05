<?php

namespace Web3Codex\CodexCore\Models;

/**
 * ResonanceLog Model
 *
 * This model represents resonance logs in the Codex system.
 * It is used to track various resonance data, types, and values.
 *
 * @property int $id
 * @property int $zone_id
 * @property int $agent_id
 * @property string $type
 * @property float $value
 * @property array $context
 * @property \Illuminate\Support\Carbon|null $detected_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */

use Illuminate\Database\Eloquent\Model;

class ResonanceLog extends Model
{
    protected $connection = 'codex';

    protected $table = 'resonance_logs';

    protected $fillable = [
        'zone_id', // important fix!
        'agent_id', // important fix!
        'type',
        'value',
        'context',
        'detected_at',
    ];

    protected $casts = [
        'value' => 'float',
        'context' => 'array',
        'detected_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public $timestamps = true;

    protected $hidden = [
        // optional depending if you want admin dashboards
        'created_at',
        'updated_at',
    ];

    /** Relationships **/

    public function harmonicZone()
    {
        return $this->belongsTo(HarmonicZone::class, 'zone_id');
    }

    public function agent()
    {
        return $this->belongsTo(CodexAgent::class, 'agent_id');
    }
}
