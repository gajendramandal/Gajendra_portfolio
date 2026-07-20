import { Project } from '@/lib/schemas';

interface ProjectCardProps {
  project: Project;
}

const STATUS_STYLES: Record<Project['status'], string> = {
  completed: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
  ongoing: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',
  planned: 'bg-purple-500/10 text-purple-300 border border-purple-500/20',
};

function truncateDescription(description: string, maxLength = 150): string {
  if (description.length <= maxLength) {
    return description;
  }
  return description.slice(0, maxLength) + '\u2026';
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="glass-card p-6 min-w-[350px] group">
      {/* Header: title and status badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-semibold text-white group-hover:text-purple-200 transition-colors duration-300">{project.title}</h3>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${STATUS_STYLES[project.status]}`}
        >
          {project.status}
        </span>
      </div>

      {/* Category badge */}
      <span className="inline-block px-2.5 py-1 mb-3 rounded-md text-xs font-medium bg-white/[0.05] text-gray-400 border border-white/[0.08]">
        {project.category}
      </span>

      {/* Description */}
      <p className="text-gray-400 text-sm mb-4 leading-relaxed">
        {project.description}
      </p>

      {/* Technology tags - show all */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="tech-tag px-2.5 py-1 rounded-md text-xs"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Action links */}
      {(project.githubUrl || project.demoUrl) && (
        <div className="flex gap-4 pt-4 border-t border-white/[0.06]">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-purple-400 hover:text-purple-300 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
            >
              GitHub
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
            >
              Live Demo
            </a>
          )}
        </div>
      )}
    </div>
  );
}
