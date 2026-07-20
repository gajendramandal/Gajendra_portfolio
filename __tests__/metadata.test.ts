import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { generateTitle, generateDescription } from '@/lib/metadata';

// ─── Property Tests ───────────────────────────────────────────────────────────

describe('Feature: scalable-ai-portfolio, Property 14: Meta tag length constraints', () => {
  /**
   * Validates: Requirements 12.1
   */

  it('generateTitle output never exceeds 60 characters for any input', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 1000 }),
        (input) => {
          const result = generateTitle(input);
          expect(result.length).toBeLessThanOrEqual(60);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('generateDescription output never exceeds 160 characters for any input', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 2000 }),
        (input) => {
          const result = generateDescription(input);
          expect(result.length).toBeLessThanOrEqual(160);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('if input ≤ 60 characters, generateTitle returns input unchanged', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 60 }),
        (input) => {
          const result = generateTitle(input);
          expect(result).toBe(input);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('if input ≤ 160 characters, generateDescription returns input unchanged', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 160 }),
        (input) => {
          const result = generateDescription(input);
          expect(result).toBe(input);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('if input > 60 characters, generateTitle truncates with "..." suffix', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 61, maxLength: 1000 }),
        (input) => {
          const result = generateTitle(input);

          // Must end with "..."
          expect(result.endsWith('...')).toBe(true);

          // Length must be exactly 60
          expect(result.length).toBe(60);

          // First 57 characters match input
          expect(result.slice(0, 57)).toBe(input.slice(0, 57));
        }
      ),
      { numRuns: 100 }
    );
  });

  it('if input > 160 characters, generateDescription truncates with "..." suffix', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 161, maxLength: 2000 }),
        (input) => {
          const result = generateDescription(input);

          // Must end with "..."
          expect(result.endsWith('...')).toBe(true);

          // Length must be exactly 160
          expect(result.length).toBe(160);

          // First 157 characters match input
          expect(result.slice(0, 157)).toBe(input.slice(0, 157));
        }
      ),
      { numRuns: 100 }
    );
  });
});
