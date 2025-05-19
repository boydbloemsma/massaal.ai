<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $dimensions = 1536; // openai
        if (app()->environment('local')) {
            $dimensions = 768; // ollama
        }

        Schema::create('note_chunks', function (Blueprint $table) use ($dimensions) {
            $table->uuid('id');
            $table->foreignUuid('note_id');
            $table->text('chunk');
            $table->vector('embedding', dimensions: $dimensions); //pgvector
            $table->timestamps();
        });
    }
};
