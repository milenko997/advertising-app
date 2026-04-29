<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\HasPagination;
use App\Models\Advertisement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class AdvertisementTrashController extends Controller
{
    use HasPagination;

    public function trash(Request $request)
    {
        $paginator = Advertisement::onlyTrashed()
            ->where('user_id', Auth::id())
            ->latest()
            ->paginate(21);

        $ads = $paginator->getCollection()->map(fn ($ad) => [
            'id'          => $ad->id,
            'title'       => $ad->title,
            'description' => $ad->description,
            'image'       => $ad->image,
            'deleted_at'  => $ad->deleted_at->format('d.m.Y'),
        ])->values();

        if ($request->ajax() && !$request->hasHeader('X-Inertia')) {
            return response()->json([
                'ads'     => $ads,
                'hasMore' => $paginator->hasMorePages(),
            ]);
        }

        return Inertia::render('Advertisements/Trash', [
            'ads' => $this->paginationData($paginator, $ads->values()->all()),
        ]);
    }

    public function forceDelete($id)
    {
        $ad = Advertisement::onlyTrashed()->findOrFail($id);
        $this->authorize('forceDelete', $ad);
        $ad->forceDelete();

        Cache::forget('nav_categories');

        return redirect()->route('advertisements.trash')->with('success', 'Oglas je trajno obrisan.');
    }

    public function restore($id)
    {
        $ad = Advertisement::onlyTrashed()->findOrFail($id);
        $this->authorize('restore', $ad);
        $ad->restore();

        Cache::forget('nav_categories');

        return redirect()->route('advertisements.trash')->with('success', 'Oglas je uspešno vraćen.');
    }

    public function renew($id)
    {
        $ad = Advertisement::withTrashed()->findOrFail($id);
        $this->authorize('update', $ad);

        $ad->created_at = now();
        $ad->expires_at = now()->addDays(Advertisement::EXPIRY_DAYS);
        $ad->save();

        return back()->with('success', 'Oglas je obnovljen na još ' . Advertisement::EXPIRY_DAYS . ' dana.');
    }
}
