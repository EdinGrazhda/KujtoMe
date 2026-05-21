<?php

namespace App\Models;

use App\Models\Confirmation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Parents extends Model
{
    protected $table = 'parent';

    protected $fillable = [
        'name',
        'surname',
        'email',
        'phone_number',
        'personal_number',
        'child_id',
    ];

    public function child(): BelongsTo
    {
        return $this->belongsTo(Children::class, 'child_id');
    }

    public function confirmations(): HasMany
    {
        return $this->hasMany(Confirmation::class, 'parent_id');
    }
}
