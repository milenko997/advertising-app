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
            'title'         => 'required|string|min:5|max:255',
            'description'   => 'required|string|min:10|max:5000',
            'vehicle_type'  => 'required|in:truck,van,pickup,trailer,flatbed,refrigerator_truck,tanker,other',
            'payload'       => 'nullable|string|min:2|max:100',

            'availability'  => 'required|in:available,on_request',
            'price'         => 'nullable|string|max:100',
            'image'         => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
            'images'        => 'nullable|array|max:10',
            'images.*'      => 'image|mimes:jpeg,png,jpg,gif|max:10240',
            'phone'         => ['required', 'regex:/^\+?[0-9][0-9 \-\(\)\.]{5,19}$/'],
            'location'      => 'required|string|min:2|max:255',
            'category_id'   => 'required|exists:categories,id',
        ];
    }

    public function messages(): array
    {
        return [
            'title.min'         => 'The title must be at least 5 characters.',
            'description.min'   => 'The description must be at least 10 characters.',
            'description.max'   => 'The description may not exceed 5000 characters.',
            'vehicle_type.in'   => 'Please select a valid vehicle type.',
            'payload.min'       => 'Payload must be at least 2 characters (e.g. 10 tons).',

            'phone.regex'       => 'Enter a valid phone number (digits, spaces, +, -, parentheses only).',
            'location.min'      => 'Location must be at least 2 characters.',
            'images.max'        => 'You may upload at most 10 gallery photos.',
            'images.*.image'    => 'Each gallery file must be an image.',
            'images.*.mimes'    => 'Gallery images must be JPEG, PNG, or GIF.',
            'images.*.max'      => 'Each gallery image must not exceed 10 MB.',
            'image.max'         => 'The cover image must not be larger than 10 MB.',
            'image.uploaded'    => 'The image is too large to upload. Please use an image under 10 MB.',
        ];
    }
}
