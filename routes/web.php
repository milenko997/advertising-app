<?php

use App\Http\Controllers\Admin\AdminAdvertisementController;
use App\Http\Controllers\Admin\AdminCustomerController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\AdvertisementController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\ProfileController;
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

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');

    Route::get('/favorites', [FavoriteController::class, 'index'])->name('favorites.index');
    Route::post('/favorites/{advertisement}', [FavoriteController::class, 'toggle'])->name('favorites.toggle');
});

Route::middleware(['auth', 'isCustomer'])->group(function () {
    Route::get('/my-advertisements', [AdvertisementController::class, 'userIndex'])->name('advertisements.user');
    Route::get('/advertisements/create', [AdvertisementController::class, 'create'])->name('advertisements.create');
    Route::post('/advertisements', [AdvertisementController::class, 'store'])->name('advertisements.store');
    Route::get('/advertisements/edit/{slug}', [AdvertisementController::class, 'edit'])->name('advertisements.edit');
    Route::put('/advertisements/{slug}/update', [AdvertisementController::class, 'update'])->name('advertisements.update');
    Route::delete('/advertisements/{id}', [AdvertisementController::class, 'destroy'])->name('advertisements.destroy');
    Route::get('/advertisements/trash', [AdvertisementController::class, 'trash'])->name('advertisements.trash');
    Route::delete('/advertisements/force-delete/{id}', [AdvertisementController::class, 'forceDelete'])->name('advertisements.forceDelete');
    Route::patch('/advertisements/{id}/restore', [AdvertisementController::class, 'restore'])->name('advertisements.restore');
});

Route::middleware(['auth', 'isAdmin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('/categories', CategoryController::class);
    Route::resource('/advertisements', AdminAdvertisementController::class)->except(['show', 'create', 'store']);
    Route::resource('/customers', AdminCustomerController::class);
});

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
