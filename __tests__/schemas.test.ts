import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  ProjectSchema,
  ProjectsFileSchema,
  PublicationSchema,
  PublicationsFileSchema,
  BlogEntrySchema,
  BlogFileSchema,
  GalleryItemSchema,
  GalleryFileSchema,
  SkillCategorySchema,
  SkillsFileSchema,
  ProfileSchema,
} from '@/lib/schemas';
import { loadAndValidate } from '@/lib/data';
import fs from 'fs';
import path from 'path';
import os from 'os';

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

/** Generate a non-empty string with a max length */
function arbitraryBoundedString(
  maxLength: number,
  minLength = 1
): fc.Arbitrary<string> {
  return fc.string({ minLength, maxLength });
}

// ─── Arbitraries ──────────────────────────────────────────────────────────────

function arbitraryProject(): fc.Arbitrary<Record<string, unknown>> {
  return fc.record({
    title: arbitraryBoundedString(150),
    description: arbitraryBoundedString(500),
    category: fc.string({ minLength: 1, maxLength: 50 }),
    technologies: fc.array(fc.string({ minLength: 1, maxLength: 30 }), {
      minLength: 1,
      maxLength: 20,
    }),
    status: fc.constantFrom('completed', 'ongoing', 'planned'),
    date: arbitraryDateString(),
    githubUrl: fc.option(arbitraryUrl(), { nil: undefined }),
    demoUrl: fc.option(arbitraryUrl(), { nil: undefined }),
  });
}

function arbitraryPublication(): fc.Arbitrary<Record<string, unknown>> {
  return fc.record({
    title: arbitraryBoundedString(200),
    authors: fc.string({ minLength: 1, maxLength: 100 }),
    venue: fc.string({ minLength: 1, maxLength: 100 }),
    year: fc.integer({ min: 1900, max: 2100 }),
    category: fc.constantFrom(
      'journal',
      'conference',
      'workshop',
      'preprint',
      'book'
    ),
    abstract: fc.option(arbitraryBoundedString(1000), { nil: undefined }),
    tags: fc.option(
      fc.array(fc.string({ minLength: 1, maxLength: 30 }), {
        minLength: 0,
        maxLength: 10,
      }),
      { nil: undefined }
    ),
    link: fc.option(arbitraryUrl(), { nil: undefined }),
  });
}

function arbitraryBlogEntry(): fc.Arbitrary<Record<string, unknown>> {
  // Always generate exactly one source
  return fc
    .record({
      title: arbitraryBoundedString(150),
      date: arbitraryDateString(),
      description: arbitraryBoundedString(300),
    })
    .chain((base) =>
      fc
        .constantFrom('content', 'markdown', 'externalUrl')
        .chain((sourceType) => {
          if (sourceType === 'content') {
            return fc
              .string({ minLength: 1, maxLength: 200 })
              .map((content) => ({ ...base, content }));
          } else if (sourceType === 'markdown') {
            return fc
              .string({ minLength: 1, maxLength: 50 })
              .map((markdown) => ({ ...base, markdown }));
          } else {
            return arbitraryUrl().map((externalUrl) => ({
              ...base,
              externalUrl,
            }));
          }
        })
    );
}

function arbitraryGalleryItem(): fc.Arbitrary<Record<string, unknown>> {
  return fc.record({
    image: fc.string({ minLength: 1, maxLength: 100 }),
    title: arbitraryBoundedString(150),
    date: arbitraryDateString(),
    category: fc.string({ minLength: 1, maxLength: 50 }),
    description: fc.option(arbitraryBoundedString(500), { nil: undefined }),
    location: fc.option(fc.string({ minLength: 1, maxLength: 100 }), {
      nil: undefined,
    }),
  });
}

function arbitrarySkillCategory(): fc.Arbitrary<Record<string, unknown>> {
  return fc.record({
    category: arbitraryBoundedString(100),
    items: fc.array(fc.string({ minLength: 1, maxLength: 50 }), {
      minLength: 1,
      maxLength: 50,
    }),
  });
}

