<?php

namespace App\Models;

use App\Models\Confirmation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vaccine extends Model
{
    protected $table = 'vaccine';

    protected $fillable = [
        'code',
        'name',
        'protectsAgainst',
        'recommended_age_months',
        'image',
        'description',
        'vaccination_municipality',
        'dose',
    ];

    public function confirmations(): HasMany
    {
        return $this->hasMany(Confirmation::class, 'vaccine_id');
    }
}
