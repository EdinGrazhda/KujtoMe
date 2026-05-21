<?php

namespace App\Models;

use App\Models\Confirmation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Children extends Model
{
    protected $table = 'children';

    protected $fillable = [
        'name',
        'surname',
        'date_of_birth',
        'gender',
        'personal_number',
        'blood_type',
        'allergies',
        'chronic_diseases',
    ];

    public function parents(): HasMany
    {
        return $this->hasMany(Parents::class, 'child_id');
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
