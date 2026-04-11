<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Advertisement;
use App\Models\Category;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminAdvertisementController extends Controller
{
    public function index()
    {
        $ads = Advertisement::with('category', 'user')->latest()->get()->map(fn ($ad) => [
            'id'          => $ad->id,
            'title'       => $ad->title,
            'description' => $ad->description,
            'price'       => $ad->price,
            'is_pinned'   => (bool) $ad->is_pinned,
            'created_at'  => $ad->created_at->format('d.m.Y'),
            'category'    => $ad->category ? ['name' => $ad->category->name] : null,
            'user'        => $ad->user ? ['name' => $ad->user->name] : null,
        ])->values();

        return Inertia::render('Admin/Advertisements/Index', compact('ads'));
    }

    public function edit(Advertisement $advertisement)
    {
        $categories = Category::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Advertisements/Edit', [
            'advertisement' => [
                'id'           => $advertisement->id,
                'title'        => $advertisement->title,
                'description'  => $advertisement->description,
                'vehicle_type' => $advertisement->vehicle_type,
                'payload'      => $advertisement->payload,
                'route'        => $advertisement->route,
                'availability' => $advertisement->availability,
                'price'        => $advertisement->price,
                'phone'        => $advertisement->phone,
                'location'     => $advertisement->location,
                'category_id'  => $advertisement->category_id,
                'image'        => $advertisement->image,
            ],
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Advertisement $advertisement)
    {
        $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'required|string',
            'vehicle_type' => 'nullable|string',
            'payload'      => 'nullable|string|max:255',
            'route'        => 'nullable|string|max:255',
            'availability' => 'required|in:available,on_request',
            'price'        => 'nullable|string|max:255',
            'phone'        => 'required|string|min:8|max:15',
            'location'     => 'required|string',
            'category_id'  => 'required|exists:categories,id',
            'image'        => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
        ]);

        $advertisement->title        = $request->title;
        $advertisement->description  = $request->description;
        $advertisement->vehicle_type = $request->vehicle_type;
        $advertisement->payload      = $request->payload;
        $advertisement->route        = $request->route;
        $advertisement->availability = $request->availability;
        $advertisement->price        = $request->price;
        $advertisement->phone        = $request->phone;
        $advertisement->location     = $request->location;
        $advertisement->category_id  = $request->category_id;

        if ($request->hasFile('image')) {
            ImageService::delete($advertisement->image);
            $advertisement->image = ImageService::store($request->file('image'));
        } elseif ($request->input('remove_image')) {
            ImageService::delete($advertisement->image);
            $advertisement->image = null;
        }

        $advertisement->save();

        return redirect()->route('admin.advertisements.index')->with('success', 'Advertisement updated.');
    }

    public function togglePin(Advertisement $advertisement)
    {
        $advertisement->update(['is_pinned' => !$advertisement->is_pinned]);

        return back()->with('success', $advertisement->is_pinned ? 'Advertisement pinned.' : 'Advertisement unpinned.');
    }

    public function destroy(Advertisement $advertisement)
    {
        $advertisement->delete();

        return redirect()->route('admin.advertisements.index')->with('success', 'Advertisement deleted.');
    }
}
