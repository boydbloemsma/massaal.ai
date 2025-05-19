<?php

namespace App\Actions;

use App\Models\Note;
use App\Models\NoteChunk;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;

class AnswerQuestionAction
{
    public function handle(Note $note, string $question, array $embedding): string
    {
        // Find the most relevant chunks using vector similarity
        $relevantChunks = NoteChunk::query()
            ->where('note_id', $note->id)
            ->orderByRaw('embedding <=> ?::vector', [json_encode($embedding)])
            ->limit(3)
            ->get();

        // Combine the chunks into context
        $context = $relevantChunks->pluck('chunk')->implode("\n\n");

        // todo stream this
        $response = Prism::text()
            ->using(Provider::OpenAI, 'gpt-3.5-turbo')
            ->withSystemPrompt('You are a helpful assistant that answers questions based on the provided context. If the answer cannot be found in the context, say "I don\'t have enough information to answer that question."')
            ->withPrompt("Context:\n$context\n\nQuestion: $question")
            ->asText();

        return $response->text;
    }
}
