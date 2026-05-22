<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class doctor extends Model
{
    protected $table = 'doctor';

    protected $fillable = [
        'user_id',
        'name',
        'surname',
        'email',
        'phone_number',
        'child_id',
        'status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function child(): BelongsTo
    {
        return $this->belongsTo(Children::class, 'child_id');
    }
}
