<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Note extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'title',
        'total_chunks',
        'processing_complete',
    ];

    public function chunks(): HasMany
    {
        return $this->hasMany(NoteChunk::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(NoteQuestion::class);
    }
}
