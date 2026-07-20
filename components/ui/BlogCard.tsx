import Link from 'next/link';
import { BlogEntry } from '@/lib/schemas';

interface BlogCardProps {
  entry: BlogEntry;
  slug: string;
}

export default function BlogCard({ entry, slug }: BlogCardProps) {
  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const isExternal = Boolean(entry.externalUrl);

  const cardContent = (
    <article className="glass-card p-6 flex flex-col gap-3 h-full group">
      <div className="flex items-center justify-between gap-2">
        <time dateTime={entry.date} className="text-sm text-gray-500">
          {formattedDate}
        </time>
        {isExternal && (
          <span className="inline-flex items-center gap-1 text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-3.5 w-3.5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
            External
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-white leading-tight group-hover:text-purple-200 transition-colors duration-300">
        {entry.title}
      </h3>

      <p className="text-sm text-gray-400 leading-relaxed">
        {entry.description}
      </p>
    </article>
  );

  if (isExternal) {
    return (
      <a
        href={entry.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={`/blog/${slug}`} className="block">
      {cardContent}
    </Link>
  );
}
