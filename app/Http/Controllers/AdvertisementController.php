<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAdvertisementRequest;
use App\Http\Requests\UpdateAdvertisementRequest;
use App\Models\Advertisement;
use App\Models\Category;
use App\Services\ImageService;
use App\Services\SlugService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdvertisementController extends Controller
{
    public function publicIndex(Request $request)
    {
        $search = $request->get('search');

        $ads = Advertisement::with('user', 'category')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', '%' . $search . '%')
                      ->orWhere('description', 'like', '%' . $search . '%')
                      ->orWhere('location', 'like', '%' . $search . '%')
                      ->orWhereHas('category', function ($q) use ($search) {
                          $q->where('name', 'like', '%' . $search . '%');
                      });
                });
            })
            ->latest()
            ->get();

        $user = auth()->user();

        return view('advertisements.public-index', compact('ads', 'user', 'search'));
    }

    public function userIndex()
    {
        $ads = Advertisement::with('category')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return view('advertisements.user-index', compact('ads'));
    }

    public function create()
    {
        $categories = Category::all();
        return view('advertisements.create', compact('categories'));
    }

    public function store(StoreAdvertisementRequest $request)
    {
        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = ImageService::store($request->file('image'));
        }

        Advertisement::create([
            'user_id'     => Auth::id(),
            'title'       => $request->title,
            'slug'        => SlugService::generate($request->title),
            'description' => $request->description,
            'price'       => $request->price,
            'condition'   => $request->condition,
            'image'       => $imagePath,
            'phone'       => $request->phone,
            'location'    => $request->location,
            'category_id' => $request->category_id,
        ]);

        return redirect()->route('advertisements.user')->with('success', 'Advertisement created successfully.');
    }

    public function show($slug)
    {
        $ad = Advertisement::with('user', 'category')->where('slug', $slug)->firstOrFail();
        return view('advertisements.show', compact('ad'));
    }

    public function edit($slug)
    {
        $ad = Advertisement::where('slug', $slug)->firstOrFail();
        $this->authorize('update', $ad);

        $categories = Category::all();
        return view('advertisements.edit', compact('ad', 'categories'));
    }

    public function update(UpdateAdvertisementRequest $request, $slug)
    {
        $ad = Advertisement::where('slug', $slug)->firstOrFail();
        $this->authorize('update', $ad);

        $ad->title       = $request->title;
        $ad->description = $request->description;
        $ad->price       = $request->price;
        $ad->condition   = $request->condition;
        $ad->phone       = $request->phone;
        $ad->location    = $request->location;
        $ad->category_id = $request->category_id;

        if ($request->title !== $ad->getOriginal('title')) {
            $ad->slug = SlugService::generate($request->title, $ad->id);
        }

        if ($request->hasFile('image')) {
            ImageService::delete($ad->image);
            $ad->image = ImageService::store($request->file('image'));
        }

        $ad->save();

        return redirect()->route('advertisements.show', $ad->slug)->with('success', 'Advertisement updated successfully.');
    }

    public function destroy($id)
    {
        $ad = Advertisement::findOrFail($id);
        $this->authorize('delete', $ad);

        $ad->delete();

        return redirect()->route('advertisements.user')->with('success', 'Advertisement deleted successfully.');
    }

    public function trash()
    {
        $ads = Advertisement::onlyTrashed()
            ->with('category')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return view('advertisements.trash', compact('ads'));
    }

    public function forceDelete($id)
    {
        $ad = Advertisement::onlyTrashed()->findOrFail($id);
        $this->authorize('forceDelete', $ad);

        $ad->forceDelete();

        return redirect()->route('advertisements.trash')->with('success', 'Advertisement permanently deleted.');
    }

    public function restore($id)
    {
        $ad = Advertisement::onlyTrashed()->findOrFail($id);
        $this->authorize('restore', $ad);

        $ad->restore();

        return redirect()->route('advertisements.trash')->with('success', 'Advertisement restored successfully.');
    }

    public function byCategory(string $parent, ?string $child = null)
    {
        $parentCategory = Category::where('slug', $parent)->firstOrFail();

        if ($child) {
            $category = Category::where('slug', $child)
                ->where('parent_id', $parentCategory->id)
                ->firstOrFail();
        } else {
            $category = $parentCategory;
        }

        $advertisements = $category->advertisements()->with('user', 'category')->latest()->get();

        return view('advertisements.by-category', compact('category', 'advertisements'));
    }
}
