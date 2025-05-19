<?php

namespace App\Actions;

use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;

class GenerateEmbeddingAction
{
    public function handle(string $text): array
    {
        $response = Prism::embeddings()
            ->using(Provider::OpenAI, 'text-embedding-3-small')
            ->fromInput($text)
            ->asEmbeddings();

        return $response->embeddings[0]->embedding;
    }
}
