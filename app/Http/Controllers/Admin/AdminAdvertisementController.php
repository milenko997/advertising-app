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
    public function index(Request $request)
    {
        $paginator = Advertisement::with('category', 'user')->latest()->paginate(20);

        $ads = $paginator->getCollection()->map(fn ($ad) => [
            'id'          => $ad->id,
            'title'       => $ad->title,
            'description' => $ad->description,
            'price'       => $ad->price,
            'is_pinned'   => (bool) $ad->is_pinned,
            'created_at'  => $ad->created_at->format('d.m.Y'),
            'category'    => $ad->category ? ['name' => $ad->category->name] : null,
            'user'        => $ad->user ? ['name' => $ad->user->name] : null,
        ])->values();

        if ($request->ajax() && !$request->hasHeader('X-Inertia')) {
            return response()->json([
                'ads'     => $ads,
                'hasMore' => $paginator->hasMorePages(),
            ]);
        }

        return Inertia::render('Admin/Advertisements/Index', [
            'ads' => [
                'data'         => $ads,
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
                'total'        => $paginator->total(),
            ],
        ]);
    }

    public function edit(Advertisement $advertisement)
    {
        $advertisement->load('images');
        $categories = Category::orderBy('name')->get(['id', 'name', 'parent_id']);

        return Inertia::render('Admin/Advertisements/Edit', [
            'advertisement' => [
                'id'           => $advertisement->id,
                'title'        => $advertisement->title,
                'description'  => $advertisement->description,
                'payload'      => $advertisement->payload,
                'availability' => $advertisement->availability,
                'price'        => $advertisement->price,
                'phone'        => $advertisement->phone,
                'location'     => $advertisement->location,
                'category_id'  => $advertisement->category_id,
                'image'        => $advertisement->image,
                'images'       => $advertisement->images->map(fn ($img) => [
                    'id'    => $img->id,
                    'path'  => $img->path,
                    'order' => $img->order,
                ])->values(),
            ],
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Advertisement $advertisement)
    {
        $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'required|string',
            'payload'      => 'nullable|string|max:255',
            'availability' => 'required|in:available,on_request',
            'price'        => 'nullable|string|max:255',
            'phone'        => 'required|string|min:8|max:15',
            'location'     => 'required|string',
            'category_id'  => 'required|exists:categories,id',
            'image'        => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
            'images.*'     => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
        ]);

        $advertisement->title        = $request->title;
        $advertisement->description  = $request->description;
        $advertisement->payload      = $request->payload;
        $advertisement->availability = $request->availability;
        $advertisement->price        = $request->price;
        $advertisement->phone        = $request->phone;
        $advertisement->location     = $request->location;
        $advertisement->category_id  = $request->category_id;

        if ($request->hasFile('image')) {
            ImageService::delete($advertisement->image);
            $advertisement->image = ImageService::store($request->file('image'));
        } elseif ($request->input('remove_image') == '1') {
            ImageService::delete($advertisement->image);
            $advertisement->image = null;
        }

        $advertisement->save();

        if ($request->hasFile('images')) {
            $nextOrder = $advertisement->images()->max('order') + 1;
            foreach ($request->file('images') as $i => $file) {
                $advertisement->images()->create([
                    'path'  => ImageService::store($file),
                    'order' => $nextOrder + $i,
                ]);
            }
        }

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

    public function bulkAction(Request $request)
    {
        $request->validate([
            'action' => 'required|in:delete,pin,unpin',
            'ids'    => 'required|array|min:1',
            'ids.*'  => 'integer|exists:advertisements,id',
        ]);

        $ads = Advertisement::whereIn('id', $request->ids);

        match ($request->action) {
            'delete' => $ads->get()->each->delete(),
            'pin'    => $ads->update(['is_pinned' => true]),
            'unpin'  => $ads->update(['is_pinned' => false]),
        };

        $count = count($request->ids);
        $label = match ($request->action) {
            'delete' => "Deleted {$count} advertisement(s).",
            'pin'    => "Pinned {$count} advertisement(s).",
            'unpin'  => "Unpinned {$count} advertisement(s).",
        };

        return back()->with('success', $label);
    }
}
