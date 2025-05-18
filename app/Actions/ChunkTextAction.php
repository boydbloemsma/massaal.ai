<?php

namespace App\Actions;

class ChunkTextAction
{
    public function handle(string $text): array
    {
        // Split text into sentences
        $sentences = preg_split('/(?<=[.!?])\s+/', $text, -1, PREG_SPLIT_NO_EMPTY);

        $chunks = [];
        $current_chunk = '';
        $word_count = 0;

        foreach ($sentences as $sentence) {
            // Count words in the sentence
            $sentence_word_count = str_word_count($sentence);

            // If adding this sentence would exceed the limit, start a new chunk
            if ($word_count + $sentence_word_count > 200 && $word_count > 0) {
                $chunks[] = trim($current_chunk);
                $current_chunk = '';
                $word_count = 0;
            }

            // Add the sentence to the current chunk
            $current_chunk .= $sentence . ' ';
            $word_count += $sentence_word_count;
        }

        // Add the last chunk if it's not empty
        if (trim($current_chunk) !== '') {
            $chunks[] = trim($current_chunk);
        }

        return $chunks;
    }
}
