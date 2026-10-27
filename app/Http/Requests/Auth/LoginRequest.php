<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use App\Rules\RecaptchaToken;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Bcrypt hash checked when the email is unknown, so both failure paths take the same time.
     */
    private const DUMMY_HASH = '$2y$10$198Ht5WOyvXN2Y0Zyz4sb.tA3/FVk3EE0HDbMXsQyp4pjK4xcXqSO';

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'email'            => ['required', 'string', 'email'],
            'password'         => ['required', 'string'],
            'recaptcha_token'  => [new RecaptchaToken('login')],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @return void
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate()
    {
        $this->ensureIsNotRateLimited();

        $user = User::where('email', $this->input('email'))->first();

        // Same message (and a hash check either way) so the form doesn't reveal which emails have accounts.
        $passwordMatches = Hash::check($this->input('password'), $user?->password ?? self::DUMMY_HASH);

        if (! $user || ! $passwordMatches) {
            RateLimiter::hit($this->throttleKey());
            throw ValidationException::withMessages([
                'email' => 'Pogrešna email adresa ili lozinka.',
            ]);
        }

        Auth::login($user, $this->boolean('remember'));

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @return void
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited()
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => "Previše pokušaja prijave. Pokušajte ponovo za {$seconds} sekundi.",
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     *
     * @return string
     */
    public function throttleKey()
    {
        return Str::lower($this->input('email')).'|'.$this->ip();
    }
}
