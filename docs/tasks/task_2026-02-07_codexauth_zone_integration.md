# Task: CodexAuth Zone Z2 Integration
**Date**: 2026-02-07
**Status**: Planned

## 1. Objective
Configure the `codexauth` package routes to enforce **CodexSecure Zone 2 (Z2)** requirements.
This strict integration ensures that authentication attempts are only processed if the request context meets Z2 criteria (e.g., valid origin, basic bot check passed, time sync verified).

## 2. Context
- **CodexSecure System**: Defines zones Z0-Z12.
- **CodexAuth Service**: Handles login/reset logic.
- **Requirement**: "Allow only auth zone Z-2".

## 3. Audit Report: Zone Infrastructure Analysis
**Source**: `codexauth` container analysis

### 3.1 Findings
-   **Middleware Found**: `ZoneRouteMiddleware` and `CodexZoneAnalysisMiddleware` EXIST in `packages/codexcore/src/Http/Middleware`.
-   **Namespace**: `Web3Codex\CodexCore\Http\Middleware`.
-   **Status**: Files are present but not registered in the Application Kernel.

**Conclusion**: We have all necessary files. No new code is required. We must simply **wire up** the existing components.

## 4. Implementation Plan
To "take zone into account" and enforce "Allow only auth zone Z-2":

### 4.1 Register Middleware (Configuration)
Update `bootstrap/app.php` (or `app/Http/Kernel.php` if using legacy structure) to alias the existing middleware:
```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'codex.zone' => \Web3Codex\CodexCore\Http\Middleware\ZoneRouteMiddleware::class,
    ]);
})
```

### 4.2 Configure Routes
Update `packages/codexauth/src/Http/Routes/api.php`:
```php
Route::middleware(['api', 'codex.zone'])->prefix('codex-auth')->group(...)
```
*Note: The middleware automatically detects Zone 2 based on the 'Login' controller mapping found in `CodexZoneStrategies`.*

## 6. Audit Report: Zone 2 Route Structure
**Status**: INCOMPLETE / MISCONFIGURED

### 6.1 Requirements
-   **Separation**: Must separate `api` routes (service-to-service/headless) from `web` routes (browser/session-based).
-   **Source of Truth**: Structure should mirror `root_route_zones.php`.

### 6.2 Current State (CodexAuth)
-   `packages/codexauth/src/Http/Routes/` contains only `api.php`.
-   **Missing**: `web.php` for browser-based authentication flows.
-   **Misconfiguration**: The previous attempt merged everything into `api.php` under Zone 2.

### 6.3 Corrective Action Required
1.  **Split Routes**:
    -   Create `packages/codexauth/src/Http/Routes/web.php` (for Login Forms, Z2 Web).
    -   Keep `packages/codexauth/src/Http/Routes/api.php` (for Token/API Auth).
2.  **Define Zones Properly**:
    -   `root_route_zones.php` must define TWO entries for Z2 (or sub-entries):
        -   `Z2_Web` -> points to `web.php` -> Middleware `['web', 'codex.zone:2']`.
        -   `Z2_API` -> points to `api.php` -> Middleware `['api', 'codex.zone:2']`.

**Next Action**: Wait for user confirmation to create the file structure.

**Next Action**: Implement the configuration changes.
