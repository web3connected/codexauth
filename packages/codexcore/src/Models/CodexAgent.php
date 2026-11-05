<?php

namespace Web3Codex\CodexCore\Models;

/**
 * CodexAgent Model
 *
 * This model represents agents in the Codex system.
 * It is used to track agent configurations, roles, and synchronization.
 *
 * @property int $id
 * @property string $name
 * @property string $role
 * @property string $status
 * @property array $config
 * @property \Illuminate\Support\Carbon|null $last_sync_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */

use Illuminate\Database\Eloquent\Model;

class CodexAgent extends Model
{
    protected $connection = 'codex';

    protected $table = 'codex_agents';

    protected $fillable = [
        'name',
        'role',
        'status',
        'config',
        'last_sync_at',
    ];

    protected $casts = [
        'config' => 'array',
        'last_sync_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public $timestamps = true;

    /** Relationships **/

    public function tiuEvents()
    {
        return $this->hasMany(TiuEvent::class, 'agent_id');
    }

    public function resonanceLogs()
    {
        return $this->hasMany(ResonanceLog::class, 'agent_id');
    }
}
