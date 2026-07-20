# Implementation Plan: Scalable AI Portfolio

## Overview

This plan implements the complete rebuild of Gajendra Mandal's portfolio website using Next.js 14+ App Router with static export. The implementation follows a bottom-up approach: project setup → data layer with Zod validation → reusable UI components → page assembly → scripts and deployment. All code is TypeScript with Tailwind CSS styling, Framer Motion animations, and fast-check property-based tests.

## Tasks

- [x] 1. Set up project structure and configuration
  - [x] 1.1 Initialize Next.js 14+ project with TypeScript, Tailwind CSS, and App Router
    - Run `npx create-next-app@latest` with TypeScript, Tailwind, App Router, and src disabled
    - Install dependencies: `zod`, `framer-motion`, `remark`, `remark-html`, `rehype`, `next-sitemap`, `sharp`
    - Install dev dependencies: `fast-check`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`
    - Configure `next.config.js` with `output: 'export'` and `images: { unoptimized: true }` for static export
    - Configure `tailwind.config.ts` with purple/violet gradient theme colors (`#667eea`, `#764ba2`)
    - Create `.env.example` with `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_PATH` variables
    - _Requirements: 11.1, 9.1_

  - [x] 1.2 Create data directory structure and seed JSON data files
    - Create `data/` directory with `projects.json`, `publications.json`, `blog.json`, `gallery.json`, `skills.json`, `profile.json`
    - Create `data/markdown/` directory for blog post Markdown files
    - Populate each file with at least 2-3 sample entries matching the schema specifications
    - Move existing images from `images/` to `public/images/` and `files/` to `public/files/`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 2. Implement Zod schema validation layer
  - [x] 2.1 Create Zod schemas for all data files
    - Create `lib/schemas.ts` with `ProjectSchema`, `ProjectsFileSchema`, `PublicationSchema`, `PublicationsFileSchema`
    - Add `BlogEntrySchema` with `.refine()` for exactly-one-source constraint, `BlogFileSchema`
    - Add `GalleryItemSchema`, `GalleryFileSchema`, `SkillCategorySchema`, `SkillsFileSchema`
    - Add `ProfileSchema` with nested `socialLinks`, `stats`, and `timeline` arrays
    - Export all inferred TypeScript types using `z.infer<>`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.8, 1.9_

  - [x] 2.2 Create data loading and validation utility functions
    - Create `lib/data.ts` with `loadAndValidate<T>()` generic function
    - Implement `getProjects()`, `getPublications()`, `getBlogEntries()`, `getGalleryItems()`, `getSkills()`, `getProfile()`
    - Ensure validation errors include file path, entry index, and field path in error messages
    - Throw descriptive errors that halt the Next.js build on failure
    - _Requirements: 1.7, 1.8, 1.9_

  - [x] 2.3 Create Markdown parsing utility
    - Create `lib/markdown.ts` with `parseMarkdown(content: string): Promise<string>` function
    - Use `remark` and `remark-html` to parse Markdown to HTML (headings, bold, italic, links, code blocks, lists, blockquotes)
    - Add `getMarkdownContent(filePath: string): Promise<string>` for file-based blog entries
    - _Requirements: 4.2, 4.4_

  - [x] 2.4 Write property tests for schema validation (Properties 1-3)
    - **Property 1: Schema validation accepts valid data and rejects invalid data**
    - **Property 2: Blog entry exactly-one-source constraint**
    - **Property 3: Validation errors reference correct file and field path**
    - Create fast-check arbitraries: `arbitraryProject()`, `arbitraryPublication()`, `arbitraryBlogEntry()`, `arbitraryGalleryItem()`, `arbitrarySkillCategory()`, `arbitraryProfile()`
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.8, 1.9**

- [x] 3. Implement layout components and theme
  - [x] 3.1 Create root layout with metadata, fonts, and global styles
    - Create `app/layout.tsx` with site-wide metadata (title, description, Open Graph defaults)
    - Set up Tailwind global styles with the purple/violet gradient background (`bg-gradient-to-br from-[#667eea] to-[#764ba2]`)
    - Add `min-h-screen` and base font configuration
    - Include the Navbar and FloatingElements components
    - _Requirements: 9.1, 12.1, 12.2_

  - [x] 3.2 Create Navbar component with responsive mobile menu
    - Create `components/layout/Navbar.tsx` as a client component
    - Implement sticky positioning with dark background (opacity 0.85), backdrop blur (8px), and sufficient z-index
    - Add all 6 navigation links: Home, Skills, Projects, Publications, Blog Posts, Gallery
    - Implement hamburger button that toggles vertical menu for viewport < 768px
    - Show horizontal links for tablet (768-1024px) with reduced spacing and full desktop (>1024px)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 9.4_

  - [x] 3.3 Create FloatingElements background animation component
    - Create `components/layout/FloatingElements.tsx`
    - Render 3-6 circular div elements (40-100px diameter) with absolute positioning behind content
    - Apply CSS keyframe animations (4-8s duration loop) with `pointer-events: none`
    - Respect `prefers-reduced-motion` by disabling animations when set
    - _Requirements: 9.2, 9.5_

  - [x] 3.4 Create ScrollReveal animation wrapper component
    - Create `components/animations/ScrollReveal.tsx` using Framer Motion
    - Animate from `opacity: 0, translateY(30px)` to `opacity: 1, translateY(0)` over 600ms
    - Use Intersection Observer with 10% visibility threshold
    - Disable animation when `prefers-reduced-motion` is enabled
    - _Requirements: 9.3, 9.5_

