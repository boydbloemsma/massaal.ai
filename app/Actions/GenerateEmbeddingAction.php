<?php

namespace App\Actions;

use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;

class GenerateEmbeddingAction
{
    public function handle(string $text): array
    {
        $provider = [Provider::OpenAI, 'text-embedding-3-small'];
        if (app()->environment('local')) {
            $provider = [Provider::Ollama, 'nomic-embed-text'];
        }

        $response = Prism::embeddings()
            ->using(...$provider)
            ->fromInput($text)
            ->asEmbeddings();

        return $response->embeddings[0]->embedding;
    }
}
