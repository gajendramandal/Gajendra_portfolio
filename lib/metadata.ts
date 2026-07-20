/**
 * Metadata utility functions for generating SEO-compliant meta tags.
 * Ensures title and description fields respect character length constraints.
 */

/**
 * Generate a page title that respects the 60-character maximum.
 * If the input exceeds maxLength, it is truncated with "..." appended.
 */
export function generateTitle(input: string, maxLength = 60): string {
  if (input.length <= maxLength) return input;
  return input.slice(0, maxLength - 3) + '...';
}

/**
 * Generate a page description that respects the 160-character maximum.
 * If the input exceeds maxLength, it is truncated with "..." appended.
 */
export function generateDescription(input: string, maxLength = 160): string {
  if (input.length <= maxLength) return input;
  return input.slice(0, maxLength - 3) + '...';
}
