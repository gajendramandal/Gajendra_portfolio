import type { Metadata } from 'next';
import { getProjects } from '@/lib/data';
import ProjectsClient from './ProjectsClient';

export const metadata: Metadata = {
  title: 'Projects | Gajendra Mandal',
  description: 'Browse AI, ML, NLP, Computer Vision, and Web Development projects by Gajendra Mandal.',
  openGraph: {
    title: 'Projects | Gajendra Mandal',
    description: 'Browse AI, ML, NLP, Computer Vision, and Web Development projects by Gajendra Mandal.',
  },
};

export default function ProjectsPage() {
  const projects = getProjects();

  return <ProjectsClient projects={projects} />;
}
