<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Note extends Model
{
    protected $fillable = [
        'user_id',
        'title',
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
