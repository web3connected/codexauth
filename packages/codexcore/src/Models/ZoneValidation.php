<?php

namespace Web3Codex\CodexCore\Models;

use Illuminate\Database\Eloquent\Model;

class ZoneValidation extends Model
{
    protected $connection = 'codex';

    protected $table = 'zone_validations';

    protected $fillable = [
        'zone_id',
        'agent_id',
        'status',
        'hash_value',
        'distance',
        'tolerance',
        'input_snapshot',
    ];

    protected $casts = [
        'hash_value' => 'integer',
        'distance' => 'float',
        'tolerance' => 'float',
        'input_snapshot' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $attributes = [
        'status' => 'pending',
        'hash_value' => 0,
        'distance' => 0.0,
        'tolerance' => 0.0,
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
