import { Publication } from '@/lib/schemas';

interface PublicationCardProps {
  publication: Publication;
}

export default function PublicationCard({ publication }: PublicationCardProps) {
  return (
    <article className="glass-card p-6 flex flex-col gap-3 group">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-white leading-tight group-hover:text-purple-200 transition-colors duration-300">
          {publication.title}
        </h3>
        <span className="shrink-0 px-3 py-1 rounded-full text-sm font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
          {publication.year}
        </span>
      </div>

      <p className="text-sm text-gray-300">{publication.authors}</p>

      <p className="text-sm text-gray-500 italic">{publication.venue}</p>

      {publication.abstract && (
        <p className="text-sm text-gray-400 leading-relaxed">
          {publication.abstract}
        </p>
      )}

      {publication.tags && publication.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {publication.tags.map((tag) => (
            <span
              key={tag}
              className="tech-tag px-2.5 py-0.5 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {publication.link && (
        <a
          href={publication.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
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
              d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
          View Paper
        </a>
      )}
    </article>
  );
}
