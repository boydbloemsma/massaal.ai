<?php

namespace App\Http\Controllers;

use App\Actions\AnswerQuestionAction;
use App\Actions\ChunkTextAction;
use App\Actions\GenerateEmbeddingAction;
use App\Http\Requests\AskQuestionRequest;
use App\Http\Requests\ProcessNoteRequest;
use App\Jobs\GenerateChunkEmbeddingJob;
use App\Models\Note;
use App\Models\NoteChunk;
use App\Models\NoteQuestion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;
use Symfony\Component\HttpFoundation\StreamedResponse;

class NotesController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Note/Index');
    }

    public function store(
        ProcessNoteRequest $request,
        ChunkTextAction $chunkTextAction,
    ): RedirectResponse
    {
        $validated = $request->validated();

        $text = file_get_contents($request->file('text_file')->path());

        $chunks = $chunkTextAction->handle($text);

        // Create a new note with total chunks count
        $note = Note::create([
            'user_id' => auth()->id(),
            'title' => $validated['title'],
            'total_chunks' => count($chunks),
            'processing_complete' => false,
        ]);

        // Create note chunks and dispatch jobs to generate embeddings
        foreach ($chunks as $chunk) {
            GenerateChunkEmbeddingJob::dispatch($note, $chunk);
        }

        return redirect()->route('notes.show', $note);
    }

    public function show(Note $note): Response
    {
        Gate::authorize('view', $note);

        // Load the note's questions with latest first
        $noteQuestions = $note->questions()->oldest()->get()->map(function ($question) {
            return [
                'id' => $question->id,
                'question' => $question->question,
                'answer' => $question->answer,
                'created_at' => $question->created_at,
            ];
        });

        // Calculate processing progress
        $processedChunksCount = $note->chunks()->count();
        $totalChunks = $note->total_chunks;
        $progress = $totalChunks > 0 ? round(($processedChunksCount / $totalChunks) * 100) : 100;

        return Inertia::render('Note/Show', [
            'note' => [
                'id' => $note->id,
                'title' => $note->title,
                'created_at' => $note->created_at,
                'processing_complete' => $note->processing_complete,
                'processing_progress' => $progress,
                'processed_chunks' => $processedChunksCount,
                'total_chunks' => $totalChunks,
            ],
            'noteQuestions' => $noteQuestions,
        ]);
    }

    public function askQuestion(
        AskQuestionRequest $request,
        Note $note,
        GenerateEmbeddingAction $generateEmbeddingAction
    ): StreamedResponse
    {
        Gate::authorize('ask', $note);

        $question = $request->input('question');

        $questionEmbedding = $generateEmbeddingAction->handle($question);

        $relevantChunks = NoteChunk::query()
            ->where('note_id', $note->id)
            ->orderByRaw('embedding <=> ?::vector', [json_encode($questionEmbedding)])
            ->limit(3)
            ->get();

        // Combine the chunks into context
        $context = $relevantChunks->pluck('chunk')->implode("\n\n");

        return response()->eventStream(function () use ($note, $context, $question) {
            $provider = [Provider::OpenAI, 'gpt-3.5-turbo'];
            if (app()->environment('local')) {
                $provider = [Provider::Ollama, 'llama3.2'];
            }

            $stream = Prism::text()
                ->using(...$provider)
                ->withSystemPrompt("Respond using only the context. Be as brief as possible. If the answer isn't in the context, say: 'Not enough info.'")
                ->withPrompt("Context:\n$context\n\nQuestion: $question")
                ->asStream();

            $answer = '';
            foreach ($stream as $chunk) {
                $answer .= $chunk->text;
                echo $chunk->text;

                ob_flush();
                flush();
            }

            // Store the question in the database
            NoteQuestion::create([
                'note_id' => $note->id,
                'question' => $question,
                'answer' => $answer,
            ]);
        });
    }

    public function destroy(Note $note): RedirectResponse
    {
        Gate::authorize('delete', $note);

        $note->delete();

        return redirect()->route('dashboard')->with('success', 'Note deleted successfully.');
    }
}
