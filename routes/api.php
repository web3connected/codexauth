<?php

use App\Http\Controllers\HealthController;
use Illuminate\Support\Facades\Route;

/*
| CodexAuth REST API. Served under /api (see bootstrap/app.php).
*/

Route::get('/health', HealthController::class)->name('health');
