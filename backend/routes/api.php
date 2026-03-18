<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CourtsController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\FacilityController;
use App\Http\Controllers\Api\LeagueController;
use App\Http\Controllers\Api\SettingsController;

// ─── PUBLIC ──────────────────────────────────────────────
Route::get('/settings',              [SettingsController::class, 'index']);
Route::get('/facilities',            [FacilityController::class, 'index']);
Route::get('/galleries',             [GalleryController::class, 'index']);

// Courts
Route::get('/courts',                [CourtsController::class, 'index']);
Route::get('/courts/{id}',           [CourtsController::class, 'show']);
Route::get('/courts/{id}/slots',     [CourtsController::class, 'slots']);

// Reviews (public read)
Route::get('/reviews',               [ReviewController::class, 'index']);

// Leagues
Route::get('/leagues',               [LeagueController::class, 'index']);
Route::get('/leagues/{id}',          [LeagueController::class, 'show']);
Route::get('/leagues/{id}/standings',[LeagueController::class, 'standings']);
Route::get('/leagues/{id}/top-scorers',[LeagueController::class,'topScorers']);
Route::get('/leagues/{id}/matches',  [LeagueController::class, 'matches']);
Route::get('/matches/upcoming',      [LeagueController::class, 'upcomingMatches']);


// ─── AUTH ─────────────────────────────────────────────────
Route::post('/register',             [AuthController::class, 'register']);
Route::post('/login',                [AuthController::class, 'login']);

// ─── AUTHENTICATED USER ──────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout',               [AuthController::class, 'logout']);
    Route::get('/me',                    [AuthController::class, 'me']);

    // Bookings
    Route::get('/my-bookings',           [BookingController::class, 'myBookings']);
    Route::post('/bookings',             [BookingController::class, 'store']);
    Route::get('/bookings/{id}',         [BookingController::class, 'show']);
    Route::delete('/bookings/{id}',      [BookingController::class, 'cancel']);

    // Payments
    Route::post('/payments',             [PaymentController::class, 'store']);
    Route::get('/payments/{id}',         [PaymentController::class, 'show']);

    // Reviews
    Route::post('/reviews',              [ReviewController::class, 'store']);
    Route::delete('/reviews/{id}',       [ReviewController::class, 'destroy']);
});

// ─── ADMIN ────────────────────────────────────────────────
Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    Route::get('/bookings',              [BookingController::class, 'adminIndex']);
    Route::patch('/bookings/{id}/status',[BookingController::class, 'updateStatus']);
    Route::patch('/payments/{id}/status',[PaymentController::class, 'updateStatus']);
});
