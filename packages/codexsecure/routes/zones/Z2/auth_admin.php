<?php

/**
 * Z2: Admin Identity Routes
 * Handles admin login, password reset, secret repair
 *
 * @package Web3Codex\CodexCore
 * @zone Z2 (identity)
 */

use Illuminate\Support\Facades\Route;
use Web3Codex\CodexAuth\Http\Controllers\{
    CodexAuthLoginController,
    CodexAuthTokenController,
    CodexAuthResetTokenController,
    CodexAuthResetSecretController
};

/**
 * 🔐 Z2: Codex Admin Identity Routes
 * Handles login, password reset, secret repair
 */

Route::get('/login', [CodexAuthLoginController::class, 'showLoginForm'])
    ->name('login'); // becomes identity.admin.login

Route::post('/login', [CodexAuthLoginController::class, 'login'])
    ->name('login.post');

Route::get('/password/request', [CodexAuthResetTokenController::class, 'showRequestForm'])
    ->name('password.request');

Route::post('/reset/secret/post', [CodexAuthResetSecretController::class, 'resetSecret'])
    ->name('reset.secret.post');

Route::get('/reset/token', [CodexAuthResetTokenController::class, 'showResetForm'])
    ->name('reset.token');

Route::post('/reset/token', [CodexAuthResetTokenController::class, 'resetToken'])
    ->name('reset.token.post');

Route::get('/repair', [CodexAuthResetTokenController::class, 'repair'])
    ->name('repair');
