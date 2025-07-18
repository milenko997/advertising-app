<?php

namespace App\Http\Controllers;

use App\Models\Advertisement;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class AdvertisementController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */

    public function publicIndex()
    {
        $ads = Advertisement::latest()->get();

        return view('advertisements.public-index', compact('ads'));
    }

    public function userIndex()
    {
        $ads = Advertisement::where('user_id', Auth::id())->latest()->get();
        return view('advertisements.user-index', compact('ads'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function create()
    {
        $categories = Category::all();
        return view('advertisements.create', compact('categories'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|string|max:255',
            'condition' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'phone' => 'required|string|min:8|max:15',
            'location' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('ads', 'public');
        }

        $baseSlug = Str::slug($request->title, '_');
        $slug = $baseSlug;
        $counter = 1;

        while(Advertisement::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '_' . $counter;
            $counter++;
        }

        Advertisement::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'slug' => $slug,
            'description' => $request->description,
            'price' => $request->price,
            'condition' => $request->condition,
            'image' => $imagePath,
            'phone' => $request->phone,
            'location' => $request->location,
            'category_id' => $request->category_id,
        ]);

        return redirect()->route('advertisements.user')->with('success', 'Advertisement created successfully.');
    }

    /**
     * Display the specified resource.
     *
     * @param  string  $slug
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function show($slug)
    {
        $ad = Advertisement::where('slug', $slug)->firstOrFail();
        return view('advertisements.show', compact('ad'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  string  $slug
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function edit($slug)
    {
        $ad = Advertisement::where('slug', $slug)->firstOrFail();
        $categories = Category::all();

        if ((int) Auth::id() !== (int) $ad->user_id) {
            abort(403, 'You do not have permission to edit this ad.');
        }

        return view('advertisements.edit', compact('ad', 'categories'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $slug
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $slug)
    {
        $ad = Advertisement::where('slug', $slug)->firstOrFail();

        if ((int) Auth::id() !== (int) $ad->user_id) {
            abort(403, 'You do not have permission to edit this ad.');
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|string|max:255',
            'condition' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'phone' => 'required|string|min:8|max:15',
            'location' => 'required|string',
            'category_id' => 'required|string|max:255',
        ]);

        $oldTitle = $ad->title;
        $ad->title = $request->title;
        $ad->description = $request->description;
        $ad->price = $request->price;
        $ad->condition = $request->condition;
        $ad->phone = $request->phone;
        $ad->location = $request->location;
        $ad->category_id = $request->category_id;

        if ($request->title !== $oldTitle) {
            $baseSlug = Str::slug($request->title, '_');
            $slugToCheck = $baseSlug;
            $counter = 1;

            while (Advertisement::where('slug', $slugToCheck)->where('id', '!=', $ad->id)->exists()) {
                $slugToCheck = $baseSlug . '_' . $counter++;
            }

            $ad->slug = $slugToCheck;
        }

        if ($request->hasFile('image')) {
            $ad->image = $request->file('image')->store('ads', 'public');
        }

        $ad->save();

        return redirect()->route('advertisements.show', $ad->slug)->with('success', 'Advertisement updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $ad = Advertisement::findOrFail($id);

        if ((int) Auth::id() !== (int) $ad->user_id) {
            abort(403, 'You do not have permission to edit this ad.');
        }

        $ad->delete();

        return redirect()->route('advertisements.user')->with('success', 'Advertisement deleted (soft) successfully.');
    }

    public function trash()
    {
        $ads = Advertisement::onlyTrashed()
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return view('advertisements.trash', compact('ads'));
    }

    public function forceDelete($id)
    {
        $ad = Advertisement::onlyTrashed()->findOrFail($id);

        $ad->forceDelete();

        return redirect()->route('advertisements.trash')->with('success', 'Advertisement deleted (soft) successfully.');
    }

    public function restore($id)
    {
        $ad = Advertisement::onlyTrashed()->findOrFail($id);

        $ad->restore();

        return redirect()->route('advertisements.trash')->with('success', 'Advertisement restored successfully.');
    }

    public function byCategory($slug)
    {
        $category = Category::where('slug', $slug)->firstOrFail();

        $advertisements = Advertisement::where('category_id', $category->id)
            ->latest()
            ->paginate(10);

        return view('advertisements.by-category', compact('advertisements', 'category'));
    }
}

