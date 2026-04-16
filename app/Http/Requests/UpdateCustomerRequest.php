<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'name'          => 'required|string|max:255',
            'email'         => 'required|email|max:255',
            'role'          => 'required|in:admin,customer',
            'phone'         => ['nullable', 'regex:/^\+?[0-9][0-9 \-\(\)\.]{5,19}$/'],
            'avatar'        => 'nullable|image|mimes:jpeg,png,jpg,gif|max:1900',
            'remove_avatar' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'phone.regex' => 'Unesite ispravan broj telefona (cifre, razmaci, +, -, zagrade).',
        ];
    }
}
