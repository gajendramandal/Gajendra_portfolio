import type { Metadata } from 'next';
import { getBlogEntries } from '@/lib/data';
import { parseMarkdown, getMarkdownContent } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import Link from 'next/link';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entries = getBlogEntries();
  const entry = entries.find((e) => generateSlug(e.title) === slug);

  if (!entry) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: entry.title,
    description: entry.description || `Read "${entry.title}" by Gajendra Mandal.`,
    openGraph: {
      title: entry.title,
      description: entry.description || `Read "${entry.title}" by Gajendra Mandal.`,
      type: 'article',
      publishedTime: entry.date,
      authors: ['Gajendra Mandal'],
    },
    twitter: {
      card: 'summary',
      title: entry.title,
      description: entry.description || `Read "${entry.title}" by Gajendra Mandal.`,
    },
    alternates: {
      canonical: `https://gajendramandal.in/blog/${slug}`,
    },
  };
}

export function generateStaticParams(): { slug: string }[] {
  const entries = getBlogEntries();

  return entries
    .filter((entry) => entry.content || entry.markdown)
    .map((entry) => ({
      slug: generateSlug(entry.title),
    }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entries = getBlogEntries();

  const entry = entries.find(
    (e) => generateSlug(e.title) === slug
  );

  if (!entry) {
    notFound();
  }

  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  let htmlContent: string | null = null;
  let loadError: string | null = null;

  if (entry.content) {
    try {
      htmlContent = await parseMarkdown(entry.content);
    } catch {
      loadError = 'Failed to render the blog post content.';
    }
  } else if (entry.markdown) {
    try {
      htmlContent = await getMarkdownContent(entry.markdown);
    } catch {
      loadError = 'The content for this blog post is currently unavailable.';
    }
  }

  return (
    <main className="relative z-10 min-h-screen px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-all duration-300 mb-8 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Back to Blog
        </Link>

        <article className="glass-card p-8 sm:p-10">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
              {entry.title}
            </h1>
            <time dateTime={entry.date} className="text-sm text-gray-500">
              {formattedDate}
            </time>
          </header>

          {loadError ? (
            <div className="bg-red-500/10 border border-red-400/20 rounded-lg p-6 text-red-300">
              {loadError}
            </div>
          ) : htmlContent ? (
            <div
              className="blog-prose"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          ) : null}
        </article>
      </div>
    </main>
  );
}
