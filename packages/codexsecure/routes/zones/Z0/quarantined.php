<?php

/**
 * Z0: Quarantine Routes
 * Security zone for traps, honeypots, and error handling
 *
 * @package Web3Codex\CodexCore
 * @zone Z0 (negative)
 */

use Illuminate\Support\Facades\Route;

Route::get('quarantined', function () {
    $quarantinedPath = storage_path('quarantine/suspicious.phq');

    if (!file_exists($quarantinedPath)) {
        return response()->json(['error' => 'File not found'], 404);
    }

    return response()->view('quarantine.viewer', [
        'filename' => basename($quarantinedPath),
        'contents' => file_get_contents($quarantinedPath),
    ]);
})->name('quarantine.view')->middleware('throttle:10,1');
