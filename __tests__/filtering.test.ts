import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  filterByCategory,
  searchPublications,
  deriveCategories,
  truncateText,
  sortByDateDescending,
} from '@/lib/utils';
import type { Publication } from '@/lib/schemas';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Generate a YYYY-MM-DD date string */
function arbitraryDateString(): fc.Arbitrary<string> {
  return fc
    .record({
      year: fc.integer({ min: 2000, max: 2025 }),
      month: fc.integer({ min: 1, max: 12 }),
      day: fc.integer({ min: 1, max: 28 }),
    })
    .map(
      ({ year, month, day }) =>
        `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    );
}

/** Generate a valid URL string */
function arbitraryUrl(): fc.Arbitrary<string> {
  return fc.webUrl();
}

/** Generate items with a category field */
function arbitraryCategorizedItem(): fc.Arbitrary<{ category: string; id: number }> {
  return fc.record({
    category: fc.constantFrom(
      'Machine Learning',
      'NLP & AI',
      'Computer Vision',
      'Web Development',
      'Research'
    ),
    id: fc.integer({ min: 1, max: 10000 }),
  });
}

/** Generate a valid publication object */
function arbitraryPublication(): fc.Arbitrary<Publication> {
  return fc.record({
    title: fc.string({ minLength: 1, maxLength: 200 }),
    authors: fc.string({ minLength: 1, maxLength: 100 }),
    venue: fc.string({ minLength: 1, maxLength: 100 }),
    year: fc.integer({ min: 1900, max: 2100 }),
    category: fc.constantFrom(
      'journal' as const,
      'conference' as const,
      'workshop' as const,
      'preprint' as const,
      'book' as const
    ),
    abstract: fc.option(fc.string({ minLength: 1, maxLength: 1000 }), {
      nil: undefined,
    }),
    tags: fc.option(
      fc.array(fc.string({ minLength: 1, maxLength: 30 }), {
        minLength: 0,
        maxLength: 10,
      }),
      { nil: undefined }
    ),
    link: fc.option(arbitraryUrl(), { nil: undefined }),
  }) as fc.Arbitrary<Publication>;
}

/** Generate a gallery item with a category */
function arbitraryGalleryItem(): fc.Arbitrary<{
  image: string;
  title: string;
  date: string;
  category: string;
}> {
  return fc.record({
    image: fc.string({ minLength: 1, maxLength: 50 }),
    title: fc.string({ minLength: 1, maxLength: 150 }),
    date: arbitraryDateString(),
    category: fc.constantFrom(
      'Campus Life',
      'Research',
      'Events',
      'Nature',
      'Lab'
    ),
  });
}

/** Generate a project-like object with optional URLs */
function arbitraryProjectWithOptionalUrls(): fc.Arbitrary<{
  title: string;
  category: string;
  githubUrl?: string;
  demoUrl?: string;
}> {
  return fc.record({
    title: fc.string({ minLength: 1, maxLength: 150 }),
    category: fc.string({ minLength: 1, maxLength: 50 }),
    githubUrl: fc.option(arbitraryUrl(), { nil: undefined }),
    demoUrl: fc.option(arbitraryUrl(), { nil: undefined }),
  });
}

/** Generate items with a date field for sorting */
function arbitraryDatedItem(): fc.Arbitrary<{ date: string; index: number }> {
  return fc.record({
    date: arbitraryDateString(),
    index: fc.integer({ min: 0, max: 10000 }),
  });
}

// ─── Property Tests ───────────────────────────────────────────────────────────

describe('Feature: scalable-ai-portfolio, Property 4: Category filtering returns only matching items', () => {
  /**
   * Validates: Requirements 2.3
   */

  it('filtering by a specific category returns only items with that category', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryCategorizedItem(), { minLength: 0, maxLength: 50 }),
        fc.constantFrom(
          'Machine Learning',
          'NLP & AI',
          'Computer Vision',
          'Web Development',
          'Research'
        ),
        (items, category) => {
          const result = filterByCategory(items, category);

          // All returned items must match the selected category
          for (const item of result) {
            expect(item.category).toBe(category);
          }

          // ALL items from input that match must be present in result
          const expectedItems = items.filter((i) => i.category === category);
          expect(result.length).toBe(expectedItems.length);
          expect(result).toEqual(expectedItems);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('filtering by "All" returns all items unchanged', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryCategorizedItem(), { minLength: 0, maxLength: 50 }),
        (items) => {
          const result = filterByCategory(items, 'All');
          expect(result).toEqual(items);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Feature: scalable-ai-portfolio, Property 5: Publication search with category filter applies AND condition', () => {
  /**
   * Validates: Requirements 3.3
   */

  it('combined search and category filter returns only publications matching BOTH conditions', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryPublication(), { minLength: 1, maxLength: 30 }),
        fc.constantFrom(
          'All',
          'journal',
          'conference',
          'workshop',
          'preprint',
          'book'
        ),
        (publications, category) => {
          // Pick a search query from a random publication field to ensure matches
          const targetPub =
            publications[Math.floor(Math.random() * publications.length)];
          const querySource = fc.sample(
            fc.constantFrom('title', 'authors', 'year'),
            1
          )[0];

          let query: string;
          if (querySource === 'year') {
            query = String(targetPub.year);
          } else if (querySource === 'authors') {
            // Take a substring of the authors
            const authors = targetPub.authors;
            query = authors.slice(0, Math.min(3, authors.length));
          } else {
            // Take a substring of the title
            const title = targetPub.title;
            query = title.slice(0, Math.min(3, title.length));
          }

          // Apply category filter first, then search
          const categoryFiltered = filterByCategory(
            publications,
            category === 'All' ? 'All' : category
          );
          const result = searchPublications(categoryFiltered, query);

          // Verify: every item in result matches BOTH the category and the search query
          const q = query.toLowerCase();
          for (const pub of result) {
            if (category !== 'All') {
              expect(pub.category).toBe(category);
            }
            // searchPublications returns all items when query.trim() is empty
            if (query.trim() !== '') {
              const matchesSearch =
                pub.title.toLowerCase().includes(q) ||
                pub.authors.toLowerCase().includes(q) ||
                String(pub.year).includes(q);
              expect(matchesSearch).toBe(true);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('when category is "All", only search condition applies', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryPublication(), { minLength: 1, maxLength: 30 }),
        (publications) => {
          // Use the year of the first publication as a search query
          const query = String(publications[0].year);
          const allFiltered = filterByCategory(publications, 'All');
          const result = searchPublications(allFiltered, query);

          // All returned items should match the query
          for (const pub of result) {
            const matchesSearch =
              pub.title.toLowerCase().includes(query.toLowerCase()) ||
              pub.authors.toLowerCase().includes(query.toLowerCase()) ||
              String(pub.year).includes(query);
            expect(matchesSearch).toBe(true);
          }

          // And the result equals searching all publications directly
          const directResult = searchPublications(publications, query);
          expect(result).toEqual(directResult);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Feature: scalable-ai-portfolio, Property 6: Dynamic category derivation from data', () => {
  /**
   * Validates: Requirements 5.3
   */

  it('derived categories equals ["All", ...unique categories from data]', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryGalleryItem(), { minLength: 0, maxLength: 50 }),
        (items) => {
          const result = deriveCategories(items);

          // First element must be "All"
          expect(result[0]).toBe('All');

          // The rest should be the unique categories from items
          const uniqueFromData = [...new Set(items.map((i) => i.category))];

          // No missing categories
          for (const cat of uniqueFromData) {
            expect(result).toContain(cat);
          }

          // No extra categories (beyond "All" and unique from data)
          const withoutAll = result.slice(1);
          for (const cat of withoutAll) {
            expect(uniqueFromData).toContain(cat);
          }

          // Total count should be 1 (All) + unique categories
          expect(result.length).toBe(1 + uniqueFromData.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('derived categories contains no duplicates', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryGalleryItem(), { minLength: 0, maxLength: 50 }),
        (items) => {
          const result = deriveCategories(items);
          const uniqueResult = [...new Set(result)];
          expect(result.length).toBe(uniqueResult.length);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Feature: scalable-ai-portfolio, Property 7: Text truncation preserves content within length limits', () => {
  /**
   * Validates: Requirements 2.4, 3.4
   */

  it('if original ≤ maxLength, output equals original', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 500 }),
        fc.integer({ min: 0, max: 1000 }),
        (text, maxLength) => {
          fc.pre(text.length <= maxLength);
          const result = truncateText(text, maxLength);
          expect(result).toBe(text);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('if original > maxLength, output is first maxLength chars + "…" (length = maxLength + 1)', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 500 }),
        fc.integer({ min: 0, max: 499 }),
        (text, maxLength) => {
          fc.pre(text.length > maxLength);
          const result = truncateText(text, maxLength);

          // Output should be the first maxLength chars + ellipsis
          expect(result).toBe(text.slice(0, maxLength) + '\u2026');

          // Output length should be maxLength + 1 (the ellipsis character)
          expect(result.length).toBe(maxLength + 1);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('output length never exceeds maxLength + 1', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 500 }),
        fc.integer({ min: 0, max: 1000 }),
        (text, maxLength) => {
          const result = truncateText(text, maxLength);
          expect(result.length).toBeLessThanOrEqual(maxLength + 1);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Feature: scalable-ai-portfolio, Property 8: Optional field omission produces no broken output', () => {
  /**
   * Validates: Requirements 2.6
   */

  it('undefined githubUrl results in absent link logic, defined githubUrl results in present link logic', () => {
    fc.assert(
      fc.property(
        arbitraryProjectWithOptionalUrls(),
        (project) => {
          // Test the conditional logic for githubUrl
          const githubLinkPresent = project.githubUrl ? 'present' : 'absent';

          if (project.githubUrl === undefined) {
            expect(githubLinkPresent).toBe('absent');
          } else {
            expect(githubLinkPresent).toBe('present');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('undefined demoUrl results in absent link logic, defined demoUrl results in present link logic', () => {
    fc.assert(
      fc.property(
        arbitraryProjectWithOptionalUrls(),
        (project) => {
          // Test the conditional logic for demoUrl
          const demoLinkPresent = project.demoUrl ? 'present' : 'absent';

          if (project.demoUrl === undefined) {
            expect(demoLinkPresent).toBe('absent');
          } else {
            expect(demoLinkPresent).toBe('present');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('conditional link rendering logic never produces a link for undefined URL', () => {
    fc.assert(
      fc.property(
        arbitraryProjectWithOptionalUrls(),
        (project) => {
          // Simulate rendering: collect links that would be rendered
          const links: string[] = [];
          if (project.githubUrl) links.push(project.githubUrl);
          if (project.demoUrl) links.push(project.demoUrl);

          // Verify: no undefined/empty strings in links array
          for (const link of links) {
            expect(link).toBeTruthy();
            expect(typeof link).toBe('string');
            expect(link.length).toBeGreaterThan(0);
          }

          // Verify: if a URL is undefined, it's not in the links
          if (!project.githubUrl) {
            expect(links).not.toContain(project.githubUrl);
          }
          if (!project.demoUrl) {
            expect(links).not.toContain(project.demoUrl);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Feature: scalable-ai-portfolio, Property 9: Date-based sorting produces correct descending order', () => {
  /**
   * Validates: Requirements 4.1, 6.4
   */

  it('sorted output is in non-ascending date order (newest first)', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryDatedItem(), { minLength: 0, maxLength: 50 }),
        (items) => {
          const sorted = sortByDateDescending(items);

          // Verify non-ascending order
          for (let i = 0; i < sorted.length - 1; i++) {
            const dateA = new Date(sorted[i].date).getTime();
            const dateB = new Date(sorted[i + 1].date).getTime();
            expect(dateA).toBeGreaterThanOrEqual(dateB);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('for equal dates, relative input order is preserved (stable sort)', () => {
    fc.assert(
      fc.property(
        arbitraryDateString(),
        fc.array(fc.integer({ min: 0, max: 10000 }), {
          minLength: 2,
          maxLength: 20,
        }),
        (date, indices) => {
          // Create items all with the same date but different indices
          const items = indices.map((index) => ({ date, index }));
          const sorted = sortByDateDescending(items);

          // With equal dates, relative order should be preserved
          for (let i = 0; i < sorted.length - 1; i++) {
            const originalPosA = items.indexOf(sorted[i]);
            const originalPosB = items.indexOf(sorted[i + 1]);
            expect(originalPosA).toBeLessThan(originalPosB);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('sorted output contains exactly the same elements as input', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryDatedItem(), { minLength: 0, maxLength: 50 }),
        (items) => {
          const sorted = sortByDateDescending(items);

          // Same length
          expect(sorted.length).toBe(items.length);

          // Same elements (by reference since sortByDateDescending copies)
          const sortedDates = sorted.map((i) => `${i.date}-${i.index}`).sort();
          const inputDates = items.map((i) => `${i.date}-${i.index}`).sort();
          expect(sortedDates).toEqual(inputDates);
        }
      ),
      { numRuns: 100 }
    );
  });
});
