<?php

namespace App\Models;

use App\Models\Confirmation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
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

    /** Legacy single-child relation (kept for backward compat) */
    public function child(): BelongsTo
    {
        return $this->belongsTo(Children::class, 'child_id');
    }

    /** Many children via pivot */
    public function children(): BelongsToMany
    {
        return $this->belongsToMany(Children::class, 'child_parent', 'parent_id', 'child_id')
                    ->withTimestamps();
    }

    public function confirmations(): HasMany
    {
        return $this->hasMany(Confirmation::class, 'parent_id');
    }
}
