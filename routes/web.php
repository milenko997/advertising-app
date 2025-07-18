<?php

use App\Http\Controllers\Admin\AdminAdvertisementController;
use App\Http\Controllers\Admin\AdminCustomerController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\AdvertisementController;
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
Route::get('/category/{slug}', [AdvertisementController::class, 'byCategory'])->name('advertisements.byCategory');

require __DIR__.'/auth.php';
