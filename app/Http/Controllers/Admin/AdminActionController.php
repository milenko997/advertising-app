<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminAction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminActionController extends Controller
{
    public function index(Request $request)
    {
        $action = array_key_exists($request->input('action'), AdminAction::LABELS) ? $request->input('action') : '';

        $actions = AdminAction::query()
            ->when($action, fn ($q) => $q->where('action', $action))
            ->latest('id')
            ->paginate(50)
            ->withQueryString()
            ->through(fn ($a) => [
                'id'          => $a->id,
                'admin'       => $a->admin_name,
                'action'      => $a->action,
                'label'       => AdminAction::LABELS[$a->action] ?? $a->action,
                'description' => $a->description,
                'created_at'  => $a->created_at->format('d.m.Y H:i'),
            ]);

        return Inertia::render('Admin/Actions/Index', [
            'actions' => $actions,
            'action'  => $action,
            'labels'  => AdminAction::LABELS,
        ]);
    }
}
