<?php

namespace Web3Codex\CodexAuth\Http\Controllers;

/**
 * AI: Check aiPrompt.md in projects root directory - For More Details
 *
 * CodexAuthRepairController
 * Handles the repair page for Codex Secure Authentication.
 * Starts the Reset Process for Codex Secure Authentication.
 *
 * @package Web3Codex\CodexAuth\Http\Controllers
 * @version 1.0.0
 */

use Illuminate\Contracts\View\View;
use Illuminate\Routing\Controller;

class CodexAuthRepairController extends Controller
{
    /**
     * Show the Codex repair guidance screen.
     *
     * @return View
     */
    public function repair(): View
    {
        return view('codex.auth.repair');
    }
}
