'use client';

interface FilterButtonsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function FilterButtons({
  categories,
  activeCategory,
  onCategoryChange,
}: FilterButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter categories">
      {categories.map((category) => {
        const isActive = category === activeCategory;
        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            aria-pressed={isActive}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
              isActive
                ? 'bg-purple-600/20 text-purple-300 border-purple-500/40 shadow-lg shadow-purple-500/20'
                : 'bg-white/[0.03] text-gray-400 border-white/[0.08] hover:bg-white/[0.06] hover:text-purple-300 hover:border-purple-500/20'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
