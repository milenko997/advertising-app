<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class FaqController extends Controller
{
    public function index()
    {
        return Inertia::render('Faq');
    }
}