function arbitraryProfile(): fc.Arbitrary<Record<string, unknown>> {
  return fc.record({
    name: fc.string({ minLength: 1, maxLength: 100 }),
    title: fc.string({ minLength: 1, maxLength: 100 }),
    bio: arbitraryBoundedString(2000),
    socialLinks: fc.array(
      fc.record({
        label: fc.string({ minLength: 1, maxLength: 30 }),
        url: fc.string({ minLength: 1, maxLength: 100 }),
      }),
      { minLength: 0, maxLength: 5 }
    ),
    stats: fc.option(
      fc.array(
        fc.record({
          value: fc.string({ minLength: 1, maxLength: 20 }),
          label: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        { minLength: 0, maxLength: 10 }
      ),
      { nil: undefined }
    ),
    timeline: fc.option(
      fc.array(
        fc.record({
          date: fc.string({ minLength: 1, maxLength: 50 }),
          description: fc.string({ minLength: 1, maxLength: 200 }),
        }),
        { minLength: 0, maxLength: 30 }
      ),
      { nil: undefined }
    ),
  });
}

// ─── Property Tests ───────────────────────────────────────────────────────────

describe('Feature: scalable-ai-portfolio, Property 1: Schema validation accepts valid data and rejects invalid data', () => {
  /**
   * Validates: Requirements 1.1, 1.2, 1.4, 1.5, 1.6
   */

  it('ProjectSchema accepts valid project data', () => {
    fc.assert(
      fc.property(arbitraryProject(), (project) => {
        const result = ProjectSchema.safeParse(project);
        expect(result.success).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('ProjectSchema rejects project with title exceeding max length', () => {
    fc.assert(
      fc.property(arbitraryProject(), (project) => {
        const invalid = { ...project, title: 'x'.repeat(151) };
        const result = ProjectSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  it('ProjectSchema rejects project with empty technologies array', () => {
    fc.assert(
      fc.property(arbitraryProject(), (project) => {
        const invalid = { ...project, technologies: [] };
        const result = ProjectSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  it('ProjectSchema rejects project with invalid status', () => {
    fc.assert(
      fc.property(arbitraryProject(), (project) => {
        const invalid = { ...project, status: 'invalid-status' };
        const result = ProjectSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  it('ProjectSchema rejects project with invalid date format', () => {
    fc.assert(
      fc.property(arbitraryProject(), (project) => {
        const invalid = { ...project, date: '2024/01/15' };
        const result = ProjectSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  it('PublicationSchema accepts valid publication data', () => {
    fc.assert(
      fc.property(arbitraryPublication(), (publication) => {
        const result = PublicationSchema.safeParse(publication);
        expect(result.success).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('PublicationSchema rejects publication with year out of range', () => {
    fc.assert(
      fc.property(arbitraryPublication(), (publication) => {
        const invalid = { ...publication, year: 2200 };
        const result = PublicationSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  it('PublicationSchema rejects publication with invalid category', () => {
    fc.assert(
      fc.property(arbitraryPublication(), (publication) => {
        const invalid = { ...publication, category: 'thesis' };
        const result = PublicationSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  it('GalleryItemSchema accepts valid gallery item data', () => {
    fc.assert(
      fc.property(arbitraryGalleryItem(), (item) => {
        const result = GalleryItemSchema.safeParse(item);
        expect(result.success).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('GalleryItemSchema rejects gallery item with title exceeding max length', () => {
    fc.assert(
      fc.property(arbitraryGalleryItem(), (item) => {
        const invalid = { ...item, title: 'x'.repeat(151) };
        const result = GalleryItemSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  it('SkillCategorySchema accepts valid skill category data', () => {
    fc.assert(
      fc.property(arbitrarySkillCategory(), (skill) => {
        const result = SkillCategorySchema.safeParse(skill);
        expect(result.success).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('SkillCategorySchema rejects skill category with empty items', () => {
    fc.assert(
      fc.property(arbitrarySkillCategory(), (skill) => {
        const invalid = { ...skill, items: [] };
        const result = SkillCategorySchema.safeParse(invalid);
        expect(result.success).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  it('ProfileSchema accepts valid profile data', () => {
    fc.assert(
      fc.property(arbitraryProfile(), (profile) => {
        const result = ProfileSchema.safeParse(profile);
        expect(result.success).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('ProfileSchema rejects profile with bio exceeding max length', () => {
    fc.assert(
      fc.property(arbitraryProfile(), (profile) => {
        const invalid = { ...profile, bio: 'x'.repeat(2001) };
        const result = ProfileSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      }),
      { numRuns: 100 }
    );
  });
});

describe('Feature: scalable-ai-portfolio, Property 2: Blog entry exactly-one-source constraint', () => {
  /**
   * Validates: Requirements 1.3, 1.9
   */

  it('BlogEntrySchema passes when exactly one source is defined', () => {
    fc.assert(
      fc.property(arbitraryBlogEntry(), (entry) => {
        const result = BlogEntrySchema.safeParse(entry);
        expect(result.success).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('BlogEntrySchema fails when zero sources are defined', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: arbitraryBoundedString(150),
          date: arbitraryDateString(),
          description: arbitraryBoundedString(300),
        }),
        (entry) => {
          // No content, markdown, or externalUrl
          const result = BlogEntrySchema.safeParse(entry);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('BlogEntrySchema fails when two sources are defined', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: arbitraryBoundedString(150),
          date: arbitraryDateString(),
          description: arbitraryBoundedString(300),
          content: fc.string({ minLength: 1, maxLength: 100 }),
          markdown: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        (entry) => {
          const result = BlogEntrySchema.safeParse(entry);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('BlogEntrySchema fails when all three sources are defined', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: arbitraryBoundedString(150),
          date: arbitraryDateString(),
          description: arbitraryBoundedString(300),
          content: fc.string({ minLength: 1, maxLength: 100 }),
          markdown: fc.string({ minLength: 1, maxLength: 50 }),
          externalUrl: arbitraryUrl(),
        }),
        (entry) => {
          const result = BlogEntrySchema.safeParse(entry);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('BlogEntrySchema validates all combinations: exactly 1 passes, 0 or 2+ fails', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: arbitraryBoundedString(150),
          date: arbitraryDateString(),
          description: arbitraryBoundedString(300),
        }),
        fc.record({
          hasContent: fc.boolean(),
          hasMarkdown: fc.boolean(),
          hasExternalUrl: fc.boolean(),
        }),
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.string({ minLength: 1, maxLength: 50 }),
        arbitraryUrl(),
        (base, flags, content, markdown, externalUrl) => {
          const entry: Record<string, unknown> = { ...base };
          let sourceCount = 0;

          if (flags.hasContent) {
            entry.content = content;
            sourceCount++;
          }
          if (flags.hasMarkdown) {
            entry.markdown = markdown;
            sourceCount++;
          }
          if (flags.hasExternalUrl) {
            entry.externalUrl = externalUrl;
            sourceCount++;
          }

          const result = BlogEntrySchema.safeParse(entry);

          if (sourceCount === 1) {
            expect(result.success).toBe(true);
          } else {
            expect(result.success).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Feature: scalable-ai-portfolio, Property 3: Validation errors reference correct file and field path', () => {
  /**
   * Validates: Requirements 1.8
   */

  it('loadAndValidate error contains file path on validation failure', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 3, maxLength: 30 }).map((s) =>
          s.replace(/[^a-zA-Z0-9]/g, 'a')
        ),
        (filename) => {
          const filePath = `data/${filename}.json`;
          // Write invalid data (project missing required fields) to a temp file
          const tmpDir = os.tmpdir();
          const tmpFile = path.join(tmpDir, `${filename}.json`);
          const invalidData = JSON.stringify([{ title: 123 }]); // wrong type for title

          fs.writeFileSync(tmpFile, invalidData, 'utf-8');

          // We need to use the absolute path trick: loadAndValidate joins cwd() + filePath
          // Instead, test with a temporary directory as "cwd"
          const originalCwd = process.cwd;
          process.cwd = () => tmpDir;

          try {
            loadAndValidate(`${filename}.json`, ProjectsFileSchema);
            // If it doesn't throw, fail the test
            expect.fail('Expected loadAndValidate to throw');
          } catch (err) {
            const message = (err as Error).message;
            // Error should contain the file path
            expect(message).toContain(`${filename}.json`);
          } finally {
            process.cwd = originalCwd;
            fs.unlinkSync(tmpFile);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('loadAndValidate error contains the field path for invalid entries', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 5 }),
        (entryIndex) => {
          const tmpDir = os.tmpdir();
          const tmpFile = path.join(tmpDir, 'test-field-path.json');

          // Create an array with valid entries except one has an invalid title (too long)
          const entries = [];
          for (let i = 0; i <= entryIndex; i++) {
            if (i === entryIndex) {
              // Invalid entry: title is too long
              entries.push({
                title: 'x'.repeat(200),
                description: 'Valid desc',
                category: 'test',
                technologies: ['ts'],
                status: 'completed',
                date: '2024-01-15',
              });
            } else {
              entries.push({
                title: 'Valid Project',
                description: 'Valid desc',
                category: 'test',
                technologies: ['ts'],
                status: 'completed',
                date: '2024-01-15',
              });
            }
          }

          fs.writeFileSync(tmpFile, JSON.stringify(entries), 'utf-8');

          const originalCwd = process.cwd;
          process.cwd = () => tmpDir;

          try {
            loadAndValidate('test-field-path.json', ProjectsFileSchema);
            expect.fail('Expected loadAndValidate to throw');
          } catch (err) {
            const message = (err as Error).message;
            // Error should contain the file path
            expect(message).toContain('test-field-path.json');
            // Error should contain the field path referencing the entry index and field name
            expect(message).toContain(`${entryIndex}`);
            expect(message).toContain('title');
          } finally {
            process.cwd = originalCwd;
            fs.unlinkSync(tmpFile);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('loadAndValidate error for nested field paths references correct location', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 3 }),
        (entryIndex) => {
          const tmpDir = os.tmpdir();
          const tmpFile = path.join(tmpDir, 'test-nested-path.json');

          // Create entries where one has invalid technologies (not an array)
          const entries = [];
          for (let i = 0; i <= entryIndex; i++) {
            if (i === entryIndex) {
              entries.push({
                title: 'Project',
                description: 'Description',
                category: 'test',
                technologies: 'not-an-array', // Invalid: should be array
                status: 'completed',
                date: '2024-01-15',
              });
            } else {
              entries.push({
                title: 'Valid Project',
                description: 'Valid desc',
                category: 'test',
                technologies: ['ts'],
                status: 'completed',
                date: '2024-01-15',
              });
            }
          }

          fs.writeFileSync(tmpFile, JSON.stringify(entries), 'utf-8');

          const originalCwd = process.cwd;
          process.cwd = () => tmpDir;

          try {
            loadAndValidate('test-nested-path.json', ProjectsFileSchema);
            expect.fail('Expected loadAndValidate to throw');
          } catch (err) {
            const message = (err as Error).message;
            // Error should reference the file
            expect(message).toContain('test-nested-path.json');
            // Error should reference the entry index
            expect(message).toContain(`${entryIndex}`);
            // Error should reference the technologies field
            expect(message).toContain('technologies');
          } finally {
            process.cwd = originalCwd;
            fs.unlinkSync(tmpFile);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
