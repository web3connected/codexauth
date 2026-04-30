import React, { useEffect, useState } from 'react';

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: {
    url: string;
    alt: string;
  } | null;
  published_at: string;
  author: {
    name: string;
  };
  categories: Array<{
    name: string;
    slug: string;
  }>;
}

export interface BlogPanelProps {
  apiUrl?: string;
  limit?: number;
  showViewMore?: boolean;
  viewMoreUrl?: string;
  className?: string;
}

export const BlogPanel: React.FC<BlogPanelProps> = ({
  apiUrl = '/api/posts',
  limit = 3,
  showViewMore = true,
  viewMoreUrl = '/blog',
  className = '',
}) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}?limit=${limit}&status=published`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        setPosts(data.data || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [apiUrl, limit]);

  const getImageUrl = (post: BlogPost) => {
    if (post.featured_image?.url) {
      return post.featured_image.url;
    }
    return './assets/images/blog-placeholder.png';
  };

  const getImageAlt = (post: BlogPost) => {
    return post.featured_image?.alt || post.title;
  };

  const formatExcerpt = (excerpt: string, maxLength: number = 100) => {
    if (!excerpt) return '';
    return excerpt.length > maxLength 
      ? `${excerpt.substring(0, maxLength)}...` 
      : excerpt;
  };

  if (loading) {
    return (
      <section className={`bg-accent2 ${className}`}>
        <div className="container pt-120 pb-120">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`bg-accent2 ${className}`}>
        <div className="container pt-120 pb-120">
          <div className="text-center text-neutral4">
            <p>Unable to load blog posts. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null; // Don't render if no posts
  }

  const [featuredPost, ...otherPosts] = posts;

  return (
    <section className={`bg-accent2 ${className}`}>
      <div className="container pt-120 pb-120">
        <div className="flex justify-between flex-wrap gap-4 items-center mb-10 xl:mb-[60px] fade_up_anim">
          <h2>
            News &amp; <span className="h2 text-primary underline">Article</span>
          </h2>
          {showViewMore && (
            <a href={viewMoreUrl} className="btn-primary">
              View More
            </a>
          )}
        </div>

        <div className="grid grid-cols-12 gap-4 xl:gap-6">
          {/* Featured Post - Large Card */}
          {featuredPost && (
            <div className="fade_up_anim col-span-12 lg:col-span-5 xl:col-span-6 row-span-2 bg-accent6 rounded-xl p-4 xl:p-6">
              <img
                src={getImageUrl(featuredPost)}
                className="w-full rounded-xl object-cover h-64 lg:h-80"
                alt={getImageAlt(featuredPost)}
              />
              <div className="px-2 xl:px-4 pb-2 xl:pb-4 pt-4 xl:pt-7">
                <h3 className="mb-3 max-one-line" title={featuredPost.title}>
                  {featuredPost.title}
                </h3>
                <p className="lg:text-lg text-neutral4 mb-6 xl:mb-8">
                  {formatExcerpt(featuredPost.excerpt, 120)}
                </p>
                <a
                  href={`/blog/${featuredPost.slug}`}
                  className="btn-white text-accent5"
                >
                  View Details
                </a>
              </div>
            </div>
          )}

          {/* Other Posts - Horizontal Cards */}
          {otherPosts.map((post, index) => (
            <div
              key={post.id}
              className="fade_up_anim col-span-12 lg:col-span-7 xl:col-span-6 bg-accent6 rounded-xl p-3 xl:p-4 flex items-center gap-4 xl:gap-6 flex-col sm:flex-row"
              data-delay={`${(index + 1) * 0.1}`}
            >
              <img
                src={getImageUrl(post)}
                width="260"
                className="rounded-xl max-sm:w-full object-cover h-48 sm:h-auto sm:w-64"
                alt={getImageAlt(post)}
              />
              <div>
                <h3 className="mb-3" title={post.title}>
                  {post.title}
                </h3>
                <p className="text-neutral4 mb-6 xl:mb-8">
                  {formatExcerpt(post.excerpt, 100)}
                </p>
                <a
                  href={`/blog/${post.slug}`}
                  className="btn-white text-accent5"
                >
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPanel;
