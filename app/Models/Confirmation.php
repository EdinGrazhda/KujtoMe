<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Confirmation extends Model
{
    protected $table = 'confirmation';
    
    protected $fillable = ['parent_id', 'child_id', 'vaccine_id', 'status'];

    public function child(): BelongsTo
    {
        return $this->belongsTo(Children::class, 'child_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Parents::class, 'parent_id');
    }

    public function vaccine(): BelongsTo
    {
        return $this->belongsTo(Vaccine::class, 'vaccine_id');
    }
}
