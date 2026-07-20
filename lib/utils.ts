import type { Publication } from '@/lib/schemas';

/** Filter items by category. "All" returns all items. */
export function filterByCategory<T extends { category: string }>(
  items: T[],
  category: string
): T[] {
  if (category === 'All') return items;
  return items.filter((item) => item.category === category);
}

/** Filter publications by search query (title, authors, or year) */
export function searchPublications(
  publications: Publication[],
  query: string
): Publication[] {
  if (!query.trim()) return publications;
  const q = query.toLowerCase();
  return publications.filter(
    (pub) =>
      pub.title.toLowerCase().includes(q) ||
      pub.authors.toLowerCase().includes(q) ||
      String(pub.year).includes(q)
  );
}

/** Derive unique categories from data items, prepending "All" */
export function deriveCategories<T extends { category: string }>(
  items: T[]
): string[] {
  const unique = [...new Set(items.map((item) => item.category))];
  return ['All', ...unique];
}

/** Truncate text to maxLength chars, adding "…" if truncated */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '\u2026';
}

/** Sort items by date in descending order (newest first), stable for equal dates */
export function sortByDateDescending<T extends { date: string }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
}
