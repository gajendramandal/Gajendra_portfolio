interface TimelineEntry {
  date: string;
  description: string;
}

interface TimelineProps {
  entries: TimelineEntry[];
}

export default function Timeline({ entries }: TimelineProps) {
  return (
    <div className="relative pl-8">
      {/* Vertical connecting line */}
      <div
        className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-purple-500/60 via-indigo-500/40 to-purple-500/20"
        aria-hidden="true"
      />

      <ol className="space-y-8">
        {entries.map((entry, index) => (
          <li key={index} className="relative group">
            {/* Dot marker */}
            <div
              className="timeline-dot absolute -left-5 top-1.5 h-3 w-3 rounded-full border-2 border-purple-400 bg-purple-600"
              aria-hidden="true"
            />

            <div>
              <time className="text-sm font-medium text-purple-400">
                {entry.date}
              </time>
              <p className="mt-1 text-gray-300 group-hover:text-gray-200 transition-colors duration-300">{entry.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
