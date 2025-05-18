<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NoteChunk extends Model
{
    protected $fillable = [
        'note_id',
        'chunk',
        'embedding',
    ];

    protected $casts = [
        'embedding' => 'array',
    ];

    public function note(): BelongsTo
    {
        return $this->belongsTo(Note::class);
    }
}
