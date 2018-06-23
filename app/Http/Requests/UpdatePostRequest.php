<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePostRequest extends CreatePostRequest
{

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title' => 'bail|required|max:100',
            'description' => 'bail|required|max:10000',
            'slug' => 'bail|required|max:1000',
        ];
    }

}
