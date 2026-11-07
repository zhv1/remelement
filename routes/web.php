<?php

use App\Http\Controllers\CatalogController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // Хиты витрины: в наличии, с фото, сначала новые
    $featured = \App\Models\Product::where('amount', '>', 0)
        ->latest()
        ->limit(24)
        ->get()
        ->filter(fn ($p) => !empty($p->pictures_urls))
        ->take(8)
        ->values();

    // Статистика для hero-блока (кеш на час — данные обновляются синхронизацией)
    $stats = \Illuminate\Support\Facades\Cache::remember('home_stats', 3600, fn () => [
        'products' => \App\Models\Product::where('amount', '>', 0)->count(),
        'brands' => \App\Models\Product::where('amount', '>', 0)
            ->whereNotNull('manufacturer')
            ->where('manufacturer', '!=', '')
            ->distinct()
            ->count('manufacturer'),
    ]);

    return Inertia::render('Home', ['featured' => $featured, 'stats' => $stats]);
})->name('home');
Route::get('/about', fn() => Inertia::render('About'))->name('about');
Route::get('/delivery', fn() => Inertia::render('Delivery'))->name('delivery');
Route::get('/contacts', fn() => Inertia::render('Contacts'))->name('contacts');
Route::get('/catalog', [CatalogController::class, 'index'])->name('catalog.index');
Route::get('/catalog/{product}', [CatalogController::class, 'show'])->name('catalog.show');
Route::get('/api/search/suggest', [CatalogController::class, 'suggest'])
    ->middleware('throttle:30,1')
    ->name('search.suggest');
Route::get('/checkout', [OrderController::class, 'index'])->name('checkout.index');
Route::post('/orders', [OrderController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('orders.store');
Route::get('/checkout/success', [OrderController::class, 'success'])->name('checkout.success');

// Справочник пунктов выдачи СДЭК по городу (демо-данные, см. config/cdek_points.php)
Route::get('/api/delivery/cdek-points', function (\Illuminate\Http\Request $request) {
    $city = trim((string) $request->query('city', ''));
    $points = config('cdek_points', []);

    return response()->json([
        'cities' => array_keys($points),
        'points' => $points[$city] ?? [],
    ]);
})->middleware('throttle:60,1')->name('delivery.cdek-points');

Route::get('dashboard', fn() => Inertia::render('Dashboard'))
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::get('/my-orders', [OrderController::class, 'history'])
    ->middleware('auth')
    ->name('orders.history');

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';