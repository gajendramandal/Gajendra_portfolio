'use client';

import { useState, useCallback } from 'react';
import type { Publication } from '@/lib/schemas';
import { filterByCategory, searchPublications } from '@/lib/utils';
import { PUBLICATION_CATEGORIES } from '@/lib/constants';
import FilterButtons from '@/components/ui/FilterButtons';
import SearchInput from '@/components/ui/SearchInput';
import PublicationCard from '@/components/ui/PublicationCard';
import EmptyState from '@/components/ui/EmptyState';
import ScrollReveal from '@/components/animations/ScrollReveal';

interface PublicationsClientProps {
  publications: Publication[];
}

export default function PublicationsClient({ publications }: PublicationsClientProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Apply AND condition: filter by category first, then search within results
  // PUBLICATION_CATEGORIES uses capitalized labels (e.g., "Journal")
  // but data uses lowercase enum values (e.g., "journal")
  // Convert category to lowercase for matching when not "All"
  const categoryForFilter = activeCategory === 'All' ? 'All' : activeCategory.toLowerCase();
  const filteredByCategory = filterByCategory(publications, categoryForFilter);
  const filteredPublications = searchPublications(filteredByCategory, searchQuery);

  return (
    <main className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <ScrollReveal>
        <h1 className="text-4xl font-bold gradient-text mb-3">Publications</h1>
        <p className="text-gray-400 mb-10 text-lg">
          Research publications across journals, conferences, workshops, and preprints.
        </p>
      </ScrollReveal>

      <ScrollReveal>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <FilterButtons
            categories={PUBLICATION_CATEGORIES}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          <SearchInput
            placeholder="Search by title, author, or year"
            onSearch={handleSearch}
            debounceMs={300}
          />
        </div>
      </ScrollReveal>

      {filteredPublications.length === 0 ? (
        <EmptyState message="No publications match your current search and filter criteria." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPublications.map((publication) => (
            <div
              key={`${publication.title}-${publication.year}`}
              className="transition-all duration-300 ease-in-out"
            >
              <ScrollReveal>
                <PublicationCard publication={publication} />
              </ScrollReveal>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
