<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

class RecaptchaToken implements ValidationRule
{
    /**
     * Run even when the token is missing, so bots can't skip the check by omitting it.
     */
    public bool $implicit = true;

    public function __construct(private string $action = 'submit') {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $secret = config('services.recaptcha.secret');
        if (empty($secret)) {
            return;
        }

        if (!is_string($value) || $value === '') {
            $fail('reCAPTCHA verifikacija nije uspela. Osvežite stranicu i pokušajte ponovo.');
            return;
        }

        try {
            $result = Http::asForm()->timeout(5)->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret'   => $secret,
                'response' => $value,
                'remoteip' => request()->ip(),
            ])->json();
        } catch (ConnectionException) {
            $result = null;
        }

        if (
            empty($result['success'])
            || ($result['action'] ?? null) !== $this->action
            || ($result['score'] ?? 0) < 0.5
        ) {
            $fail('reCAPTCHA verifikacija nije uspela. Pokušajte ponovo.');
        }
    }
}
