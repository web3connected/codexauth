# Blog Panel Component

A React component that displays blog posts from your Laravel API in the CritoX crypto template style.

## Features

- ✅ Fetches posts from Laravel codex_admin API
- ✅ Responsive grid layout (featured + horizontal cards)
- ✅ Loading states and error handling
- ✅ Configurable API endpoint and limits
- ✅ CritoX template styling (Tailwind CSS)
- ✅ SEO-friendly with proper image alt tags

## Usage

### Basic Usage

```tsx
import { BlogPanel } from '@web3connected/components';

function App() {
  return (
    <BlogPanel 
      apiUrl="https://your-domain.com/api/posts"
      limit={3}
    />
  );
}
```

### Advanced Usage

```tsx
import { BlogPanel } from '@web3connected/components';

function App() {
  return (
    <BlogPanel 
      apiUrl="https://your-domain.com/api/posts"
      limit={3}
      showViewMore={true}
      viewMoreUrl="/blog"
      className="my-custom-class"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiUrl` | `string` | `/api/posts` | The API endpoint to fetch posts from |
| `limit` | `number` | `3` | Number of posts to display |
| `showViewMore` | `boolean` | `true` | Show/hide the "View More" button |
| `viewMoreUrl` | `string` | `/blog` | URL for the "View More" button |
| `className` | `string` | `''` | Additional CSS classes |

## API Response Format

The component expects the API to return posts in this format:

```json
{
  "data": [
    {
      "id": 1,
      "title": "Post Title",
      "slug": "post-slug",
      "excerpt": "Post excerpt or preview text...",
      "featured_image": {
        "url": "https://example.com/image.jpg",
        "alt": "Image description"
      },
      "published_at": "2025-11-03T10:00:00Z",
      "author": {
        "name": "John Doe"
      },
      "categories": [
        {
          "name": "Crypto News",
          "slug": "crypto-news"
        }
      ]
    }
  ]
}
```

## Laravel API Endpoint

Create this endpoint in your codex_admin Laravel app:

```php
// routes/api.php
Route::get('/posts', [PostController::class, 'index']);

// app/Http/Controllers/PostController.php
public function index(Request $request)
{
    $limit = $request->get('limit', 10);
    
    $posts = Post::with(['author', 'categories'])
        ->published()
        ->latest('published_at')
        ->limit($limit)
        ->get();
    
    return response()->json(['data' => $posts]);
}
```

## Styling

The component uses CritoX template classes:
- `bg-accent2` - Section background
- `bg-accent6` - Card background
- `text-primary` - Primary brand color
- `text-neutral4` - Secondary text color
- `btn-primary` - Primary button style
- `btn-white` - White button style

Make sure your project includes the CritoX Tailwind configuration.

## Layout

- **Featured Post**: Large card (6 columns) with full-width image
- **Other Posts**: Horizontal cards (6 columns) with side-by-side layout
- **Responsive**: Stacks vertically on mobile devices

## Example Integration

```tsx
// CritoX Homepage
import { BlogPanel } from '@web3connected/components';

export default function HomePage() {
  return (
    <main>
      {/* Other sections... */}
      
      <BlogPanel 
        apiUrl={process.env.NEXT_PUBLIC_API_URL + '/api/posts'}
        limit={3}
        viewMoreUrl="/blog"
      />
      
      {/* Footer... */}
    </main>
  );
}
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=https://your-laravel-api.com
```

## Dependencies

- React 18+
- TypeScript
- Tailwind CSS (with CritoX config)

## Notes

- Component automatically handles loading and error states
- Featured image falls back to placeholder if not available
- Excerpt is automatically truncated if too long
- Component won't render if no posts are returned
