<?php

namespace Web3Codex\CodexCore\Models;

/**
 * TiuEvent Model
 *
 * This model represents events related to TIU (Tuning In Units) in the Codex system.
 * It is used to track various events, their types, and associated data.
 *
 * @property int $id
 * @property int $zone_id
 * @property int|null $agent_id
 * @property string $event_type
 * @property float $tiu
 * @property array $payload
 * @property array|null $result
 * @property \Illuminate\Support\Carbon|null $detected_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */

use Illuminate\Database\Eloquent\Model;

class TiuEvent extends Model
{
    protected $connection = 'codex';

    protected $table = 'tiu_events';

    protected $fillable = [
        'zone_id',     // ✅ proper FK
        'agent_id',    // ✅ who triggered the event
        'event_type',
        'tiu',
        'zone',        // ✅ zone name
        'payload',
        'result',
        'detected_at',
    ];

    protected $casts = [
        'tiu' => 'float',
        'payload' => 'array',
        'result' => 'array',
        'detected_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public $timestamps = true;

    protected $hidden = [
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
