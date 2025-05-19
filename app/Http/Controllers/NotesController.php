<?php

namespace App\Http\Controllers;

use App\Actions\AnswerQuestionAction;
use App\Actions\ChunkTextAction;
use App\Actions\GenerateEmbeddingAction;
use App\Http\Requests\ProcessNoteRequest;
use App\Jobs\GenerateChunkEmbeddingJob;
use App\Models\Note;
use App\Models\NoteQuestion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotesController extends Controller
{
    public function index()
    {
        return Inertia::render('Note/Index');
    }

    public function store(
        ProcessNoteRequest $request,
        ChunkTextAction $chunkTextAction,
    ) {
        // Get the validated data
        $validated = $request->validated();

        // Create a new note
        $note = Note::create([
            'user_id' => auth()->id(),
            'title' => $validated['title'],
        ]);

        // Read the text file
        $text = file_get_contents($request->file('text_file')->path());

        // Chunk the text
        $chunks = $chunkTextAction->handle($text);

        // Create note chunks and dispatch jobs to generate embeddings
        foreach ($chunks as $chunk) {
            GenerateChunkEmbeddingJob::dispatch($note, $chunk);
        }

        return redirect()->route('notes.show', $note);
    }

    public function show(Note $note)
    {
        // Load the note's questions with latest first
        $noteQuestions = $note->questions()->oldest()->get()->map(function ($question) {
            return [
                'id' => $question->id,
                'question' => $question->question,
                'answer' => $question->answer,
                'created_at' => $question->created_at,
            ];
        });

        return Inertia::render('Note/Show', [
            'note' => [
                'id' => $note->id,
                'title' => $note->title,
                'created_at' => $note->created_at,
            ],
            'noteQuestions' => $noteQuestions,
        ]);
    }

    public function askQuestion(
        Request $request,
        Note $note,
        AnswerQuestionAction $answerQuestionAction,
        GenerateEmbeddingAction $generateEmbeddingAction
    )
    {
        $request->validate([
            'question' => 'required|string|max:1000',
        ]);

        $question = $request->input('question');

        $questionEmbedding = $generateEmbeddingAction->handle($question);
        $answer = $answerQuestionAction->handle($note, $question, $questionEmbedding);

        // Store the question and answer in the database
        NoteQuestion::create([
            'note_id' => $note->id,
            'question' => $question,
            'answer' => $answer,
        ]);

        // Redirect back to the note's show page with query parameters
        return redirect()->route('notes.show', $note);
    }
}
