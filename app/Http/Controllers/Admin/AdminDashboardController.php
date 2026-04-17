<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Queries\DashboardStatsQuery;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function __construct(private DashboardStatsQuery $query) {}

    public function index()
    {
        $data = $this->query->get();

        return Inertia::render('Admin/Dashboard', $data);
    }
}
