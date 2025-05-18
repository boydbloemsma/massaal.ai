<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('note_questions', function (Blueprint $table) {
            $table->uuid('id');
            $table->foreignUuid('note_id');
            $table->text('question');
            $table->text('answer');
            $table->timestamps();
        });
    }
};
