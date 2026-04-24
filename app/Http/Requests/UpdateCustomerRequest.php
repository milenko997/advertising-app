<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UpdateCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        $customer = $this->route('customer');
        $isEscalation = $this->input('role') === 'admin' && $customer && $customer->isCustomer();

        $rules = [
            'name'          => 'required|string|max:255',
            'email'         => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($customer)],
            'role'          => 'required|in:admin,customer',
            'phone'         => ['nullable', 'regex:/^\+?[0-9][0-9 \-\(\)\.]{5,19}$/'],
            'avatar'        => 'nullable|image|mimes:jpeg,png,jpg,gif|max:1900',
            'remove_avatar' => 'nullable|boolean',
        ];

        if ($isEscalation) {
            $rules['current_password'] = ['required', 'string'];
        }

        return $rules;
    }

    public function withValidator($validator): void
    {
        $customer = $this->route('customer');
        $isEscalation = $this->input('role') === 'admin' && $customer && $customer->isCustomer();

        if ($isEscalation) {
            $validator->after(function ($v) {
                if (!Hash::check($this->input('current_password'), $this->user()->password)) {
                    $v->errors()->add('current_password', 'Lozinka nije ispravna.');
                }
            });
        }
    }

    public function messages(): array
    {
        return [
            'phone.regex'              => 'Unesite ispravan broj telefona (cifre, razmaci, +, -, zagrade).',
            'current_password.required' => 'Morate uneti svoju lozinku da biste korisnika postavili za admina.',
        ];
    }
}
