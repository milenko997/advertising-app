<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\WelcomeMail;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     *
     * @return \Illuminate\View\View
     */
    public function create()
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $accountType = $request->input('account_type', 'personal');

        $rules = [
            'name'         => ['required', 'string', 'min:2', 'max:50', 'regex:/^[\pL\s\'\-]+$/u'],
            'email'        => ['required', 'string', 'email', 'max:255', Rules\Rule::unique('users')->whereNull('deleted_at')],
            'password'     => ['required', 'confirmed', Rules\Password::defaults()],
            'account_type' => ['sometimes', 'string', 'in:personal,company'],
        ];

        if ($accountType === 'company') {
            $rules['company_name'] = ['required', 'string', 'max:255'];
            $rules['pib']          = ['required', 'string', 'max:20'];
            $rules['maticni_broj'] = ['required', 'string', 'max:20'];
            $rules['address']      = ['required', 'string', 'max:255'];
            $rules['city']         = ['required', 'string', 'max:100'];
            $rules['website']      = ['nullable', 'url', 'max:255'];
        }

        $validated = $request->validate($rules);

        $user = User::create([
            'name'         => trim($validated['name']),
            'email'        => $validated['email'],
            'password'     => Hash::make($validated['password']),
            'account_type' => $accountType,
        ]);

        if ($accountType === 'company') {
            $user->companyProfile()->create([
                'company_name' => $validated['company_name'],
                'pib'          => $validated['pib'],
                'maticni_broj' => $validated['maticni_broj'],
                'address'      => $validated['address'],
                'city'         => $validated['city'],
                'website'      => $validated['website'] ?? null,
            ]);

            $user->slug = User::generateUniqueSlug($validated['company_name'], $user->id);
            $user->saveQuietly();
        }

        event(new Registered($user));

        Auth::login($user);

        try {
            Mail::to($user->email)->queue(new WelcomeMail($user->name));
        } catch (\Exception) {}

        return redirect()->intended('/');
    }
}
