<?php

namespace App\Models;

use App\Models\Confirmation;
use App\Models\doctor;
use App\Models\Parents;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Children extends Model
{
    protected $table = 'children';

    protected $fillable = [
        'user_id',
        'name',
        'surname',
        'date_of_birth',
        'gender',
        'personal_number',
        'blood_type',
        'allergies',
        'chronic_diseases',
    ];

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /** Legacy: parents linked via child_id column */
    public function parents(): HasMany
    {
        return $this->hasMany(Parents::class, 'child_id');
    }

    /** Many parents via pivot */
    public function parentsList(): BelongsToMany
    {
        return $this->belongsToMany(Parents::class, 'child_parent', 'child_id', 'parent_id')
                    ->withTimestamps();
    }

    public function doctors(): HasMany
    {
        return $this->hasMany(doctor::class, 'child_id');
    }

    public function confirmations(): HasMany
    {
        return $this->hasMany(Confirmation::class, 'child_id');
    }
}
