<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AskQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        $note = $this->route('note');

        // Only authorize if the note's processing is complete
        return $note && $note->processing_complete;
    }

    public function rules(): array
    {
        return [
            'question' => [
                'required',
                'string',
                'max:1000',
            ],
        ];
    }
}
