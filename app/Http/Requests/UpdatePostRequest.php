<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePostRequest extends CreatePostRequest
{

    public function authorize()
    {
//        $this->user()->only('name', 'id'); /*Instancia del user logeado*/
//        $this->post->only('title'); /*Instancia del Post por el Model Binding*/
        return ($this->user()->id == $this->post->user_id);
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
