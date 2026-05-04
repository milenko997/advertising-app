<?php

namespace App\Http\Controllers;

use App\Mail\ContactFormMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        view()->share('meta', ['title' => 'Kontakt — ' . config('app.name'), 'url' => url('/kontakt')]);
        return Inertia::render('Contact');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|min:2|max:100',
            'email'   => 'required|email:rfc',
            'subject' => 'required|string|min:3|max:150',
            'message' => 'required|string|min:10|max:3000',
        ]);

        try {
            Mail::to('info@transporteri.rs')->queue(new ContactFormMail(
                $validated['name'],
                $validated['email'],
                $validated['subject'],
                $validated['message'],
            ));
        } catch (\Exception) {}

        return back()->with('success', 'Vaša poruka je poslata. Javićemo vam se uskoro.');
    }
}
