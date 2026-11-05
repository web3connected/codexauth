@extends('codexauth::layouts.guest')

@section('title', 'Secure Login')

@section('content')
<div class="login-box">
        <div class="card card-outline card-primary">
            <div class="card-header text-center">
                <div class="h1">
                    <i class="fas fa-cube text-primary"></i>
                    <b>Codex</b>Auth
                </div>
                <p class="login-box-msg">Quantum Authentication Portal</p>
            </div>

            <div class="card-body">
                @if ($errors->any())
                    <div class="alert alert-danger">
                        <ul class="mb-0">
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                <form id="codexauth-form" action="{{ route('admin.login.submit') }}" method="POST">
                    @csrf

                    <!-- Hidden fields for TIU sync -->
                    <input type="hidden" name="challenge_id" id="challenge_id">
                    <input type="hidden" name="challenge_tiu" id="challenge_tiu">

                    <!-- Email Input -->
                    <div class="input-group mb-3">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            class="form-control @error('email') is-invalid @enderror"
                            placeholder="Email"
                            value="{{ old('email') }}"
                            required
                            autocomplete="email"
                            autofocus
                        >
                        <div class="input-group-append">
                            <div class="input-group-text">
                                <span class="fas fa-envelope"></span>
                            </div>
                        </div>
                        @error('email')
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                        @enderror
                    </div>

                    <!-- Secret Input (replaces password) -->
                    <div class="input-group mb-3">
                        <input
                            type="password"
                            name="secret"
                            id="secret"
                            class="form-control @error('secret') is-invalid @enderror"
                            placeholder="Secret (8-32 characters)"
                            required
                            minlength="8"
                            maxlength="32"
                            autocomplete="off"
                        >
                        <div class="input-group-append">
                            <div class="input-group-text">
                                <span class="fas fa-key"></span>
                            </div>
                        </div>
                        @error('secret')
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                        @enderror
                    </div>

                    <div class="row">
                        <!-- Remember Me -->
                        <div class="col-8">
                            <div class="icheck-primary">
                                <input type="checkbox" id="remember" name="remember" {{ old('remember') ? 'checked' : '' }}>
                                <label for="remember">
                                    Remember Device
                                </label>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <div class="col-4">
                            <button type="submit" class="btn btn-primary btn-block" id="login-btn">
                                <span id="btn-text">Sign In</span>
                                <span id="btn-loading" class="d-none">
                                    <i class="fas fa-spinner fa-spin"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                </form>

                <!-- Quantum Auth Indicator -->
                <div class="quantum-indicator text-center">
                    <i class="fas fa-shield-alt"></i>
                    Secured with Quantum Hash Authentication
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<!-- CodexAuth TIU Sync Script -->
<script>
        (function() {
            'use strict';

            // Generate UUID v4
            function generateUUID() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    const r = Math.random() * 16 | 0;
                    const v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            }

            // Fetch current TIU from CodexTime API
            async function getCurrentTIU() {
                try {
                    const response = await fetch('/api/codextime/current-tiu');
                    if (!response.ok) {
                        throw new Error('Failed to fetch TIU');
                    }
                    const data = await response.json();
                    return data.tiu;
                } catch (error) {
                    console.error('TIU fetch error:', error);
                    // Fallback to timestamp if TIU fetch fails
                    return Math.floor(Date.now() / 1000);
                }
            }

            // Initialize form on page load
            document.addEventListener('DOMContentLoaded', async function() {
                const form = document.getElementById('codexauth-form');
                const challengeIdInput = document.getElementById('challenge_id');
                const challengeTiuInput = document.getElementById('challenge_tiu');
                const loginBtn = document.getElementById('login-btn');
                const btnText = document.getElementById('btn-text');
                const btnLoading = document.getElementById('btn-loading');

                // Pre-generate challenge ID
                challengeIdInput.value = generateUUID();

                // Fetch TIU on form submission
                form.addEventListener('submit', async function(e) {
                    e.preventDefault();

                    // Disable button and show loading
                    loginBtn.disabled = true;
                    btnText.classList.add('d-none');
                    btnLoading.classList.remove('d-none');

                    try {
                        // Fetch current TIU
                        const tiu = await getCurrentTIU();
                        challengeTiuInput.value = tiu;

                        // Regenerate challenge ID for this attempt
                        challengeIdInput.value = generateUUID();

                        // Submit form
                        form.submit();
                    } catch (error) {
                        console.error('Form submission error:', error);
                        alert('Authentication error. Please try again.');

                        // Re-enable button
                        loginBtn.disabled = false;
                        btnText.classList.remove('d-none');
                        btnLoading.classList.add('d-none');
                    }
                });
            });
        })();
    </script>
@endpush
