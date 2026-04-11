<?php

use App\Http\Controllers\Admin\AdminAdvertisementController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\Admin\AdminCustomerController;
use App\Http\Controllers\Admin\AdminReportController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\AdvertisementController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [AdvertisementController::class, 'publicIndex'])->name('home');

Route::get('/contact',  [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

Route::get('/faq',            [FaqController::class, 'index'])->name('faq');
Route::get('/terms',          [FaqController::class, 'terms'])->name('terms');
Route::get('/privacy-policy', [FaqController::class, 'privacy'])->name('privacy');

Route::get('/sitemap.xml',               [SitemapController::class, 'index'])->name('sitemap.index');
Route::get('/sitemap-static.xml',        [SitemapController::class, 'static'])->name('sitemap.static');
Route::get('/sitemap-categories.xml',    [SitemapController::class, 'categories'])->name('sitemap.categories');
Route::get('/sitemap-advertisements.xml', [SitemapController::class, 'advertisements'])->name('sitemap.advertisements');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');

    Route::get('/favorites', [FavoriteController::class, 'index'])->name('favorites.index');
    Route::post('/favorites/{advertisement}', [FavoriteController::class, 'toggle'])->name('favorites.toggle');
});

Route::middleware(['auth', 'verified', 'isCustomer'])->group(function () {
    Route::get('/my-advertisements', [AdvertisementController::class, 'userIndex'])->name('advertisements.user');
    Route::get('/advertisements/create', [AdvertisementController::class, 'create'])->name('advertisements.create');
    Route::post('/advertisements', [AdvertisementController::class, 'store'])->name('advertisements.store')->middleware('throttle:ad-creation');
    Route::get('/advertisements/edit/{slug}', [AdvertisementController::class, 'edit'])->name('advertisements.edit');
    Route::put('/advertisements/{slug}/update', [AdvertisementController::class, 'update'])->name('advertisements.update');
    Route::delete('/advertisements/{id}', [AdvertisementController::class, 'destroy'])->name('advertisements.destroy');
    Route::get('/advertisements/trash', [AdvertisementController::class, 'trash'])->name('advertisements.trash');
    Route::delete('/advertisements/force-delete/{id}', [AdvertisementController::class, 'forceDelete'])->name('advertisements.forceDelete');
    Route::patch('/advertisements/{id}/restore', [AdvertisementController::class, 'restore'])->name('advertisements.restore');
    Route::patch('/advertisements/{id}/renew', [AdvertisementController::class, 'renew'])->name('advertisements.renew');
    Route::delete('/advertisement-images/{image}', [AdvertisementController::class, 'destroyImage'])->name('advertisement-images.destroy');
});

Route::middleware(['auth', 'isAdmin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('/categories', CategoryController::class);
    Route::resource('/advertisements', AdminAdvertisementController::class)->except(['show', 'create', 'store']);
    Route::patch('/advertisements/{advertisement}/pin', [AdminAdvertisementController::class, 'togglePin'])->name('advertisements.pin');
    Route::post('/advertisements/bulk-action', [AdminAdvertisementController::class, 'bulkAction'])->name('advertisements.bulk');
    Route::resource('/customers', AdminCustomerController::class);
    Route::get('/reports', [AdminReportController::class, 'index'])->name('reports.index');
    Route::patch('/reports/{report}/resolve', [AdminReportController::class, 'resolve'])->name('reports.resolve');
    Route::delete('/reports/{report}', [AdminReportController::class, 'destroy'])->name('reports.destroy');
});

Route::post('/advertisements/{advertisement}/report', [ReportController::class, 'store'])->name('advertisements.report')->middleware('auth');

Route::get('/advertisements/{slug}', [AdvertisementController::class, 'show'])->name('advertisements.show');
Route::get('/user/{user}', [UserController::class, 'show'])->name('user.show');

// Reviews — login-gate sets intended URL so user returns here after login
Route::get('/user/{user}/review-login', [ReviewController::class, 'loginThenReview'])->middleware('auth')->name('reviews.login');
Route::post('/user/{user}/reviews', [ReviewController::class, 'store'])->middleware('auth')->name('reviews.store');
Route::put('/reviews/{review}', [ReviewController::class, 'update'])->middleware('auth')->name('reviews.update');
Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])->middleware('auth')->name('reviews.destroy');
Route::get('/category/{parent}/{child?}', [AdvertisementController::class, 'byCategory'])
    ->name('advertisements.byCategory');

require __DIR__.'/auth.php';
