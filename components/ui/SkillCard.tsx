import type { SkillCategory } from '@/lib/schemas';

interface SkillCardProps {
  category: SkillCategory;
}

export default function SkillCard({ category }: SkillCardProps) {
  return (
    <div className="glass-card p-6 group h-full">
      <h3 className="text-lg font-semibold text-white mb-4 group-hover:text-purple-200 transition-colors duration-300">
        {category.category}
      </h3>
      <div className="flex flex-wrap gap-2">
        {category.items.map((item) => (
          <span
            key={item}
            className="tech-tag inline-block px-3 py-1.5 text-sm rounded-lg"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
