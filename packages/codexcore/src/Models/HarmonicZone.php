<?php

namespace Web3Codex\CodexCore\Models;

/**
 * HarmonicZone Model
 *
 * This model represents harmonic zones in the Codex system.
 * It is used to track various properties of harmonic zones, including their range and average values.
 *
 * @property int $id
 * @property string $zone
 * @property int $min
 * @property int $max
 * @property float $average
 * @property int $sample_count
 * @property string|null $salt
 * @property float|null $tiu
 * @property string|null $version
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */

use Illuminate\Database\Eloquent\Model;

class HarmonicZone extends Model
{
    protected $connection = 'codex';

    protected $table = 'harmonic_zones';

    protected $fillable = [
        'zone',
        'min',
        'max',
        'average',
        'sample_count',
        'salt',
        'tiu',
        'version',
    ];

    protected $casts = [
        'min' => 'integer',
        'max' => 'integer',
        'average' => 'float',
        'sample_count' => 'integer',
        'tiu' => 'float',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public $timestamps = true;

    protected $hidden = [
        // Comment out if you later want created_at in admin panels
        'created_at',
        'updated_at',
    ];

    /** Relationships **/

    public function zoneValidations()
    {
        return $this->hasMany(ZoneValidation::class, 'zone_id');
    }

    public function resonanceLogs()
    {
        return $this->hasMany(ResonanceLog::class, 'zone_id');
    }
}
