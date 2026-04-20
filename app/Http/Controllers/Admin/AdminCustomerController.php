<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\User;
use App\Notifications\ProfileUpdatedByAdminNotification;
use App\Services\ImageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminCustomerController extends Controller
{
    use \App\Http\Controllers\Concerns\HasPagination;
    public function __construct(private ImageService $imageService) {}

    public function index(\Illuminate\Http\Request $request)
    {
        $search = $request->input('search', '');

        $paginator = User::where('role', UserRole::Customer)
            ->when($search, fn ($q) => $q->where(fn ($q) => $q
                ->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
            ))
            ->latest()
            ->paginate(20);

        $customers = $paginator->getCollection()->map(fn ($u) => [
            'id'         => $u->id,
            'slug'       => $u->slug,
            'name'       => $u->name,
            'email'      => $u->email,
            'role'       => $u->role->value,
            'avatar'     => $u->avatar,
            'created_at' => $u->created_at->format('d.m.Y'),
        ])->values();

        if ($request->ajax() && !$request->hasHeader('X-Inertia')) {
            return response()->json([
                'customers' => $customers,
                'hasMore'   => $paginator->hasMorePages(),
                'search'    => $search,
            ]);
        }

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $this->paginationData($paginator, $customers->values()->all()),
            'search'    => $search,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Customers/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => ['required', 'email:rfc', 'max:255', Rule::unique('users', 'email')],
            'password' => 'required|string|min:8|confirmed',
            'role'     => 'required|in:admin,customer',
            'phone'    => ['nullable', 'regex:/^\+?[0-9][0-9 \-\(\)\.]{5,19}$/'],
        ]);

        User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => UserRole::from($validated['role']),
            'phone'    => $validated['phone'] ?? null,
        ]);

        return redirect()->route('admin.korisnici.index')->with('success', 'Korisnik je uspešno kreiran.');
    }

    public function edit(User $customer)
    {
        return Inertia::render('Admin/Customers/Edit', [
            'customer' => [
                'id'     => $customer->id,
                'slug'   => $customer->slug,
                'name'   => $customer->name,
                'email'  => $customer->email,
                'role'   => $customer->role,
                'phone'  => $customer->phone,
                'avatar' => $customer->avatar,
            ],
        ]);
    }

    public function update(UpdateCustomerRequest $request, User $customer): RedirectResponse
    {
        $validated = $request->validated();
        $customer->name  = $validated['name'];
        $customer->email = $validated['email'];
        $customer->phone = $validated['phone'] ?? null;

        if ($request->hasFile('avatar')) {
            $this->imageService->delete($customer->avatar);
            $customer->avatar = $this->imageService->store($request->file('avatar'), 'avatars');
        }

        if ($request->boolean('remove_avatar') && !$request->hasFile('avatar')) {
            $this->imageService->delete($customer->avatar);
            $customer->avatar = null;
        }

        $customer->role = \App\Enums\UserRole::from($validated['role']);
        $customer->save();

        $customer->notify(new ProfileUpdatedByAdminNotification());

        return redirect()->route('admin.korisnici.index')->with('success', 'Korisnik je uspešno ažuriran.');
    }

    public function destroy(User $customer): RedirectResponse
    {
        if ($customer->isAdmin()) {
            abort(403, 'Admin accounts cannot be deleted.');
        }

        $customer->delete();

        return redirect()->route('admin.korisnici.index')->with('success', 'Korisnik je uspešno obrisan.');
    }

    public function restore($id): RedirectResponse
    {
        $user = User::withTrashed()->with(['advertisements' => fn ($q) => $q->withTrashed()])->findOrFail($id);

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
