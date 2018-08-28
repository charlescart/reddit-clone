<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DeletePostRequest extends UpdatePostRequest
{

    public function rules()
    {
        return [
            'id' => 'bail|required|numeric|exists:posts,id',
        ];
    }
}
