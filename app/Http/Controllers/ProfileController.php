<?php

namespace App\Http\Controllers;

use App\Jobs\DeleteUserDataJob;
use App\Mail\PasswordChangedMail;
use App\Models\User;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function __construct(private ImageService $imageService) {}

    public function show()
    {
        $user = auth()->user()->load('companyProfile');

        $cp = $user->companyProfile;

        return Inertia::render('Profile/Show', [
            'user' => [
                'id'              => $user->id,
                'name'            => $user->name,
                'email'           => $user->email,
                'phone'           => $user->phone,
                'avatar'          => $user->avatar,
                'account_type'    => $user->account_type ?? 'personal',
                'company_profile' => $cp ? [
                    'company_name' => $cp->company_name,
                    'pib'          => $cp->pib,
                    'maticni_broj' => $cp->maticni_broj,
                    'address'      => $cp->address,
                    'city'         => $cp->city,
                    'website'      => $cp->website,
                ] : null,
            ],
        ]);
    }

    public function update(Request $request)
    {
        $user        = auth()->user();
        $accountType = $request->input('account_type', 'personal');

        $rules = [
            'name'         => ['required', 'string', 'min:2', 'max:50', 'regex:/^[\pL\s\'\-]+$/u'],
            'email'        => 'required|email:rfc|max:255|unique:users,email,' . $user->id,
            'phone'        => ['nullable', 'regex:/^\+?[0-9][0-9 \-\(\)\.]{5,19}$/'],
            'avatar'       => 'nullable|image|mimes:jpeg,png,jpg,gif|max:1900',
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

        $request->validate($rules, [
            'name.min'    => 'Ime mora imati najmanje 2 karaktera.',
            'name.max'    => 'Ime ne sme imati više od 50 karaktera.',
            'name.regex'  => 'Ime sme sadržati samo slova, razmake, crtice i apostrofe.',
            'email.email' => 'Unesite ispravnu email adresu.',
            'phone.regex' => 'Unesite ispravan broj telefona (cifre, razmaci, +, -, zagrade).',
        ]);

        $user->name         = $request->name;
        $user->email        = $request->email;
        $user->phone        = $request->phone;
        $user->account_type = $accountType;

        if ($request->hasFile('avatar')) {
            $this->imageService->delete($user->avatar);
            $user->avatar = $this->imageService->store($request->file('avatar'), 'avatars');
        }

        if ($request->boolean('remove_avatar') && !$request->hasFile('avatar')) {
            $this->imageService->delete($user->avatar);
            $user->avatar = null;
        }

        $user->save();

        if ($accountType === 'company') {
            $user->companyProfile()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'company_name' => $request->company_name,
                    'pib'          => $request->pib,
                    'maticni_broj' => $request->maticni_broj,
                    'address'      => $request->address,
                    'city'         => $request->city,
                    'website'      => $request->website ?: null,
                ]
            );

            $user->slug = User::generateUniqueSlug($request->company_name, $user->id);
            $user->saveQuietly();
        }

        return back()->with('success', 'Profil je uspešno ažuriran.');
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password'         => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = auth()->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors(['current_password' => 'Trenutna lozinka nije ispravna.'])->withInput();
        }

        $user->update(['password' => Hash::make($request->password)]);

        try {
            Mail::to($user->email)->queue(new PasswordChangedMail($user->name));
        } catch (\Exception) {}

        return back()->with('password_success', 'Lozinka je uspešno promenjena.');
    }

    public function destroy(Request $request)
    {
        $request->validate(['password' => 'required|string']);

        $user = auth()->user();

        if (!Hash::check($request->password, $user->password)) {
            return back()->withErrors(['delete_password' => 'Lozinka nije ispravna.']);
        }

        $userId = $user->id;
        $name   = $user->name;
        $email  = $user->email;
        $avatar = $user->avatar;

        $user->delete();

        auth()->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        DeleteUserDataJob::dispatch($userId, $name, $email, $avatar);

        return redirect('/')->with('success', 'Vaš nalog je trajno obrisan.');
    }
}
