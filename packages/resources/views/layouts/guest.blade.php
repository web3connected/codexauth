<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'Codex Admin') }} - @yield('title', 'Authentication')</title>

    <!-- Google Font: Source Sans Pro -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- AdminLTE Theme style -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/css/adminlte.min.css">

    @stack('styles')

    <style>
        /* Web3Connected CodexAuth branding */
        .card-primary.card-outline {
            border-top: 3px solid #007bff;
        }

        .login-box {
            width: 380px;
        }

        .h1 {
            color: #007bff;
            font-weight: bold;
        }

        .login-box-msg {
            color: #6c757d;
            font-size: 16px;
        }

        .btn-primary {
            background: linear-gradient(135deg, #007bff, #6f42c1);
            border: none;
        }

        .btn-primary:hover {
            background: linear-gradient(135deg, #0056b3, #5a32a3);
        }

        /* Quantum Auth indicator */
        .quantum-indicator {
            font-size: 12px;
            color: #6f42c1;
            margin-top: 10px;
        }

        .quantum-indicator i {
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    </style>
</head>
<body class="hold-transition login-page dark-mode">
    @yield('content')

    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- Bootstrap 4 -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
    <!-- AdminLTE App -->
    <script src="https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/js/adminlte.min.js"></script>

    @stack('scripts')
</body>
</html>
