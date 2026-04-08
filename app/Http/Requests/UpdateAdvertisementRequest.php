<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAdvertisementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'price'       => 'required|string|max:255',
            'condition'   => 'required|string',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:10240',
            'phone'       => 'required|string|min:8|max:15',
            'location'    => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
        ];
    }

    public function messages(): array
    {
        return [
            'image.max'      => 'The image must not be larger than 10 MB.',
            'image.uploaded' => 'The image is too large to upload. Please use an image under 10 MB.',
        ];
    }
}
