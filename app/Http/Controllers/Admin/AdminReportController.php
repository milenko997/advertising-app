<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminReportController extends Controller
{
    public function index(Request $request)
    {
        $paginator = Report::with(['advertisement', 'reporter'])->latest()->paginate(20);

        $reports = $paginator->getCollection()->map(fn ($r) => [
            'id'       => $r->id,
            'type'     => $r->type,
            'label'    => Report::typeLabels()[$r->type] ?? $r->type,
            'resolved' => (bool) $r->resolved,
            'created_at' => $r->created_at->format('d.m.Y H:i'),
            'reporter' => $r->reporter ? [
                'id'   => $r->reporter->id,
                'name' => $r->reporter->name,
            ] : null,
            'advertisement' => $r->advertisement ? [
                'id'    => $r->advertisement->id,
                'title' => $r->advertisement->title,
                'slug'  => $r->advertisement->slug,
            ] : null,
        ])->values();

        if ($request->ajax() && !$request->hasHeader('X-Inertia')) {
            return response()->json([
                'reports' => $reports,
                'hasMore' => $paginator->hasMorePages(),
            ]);
        }

        return Inertia::render('Admin/Reports/Index', [
            'reports' => [
                'data'         => $reports,
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
                'total'        => $paginator->total(),
            ],
        ]);
    }

    public function resolve(Report $report)
    {
        $report->update(['resolved' => !$report->resolved]);

        return back()->with('success', $report->resolved ? 'Prijava je označena kao rešena.' : 'Prijava je ponovo otvorena.');
    }

    public function destroy(Report $report)
    {
        $report->delete();

        return back()->with('success', 'Prijava je obrisana.');
    }
}
