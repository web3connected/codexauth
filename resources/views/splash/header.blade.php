<header class="splash-header">
    <style>
        .splash-header {
            background: var(--secondary-bg);
            border-bottom: 1px solid var(--border-color);
            padding: 1rem 2rem;
            position: sticky;
            top: 0;
            z-index: 100;
            backdrop-filter: blur(10px);
        }

        .splash-header nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1400px;
            margin: 0 auto;
        }

        .splash-header .logo {
            font-size: 1.25rem;
            font-weight: 700;
            text-decoration: none;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .splash-header .logo::before {
            content: '🔐';
            font-size: 1.5rem;
        }

        .splash-header .nav-links {
            display: flex;
            gap: 2rem;
            list-style: none;
            align-items: center;
        }

        .splash-header .nav-links a {
            color: var(--text-secondary);
            text-decoration: none;
            transition: color 0.2s;
            font-size: 0.9375rem;
            font-weight: 500;
        }

        .splash-header .nav-links a:hover {
            color: var(--accent-blue);
        }

        .splash-header .nav-links .btn {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
        }

        @media (max-width: 768px) {
            .splash-header nav {
                flex-direction: column;
                gap: 1rem;
            }

            .splash-header .nav-links {
                gap: 1rem;
            }
        }
    </style>

    <nav>
        <a href="/" class="logo">CodexAuth</a>

        <ul class="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#" data-panel-trigger>API Docs</a></li>
            <li><a href="https://github.com/web3codex" target="_blank">GitHub</a></li>
            <li><a href="#" data-panel-trigger class="btn btn-primary">Get Access</a></li>
        </ul>
    </nav>
</header>
