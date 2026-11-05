<?php

/**
 * Z4: Protected Dashboard Routes
 * Logged-in user dashboard and features
 *
 * @package Web3Codex\CodexCore
 * @zone Z4 (protected)
 */

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

/**
 * 🟦 Z4: Protected Dashboard Zone
 * User dashboard routes requiring authentication
 */

Route::get('/', function () {
    return response()->json([
        'message' => 'Dashboard endpoint',
        'authenticated' => Auth::check(),
        'note' => 'Dashboard controllers will be migrated in future steps'
    ]);
})->name('dashboard.index');

Route::get('/profile', function () {
    return response()->json([
        'message' => 'User profile endpoint',
        'authenticated' => Auth::check(),
        'note' => 'Profile controllers will be migrated in future steps'
    ]);
})->name('dashboard.profile');
