import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import {
  ProjectsFileSchema,
  PublicationsFileSchema,
  BlogFileSchema,
  GalleryFileSchema,
  SkillsFileSchema,
  ProfileSchema,
} from '@/lib/schemas';
import type {
  Project,
  Publication,
  BlogEntry,
  GalleryItem,
  SkillCategory,
  Profile,
} from '@/lib/schemas';

/**
 * Generic data loading and validation function.
 * Reads a JSON file, parses it, and validates against a Zod schema.
 * Throws descriptive errors that halt the Next.js build on failure.
 */
export function loadAndValidate<T>(filePath: string, schema: z.ZodType<T>): T {
  const fullPath = path.join(process.cwd(), filePath);

  let raw: string;
  try {
    raw = fs.readFileSync(fullPath, 'utf-8');
  } catch (e) {
    throw new Error(
      `Failed to read file ${filePath}: ${(e as Error).message}`
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(`Invalid JSON in ${filePath}: ${(e as Error).message}`);
  }

  const result = schema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => {
        const fieldPath = i.path.length > 0 ? `[${i.path.join('.')}]` : '';
        return `  - ${fieldPath}: ${i.message}`;
      })
      .join('\n');
    throw new Error(`Validation failed for ${filePath}:\n${issues}`);
  }

  return result.data;
}

/** Load and validate all projects from data/projects.json */
export function getProjects(): Project[] {
  return loadAndValidate('data/projects.json', ProjectsFileSchema);
}

/** Load and validate all publications from data/publications.json */
export function getPublications(): Publication[] {
  return loadAndValidate('data/publications.json', PublicationsFileSchema);
}

/** Load and validate all blog entries from data/blog.json */
export function getBlogEntries(): BlogEntry[] {
  return loadAndValidate('data/blog.json', BlogFileSchema);
}

/** Load and validate all gallery items from data/gallery.json */
export function getGalleryItems(): GalleryItem[] {
  return loadAndValidate('data/gallery.json', GalleryFileSchema);
}

/** Load and validate all skill categories from data/skills.json */
export function getSkills(): SkillCategory[] {
  return loadAndValidate('data/skills.json', SkillsFileSchema);
}

/** Load and validate profile data from data/profile.json */
export function getProfile(): Profile {
  return loadAndValidate('data/profile.json', ProfileSchema);
}
