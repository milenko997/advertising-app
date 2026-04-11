<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render('Contact');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'    => 'required|string|min:2|max:100',
            'email'   => 'required|email:rfc',
            'subject' => 'required|string|min:3|max:150',
            'message' => 'required|string|min:10|max:3000',
        ]);

        ContactMessage::create($request->only('name', 'email', 'subject', 'message'));

        return back()->with('success', 'Your message has been sent. We will get back to you shortly.');
    }
}
