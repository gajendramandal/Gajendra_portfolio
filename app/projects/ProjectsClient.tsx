'use client';

import { useState } from 'react';
import type { Project } from '@/lib/schemas';
import { filterByCategory } from '@/lib/utils';
import { PROJECT_CATEGORIES } from '@/lib/constants';
import FilterButtons from '@/components/ui/FilterButtons';
import ProjectCard from '@/components/ui/ProjectCard';
import EmptyState from '@/components/ui/EmptyState';
import ScrollReveal from '@/components/animations/ScrollReveal';

interface ProjectsClientProps {
  projects: Project[];
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = filterByCategory(projects, activeCategory);

  return (
    <main className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <ScrollReveal>
        <h1 className="text-4xl font-bold gradient-text mb-3">Projects</h1>
        <p className="text-gray-400 mb-10 text-lg">
          Explore my work across Machine Learning, NLP, Computer Vision, and more.
        </p>
      </ScrollReveal>

      <ScrollReveal>
        <div className="mb-8">
          <FilterButtons
            categories={PROJECT_CATEGORIES}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </ScrollReveal>

      {filteredProjects.length === 0 ? (
        <EmptyState message="No projects match the selected category." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.title}
              className="transition-all duration-300 ease-in-out"
            >
              <ScrollReveal>
                <ProjectCard project={project} />
              </ScrollReveal>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
