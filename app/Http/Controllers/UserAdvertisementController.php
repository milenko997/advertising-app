<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\HasPagination;
use App\Http\Requests\StoreAdvertisementRequest;
use App\Http\Requests\UpdateAdvertisementRequest;
use App\Http\Resources\AdvertisementResource;
use App\Models\Advertisement;
use App\Models\AdvertisementImage;
use App\Models\Category;
use App\Services\ImageService;
use App\Services\SlugService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Inertia;

class UserAdvertisementController extends Controller
{
    use HasPagination;

    public function __construct(
        private ImageService $imageService,
        private SlugService $slugService,
    ) {}

    public function userIndex(Request $request)
    {
        $paginator = Advertisement::with('category')
            ->where('user_id', Auth::id())
            ->orderByRaw("CASE WHEN expires_at IS NULL OR expires_at > ? THEN 0 ELSE 1 END", [now()])
            ->latest()
            ->paginate(21);

        $ads = $paginator->getCollection()->map(fn ($ad) => $this->formatAd($ad))->values();

        if ($request->ajax() && !$request->hasHeader('X-Inertia')) {
            return response()->json([
                'ads'     => $ads,
                'hasMore' => $paginator->hasMorePages(),
            ]);
        }

        return Inertia::render('Advertisements/UserIndex', [
            'ads' => $this->paginationData($paginator, $ads->values()->all()),
        ]);
    }

    public function create()
    {
        return Inertia::render('Advertisements/Create', [
            'categories' => Category::orderBy('name')->get(['id', 'name', 'slug', 'parent_id']),
        ]);
    }

    public function store(StoreAdvertisementRequest $request)
    {
        $key = 'ad-creation:' . Auth::id();

        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            $minutes = ceil($seconds / 60);
            return back()->withErrors(['rate_limit' => "Dostigli ste limit od 5 oglasa po satu. Pokušajte ponovo za {$minutes} min."]);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $this->imageService->store($request->file('image'));
        }

        $ad = Advertisement::create([
            'user_id'      => Auth::id(),
            'title'        => $request->title,
            'slug'         => $this->slugService->generate($request->title),
            'description'  => strip_tags($request->description),
            'payload'      => $request->payload ? strip_tags($request->payload) : null,

            'availability' => $request->availability,
            'price'        => $request->price,
            'image'        => $imagePath,
            'phone'        => $request->phone,
            'location'     => $request->location,
            'category_id'  => $request->category_id,
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $i => $file) {
                $ad->images()->create([
                    'path'  => $this->imageService->store($file),
                    'order' => $i,
                ]);
            }
        }

        RateLimiter::hit('ad-creation:' . Auth::id(), 3600);

        Cache::forget('nav_categories');

        return redirect()->route('advertisements.user')->with('success', 'Oglas je uspešno kreiran.');
    }

    public function edit($slug)
    {
        $ad = Advertisement::with('category', 'images')->where('slug', $slug)->firstOrFail();
        $this->authorize('update', $ad);

        return Inertia::render('Advertisements/Edit', [
            'ad'         => $this->formatAd($ad),
            'categories' => Category::orderBy('name')->get(['id', 'name', 'slug', 'parent_id']),
        ]);
    }

    public function update(UpdateAdvertisementRequest $request, $slug)
    {
        $ad = Advertisement::where('slug', $slug)->firstOrFail();

        $this->authorize('update', $ad);

        if ($request->hasFile('images') &&
            $ad->images()->count() + count($request->file('images')) > 10) {
            return back()->withErrors(['images' => 'Ne možete dodati više od 10 slika u galeriju.']);
        }

        $ad->title        = $request->title;
        $ad->description  = strip_tags($request->description);
        $ad->payload      = $request->payload ? strip_tags($request->payload) : null;
        $ad->availability = $request->availability;
        $ad->price        = $request->price;
        $ad->phone        = $request->phone;
        $ad->location     = $request->location;
        $ad->category_id  = $request->category_id;

        if ($request->title !== $ad->getOriginal('title')) {
            $ad->slug = $this->slugService->generate($request->title, $ad->id);
        }

        if ($request->hasFile('image')) {
            $this->imageService->delete($ad->image);
            $ad->image = $this->imageService->store($request->file('image'));
        } elseif ($request->input('remove_image')) {
            $this->imageService->delete($ad->image);
            $ad->image = null;
        }

        $ad->save();

        if ($request->hasFile('images')) {
            $nextOrder = $ad->images()->max('order') + 1;
            foreach ($request->file('images') as $i => $file) {
                $ad->images()->create([
                    'path'  => $this->imageService->store($file),
                    'order' => $nextOrder + $i,
                ]);
            }
        }

        Cache::forget('nav_categories');

        return redirect()->route('advertisements.show', $ad->slug)->with('success', 'Oglas je uspešno ažuriran.');
    }

    public function destroy($id)
    {
        $ad = Advertisement::findOrFail($id);
        $this->authorize('delete', $ad);
        $ad->delete();

        Cache::forget('nav_categories');

        return redirect()->route('advertisements.user')->with('success', 'Oglas je uspešno obrisan.');
    }

    public function destroyImage(AdvertisementImage $image)
    {
        $this->authorize('update', $image->advertisement);
        $this->imageService->delete($image->path);
        $image->delete();

        return back()->with('success', 'Slika je uklonjena.');
    }

    private function formatAd($ad): array
    {
        return AdvertisementResource::make($ad)->resolve();
    }

    private function formatAds($paginator): array
    {
        return $paginator->map(fn ($ad) => $this->formatAd($ad))->values()->all();
    }
}
