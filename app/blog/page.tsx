import type { Metadata } from 'next';
import { getBlogEntries } from '@/lib/data';
import { sortByDateDescending } from '@/lib/utils';
import BlogCard from '@/components/ui/BlogCard';
import ScrollReveal from '@/components/animations/ScrollReveal';
import EmptyState from '@/components/ui/EmptyState';

export const metadata: Metadata = {
  title: 'Blog Posts | Gajendra Mandal',
  description: 'Blog posts by Gajendra Mandal on Machine Learning, Computer Vision, and AI research.',
  openGraph: {
    title: 'Blog Posts | Gajendra Mandal',
    description: 'Blog posts by Gajendra Mandal on Machine Learning, Computer Vision, and AI research.',
  },
};

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function BlogPage() {
  let entries;
  try {
    entries = getBlogEntries();
  } catch {
    return (
      <main className="min-h-screen px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-10 text-center">
            Blog Posts
          </h1>
          <EmptyState message="Blog posts are currently unavailable. Please try again later." />
        </div>
      </main>
    );
  }

  const sorted = sortByDateDescending(entries);

  if (sorted.length === 0) {
    return (
      <main className="min-h-screen px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-10 text-center">
            Blog Posts
          </h1>
          <EmptyState message="No blog posts are available at the moment." />
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-10 min-h-screen px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-10 text-center">
          Blog Posts
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sorted.map((entry) => {
            const slug = generateSlug(entry.title);
            return (
              <ScrollReveal key={slug}>
                <BlogCard entry={entry} slug={slug} />
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </main>
  );
}
