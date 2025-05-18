<?php

namespace App\Http\Controllers;

use App\Actions\ChunkTextAction;
use App\Actions\GenerateEmbeddingAction;
use App\Http\Requests\ProcessNoteRequest;
use App\Models\Note;
use App\Models\NoteChunk;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TextProcessorsController extends Controller
{
    public function process(
        ProcessNoteRequest $request,
        ChunkTextAction $chunkTextAction,
        GenerateEmbeddingAction $generateEmbeddingAction
    )
    {
        try {
            // Read the file content
            $content = file_get_contents($request->file('text_file')->path());

            // Create a new note
            $note = Note::create([
                'title' => $request->title,
            ]);

            // Chunk the text using the ChunkTextAction
            $chunks = $chunkTextAction->handle($content);

            // Generate embeddings and save chunks
            foreach ($chunks as $index => $chunk) {
                $embedding = $generateEmbeddingAction->handle($chunk);

                NoteChunk::create([
                    'note_id' => $note->id,
                    'chunk' => $chunk,
                    'embedding' => $embedding,
                ]);

                if ($index > 2) {
                    break;
                }
            }

            return Inertia::location(route('notes.show', $note, false) . '?success=' . urlencode('Text processed successfully! ' . count($chunks) . ' chunks created.'));
        } catch (\Exception $e) {
            return Inertia::location(route('home', [], false) . '?error=' . urlencode('Error processing text: ' . $e->getMessage()));
        }
    }
}
