<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'CodexAuth') }} - Unified Auth for Web3 Applications</title>
    <meta name="description" content="Developer-first authentication API for Web3. Multi-chain wallet auth, OAuth, JWT sessions. One SDK, all chains.">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">

    <style>
        :root {
            --primary-bg: #0d1117;
            --secondary-bg: #161b22;
            --tertiary-bg: #1c2128;
            --accent-blue: #58a6ff;
            --accent-green: #39d353;
            --accent-purple: #8b5cf6;
            --text-primary: #c9d1d9;
            --text-secondary: #8b949e;
            --border-color: #30363d;
            --code-bg: #161b22;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--primary-bg);
            color: var(--text-primary);
            overflow-x: hidden;
            line-height: 1.6;
        }

        .splash-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .splash-content {
            flex: 1;
            padding: 4rem 2rem;
            max-width: 1400px;
            margin: 0 auto;
            width: 100%;
        }

        /* Hero Section */
        .hero {
            text-align: center;
            margin-bottom: 6rem;
        }

        .status-badge {
            display: inline-block;
            padding: 0.5rem 1rem;
            background: var(--secondary-bg);
            border: 1px solid var(--accent-green);
            border-radius: 20px;
            color: var(--accent-green);
            font-size: 0.875rem;
            font-weight: 500;
            margin-bottom: 2rem;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }

        .hero h1 {
            font-size: clamp(2.5rem, 6vw, 4rem);
            font-weight: 700;
            margin-bottom: 1.5rem;
            background: linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-purple) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .hero p {
            font-size: 1.25rem;
            color: var(--text-secondary);
            max-width: 700px;
            margin: 0 auto 2rem;
        }

        .cta-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }

        .btn {
            padding: 0.875rem 2rem;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.2s;
            cursor: pointer;
            border: none;
            font-size: 1rem;
        }

        .btn-primary {
            background: var(--accent-blue);
            color: var(--primary-bg);
        }

        .btn-primary:hover {
            background: #4493e6;
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(88, 166, 255, 0.3);
        }

        .btn-secondary {
            background: var(--secondary-bg);
            color: var(--text-primary);
            border: 1px solid var(--border-color);
        }

        .btn-secondary:hover {
            border-color: var(--accent-blue);
            background: var(--tertiary-bg);
        }

        /* Code Demo */
        .code-demo {
            background: var(--secondary-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 1.5rem;
            margin: 3rem auto;
            max-width: 800px;
            position: relative;
            overflow: hidden;
        }

        .code-demo::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 40px;
            background: var(--tertiary-bg);
            border-bottom: 1px solid var(--border-color);
        }

        .code-demo-header {
            position: relative;
            z-index: 1;
            padding: 0.75rem 0 0.75rem;
            display: flex;
            gap: 0.5rem;
        }

        .code-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }

        .code-dot:nth-child(1) { background: #ff5f56; }
        .code-dot:nth-child(2) { background: #ffbd2e; }
        .code-dot:nth-child(3) { background: #27c93f; }

        .code-content {
            font-family: 'Fira Code', monospace;
            font-size: 0.875rem;
            line-height: 1.8;
            color: var(--text-primary);
            overflow-x: auto;
            margin-top: 1rem;
        }

        .code-content .comment { color: #6e7681; }
        .code-content .keyword { color: #ff7b72; }
        .code-content .function { color: #d2a8ff; }
        .code-content .string { color: #a5d6ff; }
        .code-content .method { color: var(--accent-blue); }

        /* Features Grid */
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
            margin: 4rem 0;
        }

        .feature-card {
            background: var(--secondary-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 2rem;
            transition: all 0.3s;
            cursor: pointer;
        }

        .feature-card:hover {
            border-color: var(--accent-blue);
            transform: translateY(-4px);
            box-shadow: 0 12px 40px rgba(88, 166, 255, 0.15);
        }

        .feature-icon {
            width: 48px;
            height: 48px;
            background: var(--tertiary-bg);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }

        .feature-card h3 {
            font-size: 1.25rem;
            margin-bottom: 0.75rem;
            color: var(--text-primary);
        }

        .feature-card p {
            color: var(--text-secondary);
            font-size: 0.9375rem;
        }

        /* Waitlist Section */
        .waitlist-section {
            background: var(--secondary-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 3rem;
            text-align: center;
            margin: 4rem auto;
            max-width: 700px;
        }

        .waitlist-section h2 {
            font-size: 2rem;
            margin-bottom: 1rem;
        }

        .waitlist-section p {
            color: var(--text-secondary);
            margin-bottom: 2rem;
        }

        .waitlist-form {
            display: flex;
            gap: 1rem;
            max-width: 500px;
            margin: 0 auto;
            flex-wrap: wrap;
        }

        .waitlist-form input {
            flex: 1;
            min-width: 250px;
            padding: 0.875rem 1rem;
            background: var(--primary-bg);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            color: var(--text-primary);
            font-size: 1rem;
        }

        .waitlist-form input:focus {
            outline: none;
            border-color: var(--accent-blue);
        }

        .waitlist-form button {
            padding: 0.875rem 2rem;
        }

        .slide-panel {
            position: fixed;
            top: 0;
            right: -100%;
            width: 100%;
            max-width: 600px;
            height: 100vh;
            background: var(--secondary-bg);
            border-left: 1px solid var(--border-color);
            box-shadow: -10px 0 50px rgba(0, 0, 0, 0.5);
            transition: right 0.3s ease;
            z-index: 1000;
            overflow-y: auto;
            padding: 2rem;
        }

        .slide-panel.active {
            right: 0;
        }

        .panel-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: var(--tertiary-bg);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            width: 40px;
            height: 40px;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }

        .panel-close:hover {
            background: var(--primary-bg);
            color: var(--accent-blue);
        }

        .panel-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: none;
            z-index: 999;
        }

        .panel-overlay.active {
            display: block;
        }

        @media (max-width: 768px) {
            .splash-content {
                padding: 2rem 1rem;
            }

            .hero h1 {
                font-size: 2rem;
            }

            .waitlist-section {
                padding: 2rem 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="splash-container">
        @include('splash.header')

        <main class="splash-content">
            <!-- Hero Section -->
            <div class="hero">
                <div class="status-badge">🚀 Pre-Launch • Coming March 2026</div>
                <h1>Unified Auth for<br>Web3 Applications</h1>
                <p>Developer-first authentication API for modern Web3 apps. Multi-chain wallet auth, OAuth, JWT sessions, and more. One SDK, all chains.</p>

                <div class="cta-buttons">
                    <button class="btn btn-primary" data-panel-trigger>Request Early Access</button>
                    <a href="#features" class="btn btn-secondary">View Features</a>
                </div>
            </div>

            <!-- Code Demo -->
            <div class="code-demo">
                <div class="code-demo-header">
                    <span class="code-dot"></span>
                    <span class="code-dot"></span>
                    <span class="code-dot"></span>
                </div>
                <div class="code-content">
                    <div><span class="comment">// Initialize CodexAuth in your application</span></div>
                    <div><span class="keyword">import</span> { <span class="function">CodexAuth</span> } <span class="keyword">from</span> <span class="string">'@web3codex/auth'</span>;</div>
                    <div></div>
                    <div><span class="keyword">const</span> auth = <span class="keyword">new</span> <span class="function">CodexAuth</span>({</div>
                    <div>  apiKey: <span class="string">process.env.CODEX_API_KEY</span>,</div>
                    <div>  chains: [<span class="string">'ethereum'</span>, <span class="string">'polygon'</span>, <span class="string">'solana'</span>]</div>
                    <div>});</div>
                    <div></div>
                    <div><span class="comment">// Authenticate with wallet</span></div>
                    <div><span class="keyword">const</span> session = <span class="keyword">await</span> auth.<span class="method">connectWallet</span>();</div>
                    <div>console.<span class="method">log</span>(<span class="string">'User authenticated:'</span>, session.user);</div>
                </div>
            </div>

            <!-- Features Grid -->
            <div id="features" class="features">
                <div class="feature-card" onclick="document.getElementById('slidePanel').classList.add('active');document.getElementById('panelOverlay').classList.add('active');">
                    <div class="feature-icon">🔐</div>
                    <h3>Multi-Chain Wallet Auth</h3>
                    <p>Support for Ethereum, Polygon, Solana, and more. One integration, unlimited chains.</p>
                </div>

                <div class="feature-card" onclick="document.getElementById('slidePanel').classList.add('active');document.getElementById('panelOverlay').classList.add('active');">
                    <div class="feature-icon">⚡</div>
                    <h3>Lightning Fast Sessions</h3>
                    <p>JWT-based session management with sub-100ms response times. Built for scale.</p>
                </div>

                <div class="feature-card" onclick="document.getElementById('slidePanel').classList.add('active');document.getElementById('panelOverlay').classList.add('active');">
                    <div class="feature-icon">🔔</div>
                    <h3>Real-time Webhooks</h3>
                    <p>Get instant notifications for auth events. Sign-ins, sign-outs, and security alerts.</p>
                </div>

                <div class="feature-card" onclick="document.getElementById('slidePanel').classList.add('active');document.getElementById('panelOverlay').classList.add('active');">
                    <div class="feature-icon">📚</div>
                    <h3>Comprehensive SDKs</h3>
                    <p>JavaScript, Python, PHP, and more. Complete documentation and code examples.</p>
                </div>
            </div>

            <!-- Waitlist Section -->
            <div class="waitlist-section">
                <h2>Join the Developer Waitlist</h2>
                <p>Be among the first to integrate CodexAuth. We're onboarding developers in batches starting March 2026.</p>

                <form class="waitlist-form" onsubmit="event.preventDefault(); alert('Thanks! We\'ll notify you when early access is available.');">
                    <input type="email" placeholder="your@email.com" required>
                    <button type="submit" class="btn btn-primary">Get Early Access</button>
                </form>

                <p style="margin-top: 1.5rem; font-size: 0.875rem;">
                    <span style="color: var(--text-secondary);">Already have access?</span>
                    <a href="/login" style="color: var(--accent-blue); text-decoration: none; margin-left: 0.5rem;">Sign in →</a>
                </p>
            </div>
        </main>

        @include('splash.footer')
    </div>

    <!-- Slide Panel -->
    <div class="panel-overlay" id="panelOverlay"></div>
    <div class="slide-panel" id="slidePanel">
        <button class="panel-close" id="panelClose">×</button>
        <h2 style="margin-bottom: 1.5rem;">API Documentation Preview</h2>

        <div style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.125rem; margin-bottom: 0.75rem; color: var(--accent-blue);">Authentication Endpoints</h3>
            <div style="background: var(--primary-bg); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); font-family: 'Fira Code', monospace; font-size: 0.875rem;">
                <div style="margin-bottom: 0.5rem;"><span style="color: var(--accent-green);">POST</span> /api/v1/auth/wallet/connect</div>
                <div style="margin-bottom: 0.5rem;"><span style="color: var(--accent-blue);">GET</span>  /api/v1/auth/session/verify</div>
                <div style="margin-bottom: 0.5rem;"><span style="color: #ff7b72;">DELETE</span> /api/v1/auth/session/destroy</div>
            </div>
        </div>

        <div style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.125rem; margin-bottom: 0.75rem; color: var(--accent-blue);">Supported Chains</h3>
            <ul style="list-style: none; padding: 0;">
                <li style="padding: 0.5rem; background: var(--primary-bg); margin-bottom: 0.5rem; border-radius: 6px; border-left: 3px solid var(--accent-green);">✓ Ethereum (EVM)</li>
                <li style="padding: 0.5rem; background: var(--primary-bg); margin-bottom: 0.5rem; border-radius: 6px; border-left: 3px solid var(--accent-green);">✓ Polygon</li>
                <li style="padding: 0.5rem; background: var(--primary-bg); margin-bottom: 0.5rem; border-radius: 6px; border-left: 3px solid var(--accent-green);">✓ Solana</li>
                <li style="padding: 0.5rem; background: var(--primary-bg); margin-bottom: 0.5rem; border-radius: 6px; border-left: 3px solid var(--accent-purple);">⏳ Binance Smart Chain (Coming Soon)</li>
                <li style="padding: 0.5rem; background: var(--primary-bg); margin-bottom: 0.5rem; border-radius: 6px; border-left: 3px solid var(--accent-purple);">⏳ Avalanche (Coming Soon)</li>
            </ul>
        </div>

        <div style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.125rem; margin-bottom: 0.75rem; color: var(--accent-blue);">Tech Stack</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                <span style="padding: 0.375rem 0.75rem; background: var(--primary-bg); border: 1px solid var(--border-color); border-radius: 20px; font-size: 0.8125rem;">Laravel 11</span>
                <span style="padding: 0.375rem 0.75rem; background: var(--primary-bg); border: 1px solid var(--border-color); border-radius: 20px; font-size: 0.8125rem;">PostgreSQL</span>
                <span style="padding: 0.375rem 0.75rem; background: var(--primary-bg); border: 1px solid var(--border-color); border-radius: 20px; font-size: 0.8125rem;">Redis</span>
                <span style="padding: 0.375rem 0.75rem; background: var(--primary-bg); border: 1px solid var(--border-color); border-radius: 20px; font-size: 0.8125rem;">Docker</span>
                <span style="padding: 0.375rem 0.75rem; background: var(--primary-bg); border: 1px solid var(--border-color); border-radius: 20px; font-size: 0.8125rem;">Web3.js</span>
            </div>
        </div>

        <div style="background: var(--primary-bg); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent-blue);">
            <h4 style="margin-bottom: 1rem; color: var(--accent-blue);">🎯 Early Access Benefits</h4>
            <ul style="color: var(--text-secondary); line-height: 2;">
                <li>Free tier with 10,000 monthly authentications</li>
                <li>Priority support from the core team</li>
                <li>Input on API design and features</li>
                <li>Extended trial of premium features</li>
            </ul>
            <button class="btn btn-primary" style="width: 100%; margin-top: 1.5rem;" onclick="alert('Waitlist form coming soon!');">Request Access</button>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const panelTriggers = document.querySelectorAll('[data-panel-trigger]');
            const slidePanel = document.getElementById('slidePanel');
            const panelOverlay = document.getElementById('panelOverlay');
            const panelClose = document.getElementById('panelClose');

            function openPanel() {
                slidePanel.classList.add('active');
                panelOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            function closePanel() {
                slidePanel.classList.remove('active');
                panelOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }

            panelTriggers.forEach(trigger => {
                trigger.addEventListener('click', function(e) {
                    e.preventDefault();
                    openPanel();
                });
            });

            panelClose.addEventListener('click', closePanel);
            panelOverlay.addEventListener('click', closePanel);

            // Close panel on Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && slidePanel.classList.contains('active')) {
                    closePanel();
                }
            });
        });
    </script>
</body>
</html>
