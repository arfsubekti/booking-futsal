<?php

use Illuminate\Support\Facades\Route;

// Redirect root to admin since frontend is now Next.js
Route::get('/', function () {
    return redirect('/admin');
});
