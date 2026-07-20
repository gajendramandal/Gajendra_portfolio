'use client';

import { useState } from 'react';
import type { GalleryItem } from '@/lib/schemas';
import { deriveCategories, filterByCategory } from '@/lib/utils';
import FilterButtons from '@/components/ui/FilterButtons';
import GalleryGrid from '@/components/ui/GalleryGrid';
import EmptyState from '@/components/ui/EmptyState';
import ScrollReveal from '@/components/animations/ScrollReveal';

interface GalleryClientProps {
  items: GalleryItem[];
}

export default function GalleryClient({ items }: GalleryClientProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = deriveCategories(items);
  const filteredItems = filterByCategory(items, activeCategory);

  if (items.length === 0) {
    return (
    <main className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <ScrollReveal>
        <h1 className="text-4xl font-bold gradient-text mb-3">Gallery</h1>
        <p className="text-gray-400 mb-10 text-lg">
          Photos from campus life, research, and more.
        </p>
      </ScrollReveal>
        <EmptyState message="No gallery items are available." />
      </main>
    );
  }

  return (
    <main className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <ScrollReveal>
        <h1 className="text-4xl font-bold gradient-text mb-3">Gallery</h1>
        <p className="text-gray-400 mb-10 text-lg">
          Photos from campus life, research, and more.
        </p>
      </ScrollReveal>

      <ScrollReveal>
        <div className="mb-8">
          <FilterButtons
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </ScrollReveal>

      {filteredItems.length === 0 ? (
        <EmptyState message="No gallery items match the selected category." />
      ) : (
        <ScrollReveal>
          <GalleryGrid items={filteredItems} />
        </ScrollReveal>
      )}
    </main>
  );
}
