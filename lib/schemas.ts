import { z } from 'zod';

// ─── Project Schema ──────────────────────────────────────────────────────────

export const ProjectSchema = z.object({
  title: z.string().max(150),
  description: z.string().max(500),
  category: z.string(),
  technologies: z.array(z.string()).min(1).max(20),
  status: z.enum(['completed', 'ongoing', 'planned']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  githubUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  source: z.literal('github').optional(),
  repoFullName: z.string().optional(),
  stars: z.number().optional(),
});

export const ProjectsFileSchema = z.array(ProjectSchema);

// ─── Publication Schema ──────────────────────────────────────────────────────

export const PublicationSchema = z.object({
  title: z.string().max(200),
  authors: z.string(),
  venue: z.string(),
  year: z.number().int().min(1900).max(2100),
  category: z.enum(['journal', 'conference', 'workshop', 'preprint', 'book']),
  abstract: z.string().max(1000).optional(),
  tags: z.array(z.string()).max(10).optional(),
  link: z.string().url().optional(),
});

export const PublicationsFileSchema = z.array(PublicationSchema);

// ─── Blog Entry Schema ───────────────────────────────────────────────────────

export const BlogEntrySchema = z.object({
  title: z.string().max(150),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().max(300),
  content: z.string().optional(),
  markdown: z.string().optional(),
  externalUrl: z.string().url().optional(),
}).refine(
  (entry) => {
    const sources = [entry.content, entry.markdown, entry.externalUrl]
      .filter(Boolean).length;
    return sources === 1;
  },
  { message: 'Blog entry must have exactly one content source (content, markdown, or externalUrl)' }
);

export const BlogFileSchema = z.array(BlogEntrySchema);

// ─── Gallery Schema ──────────────────────────────────────────────────────────

export const GalleryItemSchema = z.object({
  image: z.string(),
  title: z.string().max(150),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  category: z.string(),
  description: z.string().max(500).optional(),
  location: z.string().optional(),
});

export const GalleryFileSchema = z.array(GalleryItemSchema);

// ─── Skills Schema ───────────────────────────────────────────────────────────

export const SkillCategorySchema = z.object({
  category: z.string().max(100),
  items: z.array(z.string()).min(1).max(50),
});

export const SkillsFileSchema = z.array(SkillCategorySchema);

// ─── Profile Schema ──────────────────────────────────────────────────────────

export const ProfileSchema = z.object({
  name: z.string(),
  title: z.string(),
  bio: z.string().max(2000),
  socialLinks: z.array(z.object({
    label: z.string(),
    url: z.string(),
  })),
  stats: z.array(z.object({
    value: z.string(),
    label: z.string(),
  })).max(10).optional(),
  timeline: z.array(z.object({
    date: z.string(),
    description: z.string(),
  })).max(30).optional(),
});

// ─── Inferred TypeScript Types ───────────────────────────────────────────────

export type Project = z.infer<typeof ProjectSchema>;
export type Publication = z.infer<typeof PublicationSchema>;
export type BlogEntry = z.infer<typeof BlogEntrySchema>;
export type GalleryItem = z.infer<typeof GalleryItemSchema>;
export type SkillCategory = z.infer<typeof SkillCategorySchema>;
export type Profile = z.infer<typeof ProfileSchema>;