- [x] 4. Implement reusable UI components
  - [x] 4.1 Create FilterButtons and SearchInput components
    - Create `components/ui/FilterButtons.tsx` accepting categories array, activeCategory, and onChange callback
    - Style active filter with distinct visual (solid purple background vs transparent)
    - Create `components/ui/SearchInput.tsx` with debounced input (300ms default)
    - Create `lib/constants.ts` with project categories and publication categories arrays
    - _Requirements: 2.2, 3.2, 3.3_

  - [x] 4.2 Create ProjectCard component
    - Create `components/ui/ProjectCard.tsx` displaying title, description (truncated at 150 chars with ellipsis), category badge, technology tags (max 4), status badge, and action links
    - Style status badges: "completed" → green, "ongoing" → amber, "planned" → purple
    - Omit GitHub/demo links when URLs are undefined (no broken links)
    - Apply responsive card styling with min-width 350px
    - _Requirements: 2.1, 2.4, 2.5, 2.6_

  - [x] 4.3 Create PublicationCard and BlogCard components
    - Create `components/ui/PublicationCard.tsx` showing title, authors, venue, year badge, abstract (truncated 200 chars), tags, and paper link
    - Create `components/ui/BlogCard.tsx` showing title, formatted date ("MMM DD, YYYY"), description, and external indicator for `externalUrl` entries
    - BlogCard links to `/blog/[slug]` for local posts or opens external URL in new tab
    - _Requirements: 3.4, 4.1, 4.3_

  - [x] 4.4 Create EmptyState, StatCard, SkillCard, and Timeline components
    - Create `components/ui/EmptyState.tsx` with configurable message and optional icon
    - Create `components/ui/StatCard.tsx` displaying value and label from profile stats
    - Create `components/ui/SkillCard.tsx` showing category heading and list of skill items
    - Create `components/ui/Timeline.tsx` rendering journey entries in reverse-chronological order
    - _Requirements: 2.7, 3.5, 6.3, 6.4, 7.1_

  - [x] 4.5 Create GalleryGrid and Lightbox components
    - Create `components/ui/GalleryGrid.tsx` with responsive grid (2 cols mobile, up to 4 cols desktop)
    - Create `components/ui/Lightbox.tsx` as modal overlay showing full image, title, description, date
    - Implement close on Escape key, click outside image, and close button
    - Trap focus within lightbox when open
    - _Requirements: 5.1, 5.2_

  - [x] 4.6 Write property tests for filtering and text utilities (Properties 4-9)
    - **Property 4: Category filtering returns only matching items**
    - **Property 5: Publication search with category filter applies AND condition**
    - **Property 6: Dynamic category derivation from data**
    - **Property 7: Text truncation preserves content within length limits**
    - **Property 8: Optional field omission produces no broken output**
    - **Property 9: Date-based sorting produces correct descending order**
    - **Validates: Requirements 2.3, 2.4, 2.6, 3.3, 3.4, 4.1, 5.3, 6.4**

- [x] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement page components
  - [x] 6.1 Create Home/Profile page
    - Create `app/page.tsx` as a Server Component loading data from `getProfile()`
    - Render hero section with "AI Researcher & ML Engineer" title and expertise subtitle
    - Render profile section with photo, name, bio, social links (GitHub, LinkedIn, email, phone), and resume download button
    - Render 4 StatCards and Timeline with ScrollReveal wrappers
    - Add fallback error display if profile data fails to load
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [x] 6.2 Create Skills page
    - Create `app/skills/page.tsx` as a Server Component loading data from `getSkills()`
    - Render SkillCards in order from data file with ScrollReveal animations
    - Display empty state message if no skills available
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 6.3 Create Projects page with client-side filtering
    - Create `app/projects/page.tsx` loading projects via `getProjects()` and passing to a client component
    - Implement FilterButtons with categories: All, Machine Learning, NLP & AI, Computer Vision, Web Development, Research
    - Default to "All" filter showing every project on load
    - Filter with CSS transition ≤ 400ms, show EmptyState when no projects match
    - _Requirements: 2.1, 2.2, 2.3, 2.7_

  - [x] 6.4 Create Publications page with search and filter
    - Create `app/publications/page.tsx` loading publications and passing to a client component
    - Implement FilterButtons with categories: All, Journal, Conference, Workshop, Preprint, Book
    - Implement SearchInput filtering by title, authors, or year within 300ms
    - Apply AND condition between search query and active category filter
    - Show EmptyState when no publications match
    - _Requirements: 3.1, 3.2, 3.3, 3.5_

  - [x] 6.5 Create Blog listing page and individual post pages
    - Create `app/blog/page.tsx` displaying blog entries sorted by date descending
    - Create `app/blog/[slug]/page.tsx` with `generateStaticParams()` for static generation
    - Render inline `content` or referenced `markdown` file as parsed HTML in post view
    - Show external indicator on cards with `externalUrl`, open in new tab
    - Show fallback message if blog data fails to load or markdown file is unavailable
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [x] 6.6 Create Gallery page with filtering and lightbox
    - Create `app/gallery/page.tsx` loading gallery items and passing to a client component
    - Derive filter categories dynamically from unique categories in data
    - Implement GalleryGrid with Lightbox on image click
    - Show EmptyState if no gallery items available
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 6.7 Write property test for Markdown parsing (Property 10)
    - **Property 10: Markdown parsing produces valid HTML containing expected elements**
    - Create `arbitraryMarkdown()` generator producing strings with headings, bold, links, code blocks
    - Verify output contains corresponding HTML elements
    - **Validates: Requirements 4.2**

