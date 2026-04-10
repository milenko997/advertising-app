<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class AdminCustomerController extends Controller
{
    public function index()
    {
        $customers = User::where('role', 'customer')->get()->map(fn ($u) => [
            'id'         => $u->id,
            'slug'       => $u->slug,
            'name'       => $u->name,
            'email'      => $u->email,
            'role'       => $u->role,
            'created_at' => $u->created_at->format('d.m.Y'),
        ])->values();

        return Inertia::render('Admin/Customers/Index', compact('customers'));
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

        return redirect()->route('admin.customers.index')->with('success', 'Customer updated successfully');
    }

    public function destroy(User $customer): RedirectResponse
    {
        $customer->delete();

        return redirect()->route('admin.customers.index')->with('success', 'Customer deleted successfully');
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

            return redirect()->back()->with('success', 'User and their advertisements restored successfully.');
        }

        return redirect()->back()->with('info', 'User is not deleted.');
    }
}
