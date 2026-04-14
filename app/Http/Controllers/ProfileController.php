<?php

namespace App\Http\Controllers;

use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function show()
    {
        $user = auth()->user();
        return Inertia::render('Profile/Show', [
            'user' => [
                'id'     => $user->id,
                'name'   => $user->name,
                'email'  => $user->email,
                'phone'  => $user->phone,
                'avatar' => $user->avatar,
            ],
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'name'   => 'required|string|min:2|max:255',
            'email'  => 'required|email:rfc,dns|max:255|unique:users,email,' . $user->id,
            'phone'  => ['nullable', 'regex:/^\+?[0-9][0-9 \-\(\)\.]{5,19}$/'],
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:1900',
        ], [
            'name.min'    => 'Ime mora imati najmanje 2 karaktera.',
            'email.email' => 'Unesite ispravnu email adresu.',
            'phone.regex' => 'Unesite ispravan broj telefona (cifre, razmaci, +, -, zagrade).',
        ]);

        $user->name  = $request->name;
        $user->email = $request->email;
        $user->phone = $request->phone;

        if ($request->hasFile('avatar')) {
            ImageService::delete($user->avatar);
            $user->avatar = ImageService::store($request->file('avatar'), 'avatars');
        }

        if ($request->boolean('remove_avatar') && !$request->hasFile('avatar')) {
            ImageService::delete($user->avatar);
            $user->avatar = null;
        }

        $user->save();

        return back()->with('success', 'Profil je uspešno ažuriran.');
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password'         => 'required|string|min:8|confirmed',
        ]);

        $user = auth()->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors(['current_password' => 'Trenutna lozinka nije ispravna.'])->withInput();
        }

        $user->update(['password' => Hash::make($request->password)]);

        return back()->with('password_success', 'Lozinka je uspešno promenjena.');
    }
}