- [x] 7. Implement SEO and performance optimizations
  - [x] 7.1 Configure page-level metadata and Open Graph tags
    - Add `metadata` export to each page with title (≤60 chars), description (≤160 chars), and OG tags
    - Set site-wide defaults in `app/layout.tsx` for fallback meta description and OG image
    - Apply lazy loading to all below-fold images via `loading="lazy"` attribute
    - _Requirements: 12.1, 12.2, 12.4_

  - [x] 7.2 Configure next-sitemap for sitemap generation
    - Install and configure `next-sitemap` in `next-sitemap.config.js`
    - Generate `sitemap.xml` at site root listing all pages: Home, Skills, Projects, Publications, Blog Posts, Gallery, and individual blog posts
    - Add `postbuild` script to `package.json` running next-sitemap
    - _Requirements: 12.5_

  - [x] 7.3 Write property test for meta tag constraints (Property 14)
    - **Property 14: Meta tag length constraints**
    - Verify title ≤ 60 characters and description ≤ 160 characters for any input
    - **Validates: Requirements 12.1**

- [x] 8. Implement GitHub sync script and deployment
  - [x] 8.1 Create GitHub repository auto-sync script
    - Create `scripts/sync-github.ts` fetching public repos for user "gajendramandal" (max 100, 30s timeout)
    - Transform API response: repo name → title, description (or ""), language + topics → technologies, html_url → githubUrl, stargazers_count → stars
    - Add `source: "github"` and `repoFullName` fields to synced entries
    - Merge logic: preserve manual entries, update existing GitHub entries by `repoFullName`, add new ones
    - Exit with non-zero code and error message on API failure without modifying existing file
    - Add `"sync-github"` script to `package.json`
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [x] 8.2 Write property tests for GitHub sync (Properties 12-13)
    - **Property 12: GitHub API response transformation correctness**
    - **Property 13: GitHub sync merge preserves manual entries and correctly upserts**
    - Create `arbitraryGitHubRepo()` generator for API response objects
    - **Validates: Requirements 10.2, 10.3, 10.4**

  - [x] 8.3 Create deployment scripts and Docker configuration
    - Create `scripts/deploy.sh` that builds (`next build`), checks exit code, then rsyncs `out/` to remote server
    - Read `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_PATH` from environment or `.env` file
    - Halt and report error if build fails or env variables are missing
    - Create `Dockerfile` packaging `out/` with Nginx for containerized deployment
    - Create `docker-compose.yml` for the Nginx container
    - Add `"deploy"` script to `package.json`
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 9. Implement input order and rendering property tests
  - [x] 9.1 Write property test for input order preservation (Property 11)
    - **Property 11: Input order preservation in rendering**
    - Verify skills are rendered in same order as input array
    - **Validates: Requirements 7.2**

- [x] 10. Final checkpoint - Ensure all tests pass and build succeeds
  - Run `npm run build` to verify static export generates successfully in `out/`
  - Run `npx vitest --run` to verify all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The project uses TypeScript throughout as specified in the design document
- All data loading happens at build time via React Server Components — no runtime API calls
- The `output: 'export'` config ensures fully static HTML/CSS/JS output

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["2.1"] },
    { "id": 3, "tasks": ["2.2", "2.3"] },
    { "id": 4, "tasks": ["2.4", "3.1"] },
    { "id": 5, "tasks": ["3.2", "3.3", "3.4"] },
    { "id": 6, "tasks": ["4.1", "4.2", "4.3", "4.4", "4.5"] },
    { "id": 7, "tasks": ["4.6"] },
    { "id": 8, "tasks": ["6.1", "6.2", "6.3", "6.4", "6.5", "6.6"] },
    { "id": 9, "tasks": ["6.7", "7.1", "7.2"] },
    { "id": 10, "tasks": ["7.3", "8.1"] },
    { "id": 11, "tasks": ["8.2", "8.3", "9.1"] }
  ]
}
```
