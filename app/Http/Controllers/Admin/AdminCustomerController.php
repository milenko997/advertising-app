<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

class AdminCustomerController extends Controller
{
    public function index()
    {
        $customers = User::where('role', 'customer')->get();
        return view('admin.customers.index', compact('customers'));
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
        return view('admin.customers.edit', compact('customer'));
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
