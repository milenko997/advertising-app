<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class AdminCustomerController extends Controller
{
    public function index(\Illuminate\Http\Request $request)
    {
        $paginator = User::where('role', 'customer')->latest()->paginate(20);

        $customers = $paginator->getCollection()->map(fn ($u) => [
            'id'         => $u->id,
            'slug'       => $u->slug,
            'name'       => $u->name,
            'email'      => $u->email,
            'role'       => $u->role,
            'created_at' => $u->created_at->format('d.m.Y'),
        ])->values();

        if ($request->ajax() && !$request->hasHeader('X-Inertia')) {
            return response()->json([
                'customers' => $customers,
                'hasMore'   => $paginator->hasMorePages(),
            ]);
        }

        return Inertia::render('Admin/Customers/Index', [
            'customers' => [
                'data'         => $customers,
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
                'total'        => $paginator->total(),
            ],
        ]);
    }

    public function create()
    {
        // not needed
    }

    public function store()
    {
        // not needed
    }

    public function show()
    {
        // not needed
    }

    public function edit(User $customer)
    {
        return Inertia::render('Admin/Customers/Edit', [
            'customer' => [
                'id'    => $customer->id,
                'slug'  => $customer->slug,
                'name'  => $customer->name,
                'email' => $customer->email,
                'role'  => $customer->role,
            ],
        ]);
    }

    public function update(UpdateCustomerRequest $request, User $customer): RedirectResponse
    {
        $customer->update($request->only(['name', 'email', 'role']));

        return redirect()->route('admin.korisnici.index')->with('success', 'Korisnik je uspešno ažuriran.');
    }

    public function destroy(User $customer): RedirectResponse
    {
        $customer->delete();

        return redirect()->route('admin.korisnici.index')->with('success', 'Korisnik je uspešno obrisan.');
    }

    public function restore($id): RedirectResponse
    {
        $user = User::withTrashed()->with('advertisements')->findOrFail($id);

        if ($user->trashed()) {
            $user->restore();

            foreach ($user->advertisements as $post) {
                if ($post->trashed()) {
                    $post->restore();
                }
            }

            return redirect()->back()->with('success', 'Korisnik i njegovi oglasi su uspešno vraćeni.');
        }

        return redirect()->back()->with('info', 'Korisnik nije obrisan.');
    }
}
