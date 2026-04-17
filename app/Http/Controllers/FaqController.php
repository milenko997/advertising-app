<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class FaqController extends Controller
{
    public function index()
    {
        view()->share('meta', ['title' => 'Česta pitanja — ' . config('app.name'), 'url' => url('/cesta-pitanja')]);
        return Inertia::render('Faq');
    }

    public function terms()
    {
        view()->share('meta', ['title' => 'Uslovi korišćenja — ' . config('app.name'), 'url' => url('/uslovi-koriscenja')]);
        return Inertia::render('Terms');
    }

    public function privacy()
    {
        view()->share('meta', ['title' => 'Politika privatnosti — ' . config('app.name'), 'url' => url('/politika-privatnosti')]);
        return Inertia::render('Privacy');
    }

    public function about()
    {
        view()->share('meta', ['title' => 'O nama — ' . config('app.name'), 'url' => url('/o-nama')]);
        return Inertia::render('About');
    }
}
