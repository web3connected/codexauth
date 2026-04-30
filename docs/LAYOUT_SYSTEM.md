# Layout System Documentation

The CodexHash application now includes a comprehensive layout system that eliminates the need to manually include headers and footers on every page.

## Available Layouts

### 1. PageLayout (Default)
The main layout component that includes header and footer with content wrapper.

```tsx
import PageLayout from '@/components/layout/PageLayout'

export default function MyPage() {
  return (
    <PageLayout>
      <div>Your page content here</div>
    </PageLayout>
  )
}
```

**Props:**
- `children: React.ReactNode` - Page content
- `className?: string` - Custom CSS classes (default: "min-h-screen bg-slate-900")
- `includeHeader?: boolean` - Include header (default: true)
- `includeFooter?: boolean` - Include footer (default: true)

### 2. ContentLayout
A layout for content-heavy pages with optional title, subtitle, and breadcrumbs.

```tsx
import PageLayout from '@/components/layout/PageLayout'
import ContentLayout from '@/components/layout/ContentLayout'

export default function ArticlePage() {
  return (
    <PageLayout>
      <ContentLayout
        title="Harmonic Hashing Guide"
        subtitle="Learn the principles of quantum-resistant hashing"
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/learn", label: "Learn" },
          { label: "Harmonic Hashing" }
        ]}
      >
        <div>Your article content here</div>
      </ContentLayout>
    </PageLayout>
  )
}
```

**Props:**
- `children: React.ReactNode` - Content
- `className?: string` - Custom CSS classes (default: "py-12 px-6")
- `title?: string` - Page title
- `subtitle?: string` - Page subtitle
- `breadcrumbs?: Array<{ href?: string; label: string }>` - Breadcrumb navigation

### 3. FullWidthLayout
A layout for full-width content without containers.

```tsx
import FullWidthLayout from '@/components/layout/FullWidthLayout'

export default function LandingPage() {
  return (
    <FullWidthLayout>
      <div>Full-width content here</div>
    </FullWidthLayout>
  )
}
```

**Props:**
- `children: React.ReactNode` - Content
- `className?: string` - Additional CSS classes
- `includeBackground?: boolean` - Include default background (default: true)

## Migration Examples

### Before (Manual Header/Footer)
```tsx
import MainHeader from '@/components/common/MainHeader'
import MainFooter from '@/components/common/MainFooter'

export default function OldPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <MainHeader />
      <main>
        {/* Page content */}
      </main>
      <MainFooter />
    </div>
  )
}
```

### After (Using PageLayout)
```tsx
import PageLayout from '@/components/layout/PageLayout'

export default function NewPage() {
  return (
    <PageLayout>
      {/* Page content */}
    </PageLayout>
  )
}
```

## Benefits

1. **Consistency**: All pages have consistent header/footer structure
2. **Maintainability**: Header/footer updates propagate automatically
3. **Flexibility**: Optional props allow customization when needed
4. **Clean Code**: Pages focus on content, not structure
5. **Performance**: Shared layout components are optimized

## Custom Layout Example

For special cases, you can still create custom layouts:

```tsx
import PageLayout from '@/components/layout/PageLayout'

export default function CustomPage() {
  return (
    <PageLayout 
      className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900"
      includeFooter={false}
    >
      <div className="custom-content">
        {/* Custom styled content */}
      </div>
    </PageLayout>
  )
}
```

## Current Page Status

✅ **Updated Pages:**
- `/` - Home page
- `/services/quantum-hash` - Quantum hash service
- `/pricing` - Pricing tiers
- `/test-api` - API testing
- `/learn/harmonic-hashing` - Learning content

All pages now use the new layout system and are consistent with the application structure.
