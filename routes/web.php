<?php

use App\Http\Controllers\Admin\AdminAdvertisementController;
use App\Http\Controllers\Admin\AdminContactController;
use App\Http\Controllers\Admin\AdminFeedbackController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\FeedbackController;
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

Route::get('/kontakt',  [ContactController::class, 'index'])->name('contact');
Route::post('/kontakt', [ContactController::class, 'store'])->name('contact.store');

Route::get('/cesta-pitanja',      [FaqController::class, 'index'])->name('faq');
Route::get('/uslovi-koriscenja',  [FaqController::class, 'terms'])->name('terms');
Route::get('/politika-privatnosti', [FaqController::class, 'privacy'])->name('privacy');
Route::get('/o-nama',             [FaqController::class, 'about'])->name('about');

Route::get('/sitemap.xml',               [SitemapController::class, 'index'])->name('sitemap.index');
Route::get('/sitemap-static.xml',        [SitemapController::class, 'static'])->name('sitemap.static');
Route::get('/sitemap-categories.xml',    [SitemapController::class, 'categories'])->name('sitemap.categories');
Route::get('/sitemap-advertisements.xml', [SitemapController::class, 'advertisements'])->name('sitemap.advertisements');

Route::middleware('auth')->group(function () {
    Route::get('/profil', [ProfileController::class, 'show'])->name('profile.show');
    Route::put('/profil', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profil/lozinka', [ProfileController::class, 'updatePassword'])->name('profile.password');

    Route::get('/sacuvani', [FavoriteController::class, 'index'])->name('favorites.index');
    Route::post('/sacuvani/{advertisement}', [FavoriteController::class, 'toggle'])->name('favorites.toggle');
});

Route::middleware(['auth', 'isCustomer'])->group(function () {
    Route::get('/moji-oglasi', [AdvertisementController::class, 'userIndex'])->name('advertisements.user');
    Route::get('/postavi-oglas', [AdvertisementController::class, 'create'])->name('advertisements.create');
    Route::post('/oglasi', [AdvertisementController::class, 'store'])->name('advertisements.store')->middleware('throttle:ad-creation');
    Route::get('/oglasi/uredi/{slug}', [AdvertisementController::class, 'edit'])->name('advertisements.edit');
    Route::put('/oglasi/{slug}/azuriraj', [AdvertisementController::class, 'update'])->name('advertisements.update');
    Route::delete('/oglasi/{id}', [AdvertisementController::class, 'destroy'])->name('advertisements.destroy');
    Route::get('/obrisani-oglasi', [AdvertisementController::class, 'trash'])->name('advertisements.trash');
    Route::delete('/oglasi/trajno-brisi/{id}', [AdvertisementController::class, 'forceDelete'])->name('advertisements.forceDelete');
    Route::patch('/oglasi/{id}/vrati', [AdvertisementController::class, 'restore'])->name('advertisements.restore');
    Route::patch('/oglasi/{id}/obnovi', [AdvertisementController::class, 'renew'])->name('advertisements.renew');
    Route::delete('/slike-oglasa/{image}', [AdvertisementController::class, 'destroyImage'])->name('advertisement-images.destroy');
});

Route::middleware(['auth', 'isAdmin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('/kategorije', CategoryController::class);
    Route::resource('/oglasi', AdminAdvertisementController::class)->except(['show', 'create', 'store']);
    Route::patch('/oglasi/{advertisement}/pin', [AdminAdvertisementController::class, 'togglePin'])->name('advertisements.pin');
    Route::post('/oglasi/bulk-action', [AdminAdvertisementController::class, 'bulkAction'])->name('advertisements.bulk');
    Route::resource('/korisnici', AdminCustomerController::class);
    Route::get('/prijave', [AdminReportController::class, 'index'])->name('reports.index');
    Route::patch('/prijave/{report}/resolve', [AdminReportController::class, 'resolve'])->name('reports.resolve');
    Route::delete('/prijave/{report}', [AdminReportController::class, 'destroy'])->name('reports.destroy');
    Route::get('/poruke', [AdminContactController::class, 'index'])->name('messages.index');
    Route::patch('/poruke/{message}/read', [AdminContactController::class, 'markRead'])->name('messages.read');
    Route::delete('/poruke/{message}', [AdminContactController::class, 'destroy'])->name('messages.destroy');
    Route::get('/utisci', [AdminFeedbackController::class, 'index'])->name('feedbacks.index');
    Route::patch('/utisci/{feedback}/read', [AdminFeedbackController::class, 'markRead'])->name('feedbacks.read');
    Route::delete('/utisci/{feedback}', [AdminFeedbackController::class, 'destroy'])->name('feedbacks.destroy');
});

Route::post('/oglasi/{advertisement}/prijavi', [ReportController::class, 'store'])->name('advertisements.report')->middleware('auth');
Route::post('/feedback', [FeedbackController::class, 'store'])->name('feedback.store');

Route::get('/oglas/{slug}', [AdvertisementController::class, 'show'])->name('advertisements.show');
Route::get('/user/{user}', [UserController::class, 'show'])->name('user.show');

// Reviews — login-gate sets intended URL so user returns here after login
Route::get('/user/{user}/review-login', [ReviewController::class, 'loginThenReview'])->middleware('auth')->name('reviews.login');
Route::post('/user/{user}/reviews', [ReviewController::class, 'store'])->middleware('auth')->name('reviews.store');
Route::put('/reviews/{review}', [ReviewController::class, 'update'])->middleware('auth')->name('reviews.update');
Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])->middleware('auth')->name('reviews.destroy');
Route::get('/kategorija/{parent}/{child?}', [AdvertisementController::class, 'byCategory'])
    ->name('advertisements.byCategory');

require __DIR__.'/auth.php';
