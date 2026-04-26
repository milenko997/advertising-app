<?php

namespace App\Http\Controllers;

use App\Models\Advertisement;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function store(Request $request, Advertisement $advertisement)
    {
        $request->validate([
            'type' => 'required|in:wrong_category,duplicate_spam,against_rules,ignore_user',
        ]);

        if (Auth::check()) {
            if ($advertisement->user_id === Auth::id()) {
                return back()->withErrors(['type' => 'Ne možete prijaviti sopstveni oglas.']);
            }

            Report::updateOrCreate(
                [
                    'advertisement_id' => $advertisement->id,
                    'reporter_id'      => Auth::id(),
                    'type'             => $request->type,
                ],
                ['resolved' => false]
            );
        } else {
            Report::create([
                'advertisement_id' => $advertisement->id,
                'reporter_id'      => null,
                'type'             => $request->type,
                'resolved'         => false,
            ]);
        }

        return back()->with('success', 'Hvala vam. Vaša prijava je podneta.');
    }
}
