<?php

namespace App\Actions;

use App\Models\Note;
use App\Models\NoteChunk;
use OpenAI;

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

        // Generate answer using OpenAI
        $client = OpenAI::client(config('services.openai.api_key'));

        $response = $client->chat()->create([
            'model' => 'gpt-3.5-turbo',
            'messages' => [
                ['role' => 'system', 'content' => 'You are a helpful assistant that answers questions based on the provided context. If the answer cannot be found in the context, say "I don\'t have enough information to answer that question."'],
                ['role' => 'user', 'content' => "Context:\n$context\n\nQuestion: $question"]
            ],
        ]);

        return $response->choices[0]->message->content;
    }
}
