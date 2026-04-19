<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Inertia\Inertia;

class AdminContactController extends Controller
{
    public function index()
    {
        $messages = ContactMessage::orderByRaw('read ASC, created_at DESC')
            ->paginate(20);

        $messages->getCollection()->transform(fn ($m) => [
            'id'         => $m->id,
            'name'       => $m->name,
            'email'      => $m->email,
            'subject'    => $m->subject,
            'message'    => $m->message,
            'read'       => $m->read,
            'date'       => $m->created_at->format('d.m.Y'),
            'time'       => $m->created_at->format('H:i'),
        ]);

        return Inertia::render('Admin/Messages/Index', [
            'messages' => $messages,
        ]);
    }

    public function markRead(ContactMessage $message)
    {
        $message->update(['read' => true]);

        return back()->with('success', 'Poruka je označena kao pročitana.');
    }

    public function destroy(ContactMessage $message)
    {
        $message->delete();

        return back()->with('success', 'Poruka je obrisana.');
    }
}
