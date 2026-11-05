# CodexAuth Views Architecture

## Overview

CodexAuth follows Laravel's package view hierarchy pattern with three levels:

1. **Package Base View** (web3codex/codexauth package)
2. **Published View** (Laravel application vendor directory)
3. **Application Override** (optional customization)

## View Hierarchy

### Level 1: Package Base View
**Location:** `packages/web3codex/codexauth/resources/views/auth/login.blade.php`

This is the source of truth for CodexAuth login functionality. It includes:
- Secret-based authentication (not password)
- TIU (Time Index Unit) synchronization
- Quantum hash challenge generation
- Device fingerprinting integration
- AdminLTE 3.2 dark mode styling

**Do not modify directly** - changes here affect all applications using CodexAuth.

### Level 2: Published View
**Location:** `resources/views/vendor/codexauth/auth/login.blade.php`

Published to Laravel application using:
```bash
php artisan vendor:publish --tag=codexauth-views
```

This is the **application-specific version** that can be customized for branding, styling, or additional functionality.

**Current customizations:**
- Web3Connected branding (logo, colors)
- Custom admin portal messaging
- Application-specific styling overrides

### Level 3: Application Controller
**Location:** `app/Http/Controllers/Admin/Auth/LoginController.php`

The controller uses the published view:
```php
public function showLoginForm()
{
    return view('vendor.codexauth.auth.login');
}
```

## Publishing Process

### Initial Setup
```bash
# Publish views from package to application
php artisan vendor:publish --tag=codexauth-views

# Force re-publish (overwrites existing)
php artisan vendor:publish --tag=codexauth-views --force
```

### When to Re-publish
- After updating CodexAuth package with new features
- To reset customizations to package defaults
- When merging upstream changes from package

**Warning:** Re-publishing with `--force` will overwrite application customizations!

## Customization Guidelines

### Safe Customizations (Application Level)
Edit `resources/views/vendor/codexauth/auth/login.blade.php`:

✅ **Recommended:**
- Brand colors and logos
- Typography and styling
- Additional form fields (non-auth)
- Analytics or tracking scripts
- Layout adjustments
- Custom error messages
- Application-specific JavaScript

### Critical Fields (Do Not Remove)
These are required for CodexAuth functionality:

```blade
<!-- Hidden TIU sync fields -->
<input type="hidden" name="challenge_id" id="challenge_id">
<input type="hidden" name="challenge_tiu" id="challenge_tiu">

<!-- Authentication fields -->
<input type="email" name="email" id="email" required>
<input type="password" name="secret" id="secret" required minlength="8" maxlength="32">

<!-- TIU Sync JavaScript -->
<script>
    // UUID generation
    // TIU fetch from /api/codextime/current-tiu
    // Form submission with challenge data
</script>
```

## Architecture Benefits

### 1. Separation of Concerns
- **Package:** Core authentication logic
- **Application:** Branding and customization

### 2. Upgradability
- Update package without losing customizations
- Merge upstream improvements selectively

### 3. Consistency
- All CodexAuth applications start from same base
- Customizations are explicit and documented

### 4. Version Control
- Package changes tracked in package repository
- Application overrides tracked in application repository
- Clear diff between base and customizations

## File Structure

```
codex_admin/
├── packages/web3codex/codexauth/          # Package (Level 1)
│   └── resources/views/auth/
│       └── login.blade.php                # Base view - DO NOT EDIT
│
├── resources/views/vendor/codexauth/      # Published (Level 2)
│   └── auth/
│       └── login.blade.php                # Application customizations
│
└── app/Http/Controllers/Admin/Auth/       # Controller (Level 3)
    └── LoginController.php                # Uses published view
```

## Customization Example

### Original (Package Base)
```blade
<div class="h1">
    <i class="fas fa-cube text-primary"></i>
    <b>Codex</b>Auth
</div>
<p class="login-box-msg">Quantum Authentication Portal</p>
```

### Customized (Application Override)
```blade
<div class="h1">
    <i class="fas fa-cube text-primary"></i>
    <b>Web3</b>Connected
</div>
<p class="login-box-msg">Admin Portal - Quantum Authentication</p>
```

## Migration from Old Login

### Before (Traditional Password)
```blade
<input type="password" name="password" placeholder="Password" required>
```

### After (CodexAuth Secret)
```blade
<input type="password" name="secret" placeholder="Secret (8-32 characters)" 
       required minlength="8" maxlength="32" autocomplete="off">
```

## Testing

### View Route
```
GET /admin/login → vendor.codexauth.auth.login
```

### Authentication Route
```
POST /codex-auth/login
Body: {
    email: string
    secret: string (8-32 chars)
    challenge_id: uuid
    challenge_tiu: integer
    remember: boolean (optional)
}
```

### Verify TIU Sync
Open browser console and check:
```javascript
// On page load
console.log(document.getElementById('challenge_id').value); // Should be UUID

// On form submit
console.log(document.getElementById('challenge_tiu').value); // Should be TIU number
```

## Troubleshooting

### View Not Found Error
```
View [vendor.codexauth.auth.login] not found
```

**Solution:** Publish views
```bash
php artisan vendor:publish --tag=codexauth-views
```

### TIU Fetch Fails
Check CodexTime API:
```bash
curl http://localhost:8082/api/codextime/current-tiu
```

Should return:
```json
{
  "tiu": 188432052,
  "timestamp": 1766268852,
  "datetime": "2025-12-20 22:14:12",
  "source": "local",
  "cached": false
}
```

### Authentication Fails
Verify form data in Network tab:
- `challenge_id` should be UUID format
- `challenge_tiu` should be recent TIU number
- `secret` should be 8-32 characters
- Form action should be `/codex-auth/login`

## Best Practices

1. **Version Control:** Commit both package and published views
2. **Documentation:** Document all customizations in this file
3. **Testing:** Test after re-publishing to catch regressions
4. **Backups:** Keep backup of customizations before force re-publish
5. **Upstream:** Contribute improvements back to package when applicable

## Related Documentation

- [CODEXAUTH_INSTALLATION_PROGRESS.md](/_docs/codex_admin/CODEXAUTH_INSTALLATION_PROGRESS.md)
- [CodexHash Package](/packages/web3codex/codexhash/)
- [CodexTime Package](/packages/web3codex/codextime/)
- [CodexAuth Routes](/packages/web3codex/codexauth/src/Http/Routes/api.php)

---

**Last Updated:** December 20, 2025  
**Version:** CodexAuth 2.0.0  
**Author:** Web3Connected Development Team
