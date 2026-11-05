<footer class="splash-footer">
    <style>
        .splash-footer {
            background: var(--secondary-bg);
            border-top: 1px solid var(--border-color);
            color: var(--text-primary);
            padding: 3rem 2rem 2rem;
            margin-top: auto;
        }

        .splash-footer .footer-content {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 3rem;
        }

        .splash-footer .footer-section h3 {
            margin-bottom: 1rem;
            color: var(--text-primary);
            font-size: 0.9375rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .splash-footer .footer-section p {
            color: var(--text-secondary);
            font-size: 0.9375rem;
            line-height: 1.6;
        }

        .splash-footer .footer-section ul {
            list-style: none;
        }

        .splash-footer .footer-section ul li {
            margin-bottom: 0.75rem;
        }

        .splash-footer .footer-section a {
            color: var(--text-secondary);
            text-decoration: none;
            transition: color 0.2s;
            font-size: 0.9375rem;
        }

        .splash-footer .footer-section a:hover {
            color: var(--accent-blue);
        }

        .splash-footer .footer-bottom {
            max-width: 1400px;
            margin: 3rem auto 0;
            padding-top: 2rem;
            border-top: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .social-links {
            display: flex;
            gap: 1rem;
        }

        .social-links a {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--tertiary-bg);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            color: var(--text-secondary);
            text-decoration: none;
            transition: all 0.2s;
            font-size: 1.25rem;
        }

        .social-links a:hover {
            border-color: var(--accent-blue);
            color: var(--accent-blue);
            transform: translateY(-2px);
        }

        @media (max-width: 768px) {
            .splash-footer .footer-bottom {
                flex-direction: column;
                text-align: center;
            }
        }
    </style>

    <div class="footer-content">
        <div class="footer-section">
            <h3>CodexAuth</h3>
            <p>Unified authentication for Web3 applications. Built by developers, for developers.</p>
            <div class="social-links" style="margin-top: 1.5rem;">
                <a href="https://github.com/web3codex" target="_blank" title="GitHub">🐙</a>
                <a href="https://discord.gg/web3codex" target="_blank" title="Discord">💬</a>
                <a href="https://twitter.com/web3codex" target="_blank" title="Twitter">🐦</a>
            </div>
        </div>

        <div class="footer-section">
            <h3>Platform</h3>
            <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#" data-panel-trigger>API Documentation</a></li>
                <li><a href="#">Integration Guides</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Roadmap</a></li>
            </ul>
        </div>

        <div class="footer-section">
            <h3>Resources</h3>
            <ul>
                <li><a href="https://docs.web3codex.com" target="_blank">Documentation</a></li>
                <li><a href="https://github.com/web3codex" target="_blank">GitHub</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Status Page</a></li>
                <li><a href="#">Changelog</a></li>
            </ul>
        </div>

        <div class="footer-section">
            <h3>Legal</h3>
            <ul>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Service</a></li>
                <li><a href="/security">Security</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        </div>
    </div>

    <div class="footer-bottom">
        <p style="color: var(--text-secondary); font-size: 0.875rem;">
            &copy; {{ date('Y') }} Web3Codex. All rights reserved. Built with ❤️ for developers.
        </p>
        <p style="color: var(--text-secondary); font-size: 0.875rem;">
            Made with <a href="https://laravel.com" target="_blank" style="color: var(--accent-blue);">Laravel</a> •
            Hosted on <a href="#" style="color: var(--accent-blue);">Linode</a> •
            <a href="#" style="color: var(--accent-blue);">System Status</a>
        </p>
    </div>
</footer>
