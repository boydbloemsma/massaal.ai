<?php

namespace App\Jobs;

use App\Actions\GenerateEmbeddingAction;
use App\Models\Note;
use App\Models\NoteChunk;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateChunkEmbeddingJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 60;

    public function __construct(
        protected Note $note,
        protected string $chunk
    ) {}

    public function handle(GenerateEmbeddingAction $generateEmbeddingAction): void
    {
        $embedding = $generateEmbeddingAction->handle($this->chunk);

        $this->note->chunks()->create([
            'chunk' => $this->chunk,
            'embedding' => $embedding,
        ]);
    }
}
