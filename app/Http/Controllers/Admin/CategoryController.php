<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View|\Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $paginator = Category::with('parent')->paginate(20);

        $categories = $paginator->getCollection()->map(fn ($c) => [
            'id'          => $c->id,
            'name'        => $c->name,
            'slug'        => $c->slug,
            'parent_id'   => $c->parent_id,
            'parent_name' => $c->parent?->name,
        ])->values();

        if ($request->ajax() && !$request->hasHeader('X-Inertia')) {
            return response()->json([
                'categories' => $categories,
                'hasMore'    => $paginator->hasMorePages(),
            ]);
        }

        return Inertia::render('Admin/Categories/Index', [
            'categories' => [
                'data'         => $categories,
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
                'total'        => $paginator->total(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View|\Illuminate\Http\Response
     */
    public function create()
    {
        $categories = Category::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Categories/Create', compact('categories'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|unique:categories|max:255',
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        Category::create($validatedData);

        return redirect()->route('admin.kategorije.index')->with('success', 'Kategorija je uspešno kreirana.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function show(Category $category)
    {
        // no needed for now
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View|\Illuminate\Http\Response
     */
    public function edit(Category $category)
    {
        $categories = Category::where('id', '!=', $category->id)->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Categories/Edit', [
            'category'   => [
                'id'        => $category->id,
                'slug'      => $category->slug,
                'name'      => $category->name,
                'parent_id' => $category->parent_id,
            ],
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Category $category)
    {
        $validatedData = $request->validate([
            'name' => 'required|unique:categories,name,' . $category->id . '|max:255',
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        if ($category->name !== $validatedData['name']) {
            $baseSlug = Str::slug($validatedData['name']);
            $slug = $baseSlug;
            $counter = 1;

            while (Category::where('slug', $slug)->where('id', '!=', $category->id)->exists()) {
                $slug = $baseSlug . '-' . $counter++;
            }

            $validatedData['slug'] = $slug;
        }

        $category->update($validatedData);

        return redirect()->route('admin.kategorije.index')->with('success', 'Kategorija je uspešno ažurirana.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Category $category)
    {
        $category->delete();

        return redirect()->route('admin.kategorije.index')->with('success', 'Kategorija je uspešno obrisana.');
    }
}
