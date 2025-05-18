<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProcessNoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'text_file' => ['required', 'file', 'mimes:txt'],
            'title' => ['required', 'string', 'max:255'],
        ];
    }
}
