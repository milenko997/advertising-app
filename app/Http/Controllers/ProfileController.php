<?php

namespace App\Http\Controllers;

use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function show()
    {
        return view('profile.show', ['user' => auth()->user()]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'name'   => 'required|string|max:255',
            'email'  => 'required|email|max:255|unique:users,email,' . $user->id,
            'phone'  => 'nullable|string|min:6|max:20',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:1900',
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

        return back()->with('success', 'Profile updated successfully.');
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password'         => 'required|string|min:8|confirmed',
        ]);

        $user = auth()->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors(['current_password' => 'The current password is incorrect.'])->withInput();
        }

        $user->update(['password' => Hash::make($request->password)]);

        return back()->with('password_success', 'Password changed successfully.');
    }
}
