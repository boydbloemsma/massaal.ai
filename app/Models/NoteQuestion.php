<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NoteQuestion extends Model
{
    use HasUuids;

    public function note(): BelongsTo
    {
        return $this->belongsTo(Note::class);
    }
}
