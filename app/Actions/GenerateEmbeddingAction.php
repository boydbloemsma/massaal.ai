<?php

namespace App\Actions;

use OpenAI;

class GenerateEmbeddingAction
{
    public function handle(string $text): array
    {
        $client = OpenAI::client(config('services.openai.api_key'));

        $response = $client->embeddings()->create([
            'model' => 'text-embedding-3-small',
            'input' => $text,
        ]);

        return $response->embeddings[0]->embedding;
    }
}
