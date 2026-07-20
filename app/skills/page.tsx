import type { Metadata } from 'next';
import { getSkills } from '@/lib/data';
import SkillCard from '@/components/ui/SkillCard';
import ScrollReveal from '@/components/animations/ScrollReveal';
import EmptyState from '@/components/ui/EmptyState';
import MatrixRain from '@/components/animations/MatrixRain';

export const metadata: Metadata = {
  title: 'Technical Skills | Gajendra Mandal',
  description: 'Technical skills of Gajendra Mandal in Programming, Data Science, ML, and Tools.',
  openGraph: {
    title: 'Technical Skills | Gajendra Mandal',
    description: 'Technical skills of Gajendra Mandal in Programming, Data Science, ML, and Tools.',
  },
};

export default function SkillsPage() {
  const skills = getSkills();

  if (skills.length === 0) {
    return (
      <main className="min-h-screen px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-10 text-center">
            Technical Skills
          </h1>
          <EmptyState message="No skills are available at the moment." />
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-10 min-h-screen px-4 py-16">
      {/* Kali Linux Matrix Rain Background */}
      <MatrixRain />
      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-10 text-center">
          Technical Skills
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {skills.map((skill) => (
            <ScrollReveal key={skill.category}>
              <SkillCard category={skill} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </main>
  );
}
