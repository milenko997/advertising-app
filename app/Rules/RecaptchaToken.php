<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Http;

class RecaptchaToken implements ValidationRule
{
    public function __construct(private string $action = 'submit') {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (app()->environment('testing')) {
            return;
        }

        $secret = config('services.recaptcha.secret');
        if (empty($secret) || empty($value)) {
            return;
        }

        $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret'   => $secret,
            'response' => $value,
            'remoteip' => request()->ip(),
        ]);

        $result = $response->json();

        if (empty($result['success']) || ($result['score'] ?? 0) < 0.5) {
            $fail('reCAPTCHA verifikacija nije uspela. Pokušajte ponovo.');
        }
    }
}
