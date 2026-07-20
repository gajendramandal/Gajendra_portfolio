# Requirements Document

## Introduction

A scalable, data-driven portfolio website for Gajendra Mandal (AI Researcher & ML Engineer). The portfolio is rebuilt from scratch using a modern static site generator (Next.js) with JSON/Markdown data files for content management. Adding a new project, blog post, or publication requires only adding a data file entry — no code changes needed. The site supports optional GitHub repository auto-sync and is designed for easy deployment and updates on an Oracle Cloud server.

## Glossary

- **Portfolio_Site**: The Next.js-based static/server-rendered portfolio website
- **Data_Layer**: The collection of JSON and Markdown files that store all dynamic content (projects, publications, blog posts, gallery items, skills, profile info)
- **Content_Entry**: A single JSON object or Markdown file representing one item (project, blog post, publication, or gallery image)
- **GitHub_Sync_Script**: A script that fetches repository metadata from the GitHub API and updates the projects data file
- **Build_System**: The Next.js build pipeline that generates the production-ready site from source code and data files
- **Deploy_Script**: A shell script or CI workflow that builds and deploys the site to the Oracle Cloud server
- **Navigation_Bar**: The persistent site-wide navigation component with links to all sections
- **Project_Card**: A UI component displaying a single project with title, description, technologies, category, links, and status
- **Filter_System**: The client-side mechanism for filtering displayed items by category or search query
- **Theme_System**: The CSS/design system providing the visual identity (colors, gradients, typography, animations)

## Requirements

### Requirement 1: Data-Driven Content Architecture

**User Story:** As a portfolio owner, I want all content stored in JSON and Markdown data files, so that I can add or update projects, blog posts, publications, and gallery items without modifying source code.

#### Acceptance Criteria

1. THE Data_Layer SHALL store project entries in a `data/projects.json` file where each entry contains the required fields title (max 150 characters), description (max 500 characters), category, technologies (list of 1 to 20 items), status (one of "completed", "ongoing", or "planned"), and date (ISO 8601 format YYYY-MM-DD), and the optional fields GitHub URL and demo URL
2. THE Data_Layer SHALL store publication entries in a `data/publications.json` file where each entry contains the required fields title (max 200 characters), authors, venue, year (four-digit integer), and category (one of "journal", "conference", "workshop", "preprint", or "book"), and the optional fields abstract (max 1000 characters), tags (list of up to 10 items), and link
3. THE Data_Layer SHALL store blog post entries in a `data/blog.json` file where each entry contains the required fields title (max 150 characters), date (ISO 8601 format YYYY-MM-DD), and description (max 300 characters), and exactly one content source: either an inline content string, a markdown field referencing a Markdown file path, or an externalUrl field containing a URL
4. THE Data_Layer SHALL store gallery entries in a `data/gallery.json` file where each entry contains the required fields image (relative path to an image file), title (max 150 characters), date (ISO 8601 format YYYY-MM-DD), and category, and the optional fields description (max 500 characters) and location
5. THE Data_Layer SHALL store skills in a `data/skills.json` file where each entry contains a category name (max 100 characters) and a list of 1 to 50 skill items
6. THE Data_Layer SHALL store profile information in a `data/profile.json` file containing the required fields name, title, bio (max 2000 characters), and social links (list of objects each with a label and URL), and the optional fields stats (list of up to 10 items each with a value and label) and timeline entries (list of up to 30 items each with a date and description)
7. WHEN a new Content_Entry is added to any data file, THE Build_System SHALL render the new entry on the corresponding page in the next build output without requiring code changes
8. IF a data file contains invalid JSON or a required field is missing from an entry, THEN THE Build_System SHALL fail the build and produce an error message indicating which file and entry has the validation error
9. IF a blog entry specifies more than one content source or no content source, THEN THE Build_System SHALL fail the build and produce an error message indicating the invalid blog entry

### Requirement 2: Project Section with Filtering

**User Story:** As a visitor, I want to browse projects filtered by category, so that I can find relevant work in specific domains like ML, NLP, or Computer Vision.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL display all projects from `data/projects.json` as Project_Cards in a responsive grid layout with a minimum card width of 350 pixels and columns that auto-fit the available container width
2. THE Filter_System SHALL provide category filter buttons (All, Machine Learning, NLP & AI, Computer Vision, Web Development, Research) and SHALL set the "All" filter as active by default on page load, displaying every project
3. WHEN a filter button is selected, THE Filter_System SHALL hide projects not matching the selected category and show matching projects with a CSS transition lasting no longer than 400 milliseconds
4. THE Project_Card SHALL display the project title, description (truncated to a maximum of 150 characters with an ellipsis if longer), category badge, technology tags (displaying up to 4 tags), status indicator, and action links (GitHub, demo)
5. WHEN a project entry has a status of "completed", "ongoing", or "planned", THE Project_Card SHALL display a colored status badge where "completed" uses a green background, "ongoing" uses an amber/yellow background, and "planned" uses a purple background
6. IF a project entry is missing the GitHub URL or demo URL field, THEN THE Project_Card SHALL omit the corresponding action link rather than rendering a broken or empty link
7. IF `data/projects.json` contains zero project entries, THEN THE Portfolio_Site SHALL display an empty-state message indicating no projects are available instead of rendering an empty grid

### Requirement 3: Publications Section

**User Story:** As a visitor, I want to view academic publications with search and filter capabilities, so that I can find papers by topic or year.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL display all publications from `data/publications.json` in a responsive grid of publication cards with a minimum card width of 360px
2. THE Filter_System SHALL provide category filter buttons (All, Journal, Conference, Workshop, Preprint, Book) with "All" selected as the default active filter on page load, and SHALL visually distinguish the active filter from inactive filters
3. THE Portfolio_Site SHALL provide a search input that filters publications by title, author, or year within 300ms of the last keystroke, applying search results as an AND condition with the currently active category filter
4. WHEN a publication card is displayed, THE Portfolio_Site SHALL show the title, authors, venue, year badge, abstract excerpt truncated to a maximum of 200 characters, topic tags, and links to the paper
5. IF no publications match the current combination of active filter and search query, THEN THE Portfolio_Site SHALL display a message indicating that no matching publications were found

### Requirement 4: Blog Posts Section

**User Story:** As a portfolio owner, I want to publish blog posts using Markdown files or link to external articles, so that I can share knowledge with minimal effort.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL display all blog entries from `data/blog.json` as cards, each showing the entry's title, date formatted as "MMM DD, YYYY" (e.g., "Aug 27, 2025"), and description, sorted by date in descending order (newest first)
2. WHEN a blog entry has a `markdown` field, THE Portfolio_Site SHALL fetch the referenced Markdown file and render its content (headings, bold, italic, links, code blocks, lists, and blockquotes) within a dedicated post view accessible from the card
3. WHEN a blog entry has an `externalUrl` field, THE Portfolio_Site SHALL render the card with a visual indicator distinguishing it from local posts and open the external URL in a new browser tab when the user activates the card's read action
4. WHEN a blog entry has an inline `content` field, THE Portfolio_Site SHALL parse the content as Markdown and display the rendered result within a dedicated post view accessible from the card
5. IF `data/blog.json` fails to load or contains invalid JSON, THEN THE Portfolio_Site SHALL display fallback content indicating that blog posts are unavailable rather than showing an empty or broken page
6. IF a referenced Markdown file in a blog entry's `markdown` field fails to load, THEN THE Portfolio_Site SHALL display a message within the post view indicating that the content is not available

### Requirement 5: Gallery Section

**User Story:** As a visitor, I want to browse a photo gallery with category filtering, so that I can see campus life and research environment photos.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL display all gallery items from `data/gallery.json` in a responsive grid layout with a minimum of 2 columns on mobile and up to 4 columns on desktop viewports
2. WHEN a gallery image is clicked, THE Portfolio_Site SHALL display the image in a lightbox overlay showing the full-resolution image, title, description, and date, with a close button and the ability to dismiss by clicking outside the image or pressing the Escape key
3. THE Filter_System SHALL provide category filter buttons derived from the unique categories present in `data/gallery.json`, with "All" as the default active filter
4. IF `data/gallery.json` contains zero entries or fails to load, THEN THE Portfolio_Site SHALL display an informational message indicating no gallery items are available

### Requirement 6: Home and Profile Section

**User Story:** As a visitor, I want to see a professional overview of Gajendra's profile, education, experience, and achievements on the home page, so that I can quickly understand his background.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL display a hero section with the title "AI Researcher & ML Engineer" and a subtitle listing the expertise areas: "Machine Learning, Computer Vision, Data Science, AI-driven Solutions, End-to-End Project Development"
2. THE Portfolio_Site SHALL display a profile section containing a profile photo, full name, biographical text of at least 50 characters, and social links (GitHub, LinkedIn, email, phone, and a resume download button), all loaded from `data/profile.json`
3. THE Portfolio_Site SHALL display exactly 4 statistics cards (publications count, education period, research internship, and project count) with values loaded from `data/profile.json`
4. THE Portfolio_Site SHALL display a timeline of journey entries (education, internships, projects, achievements, volunteering) in reverse-chronological order, with each entry showing a date or label and a description, loaded from `data/profile.json`
5. WHEN a visitor clicks the resume download button, THE Portfolio_Site SHALL initiate a file download of the resume PDF from the `/files/` directory
6. IF `data/profile.json` fails to load or is unavailable, THEN THE Portfolio_Site SHALL display a fallback error message indicating that profile data could not be loaded, within the profile section area

### Requirement 7: Skills Section

**User Story:** As a visitor, I want to see Gajendra's technical skills organized by category, so that I can assess his capabilities.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL display skill categories and their items from `data/skills.json` as individual cards, where each card shows the category name as a heading and lists all skill items belonging to that category
2. THE Portfolio_Site SHALL display one card for each category defined in `data/skills.json`, rendered in the order they appear in the file (default groups: Programming Languages, Data Science & ML, Tools & Technologies)
3. IF `data/skills.json` is empty or fails to load, THEN THE Portfolio_Site SHALL display an informational message indicating that no skills are available instead of rendering an empty section

### Requirement 8: Navigation and Responsive Layout

**User Story:** As a visitor, I want consistent navigation and a responsive design, so that I can browse the portfolio on any device.

#### Acceptance Criteria

1. THE Navigation_Bar SHALL provide links to Home, Skills, Projects, Publications, Blog Posts, and Gallery sections
2. THE Navigation_Bar SHALL remain sticky at the top of the viewport during scrolling with a z-index sufficient to overlay page content
3. WHILE the viewport width is below 768 pixels, THE Portfolio_Site SHALL hide the full navigation links and display a hamburger icon button that toggles a vertical menu overlay or dropdown containing all navigation links
4. WHILE the viewport width is between 768 and 1024 pixels (tablet), THE Portfolio_Site SHALL display the navigation links horizontally with reduced spacing and adjust content grids to a maximum of 2 columns
5. WHILE the viewport width is above 1024 pixels (desktop), THE Portfolio_Site SHALL display the full navigation links horizontally and content grids at their maximum column count

### Requirement 9: Visual Theme and Animations

**User Story:** As a portfolio owner, I want a professional dark/gradient theme with subtle animations, so that the site conveys a modern AI/ML engineer identity.

#### Acceptance Criteria

1. THE Theme_System SHALL use a purple/violet linear gradient background at 135 degrees (from #667eea to #764ba2) applied to the page body
2. THE Theme_System SHALL display between 3 and 6 floating background elements as circular shapes ranging from 40px to 100px in diameter, each animated using a CSS keyframe loop with a duration between 4 and 8 seconds, and positioned behind all interactive content using pointer-events: none
3. WHEN a card or timeline item scrolls into the viewport past a 10% visibility threshold, THE Portfolio_Site SHALL animate the element from an initial state of opacity 0 and translateY(20px–30px) to opacity 1 and translateY(0) over a duration of 400 to 800 milliseconds
4. THE Navigation_Bar SHALL use a fixed or sticky dark background with opacity between 0.80 and 0.90 and a backdrop blur radius between 6px and 10px
5. IF the user has enabled a prefers-reduced-motion accessibility setting, THEN THE Portfolio_Site SHALL disable all floating element animations and entrance transition animations, displaying content in its final visible state without motion

### Requirement 10: GitHub Repository Auto-Sync

**User Story:** As a portfolio owner, I want the option to automatically pull my public GitHub repositories into the projects list, so that new repos appear on the site without manual data entry.

#### Acceptance Criteria

1. THE GitHub_Sync_Script SHALL fetch public repository metadata from the GitHub API for the user "gajendramandal", retrieving at most 100 repositories per execution with a request timeout of 30 seconds
2. THE GitHub_Sync_Script SHALL generate or update entries in `data/projects.json` with repository name as title, repository description as description (or an empty string if the repository has no description), primary language as a technology tag (or omitted if null), topics as technology tags, stargazers count, and the repository HTML URL as the GitHub URL
3. THE GitHub_Sync_Script SHALL identify GitHub-sourced entries by the presence of a `source: "github"` field in the project entry, and SHALL use the repository full name as the unique matching key when determining whether to create a new entry or update an existing one
4. WHEN the GitHub_Sync_Script is executed, THE GitHub_Sync_Script SHALL preserve all project entries in `data/projects.json` that do not have a `source: "github"` field, leaving their content unmodified
5. IF the GitHub API request fails or times out, THEN THE GitHub_Sync_Script SHALL exit with a non-zero exit code and an error message indicating the failure reason, without modifying the existing `data/projects.json` file
6. THE GitHub_Sync_Script SHALL be executable as a standalone command (e.g., `npm run sync-github`) for manual or scheduled invocation, and SHALL exit with code 0 on success

### Requirement 11: Easy Server Deployment

**User Story:** As a portfolio owner, I want a simple deployment process for Oracle Cloud, so that I can update the live site with minimal effort.

#### Acceptance Criteria

1. THE Build_System SHALL produce a static export (HTML, CSS, JS files) in an `out/` directory suitable for serving directly via Nginx without requiring a Node.js runtime on the server
2. THE Deploy_Script SHALL provide a single command (`npm run deploy`) that builds the static export and transfers the output to the Oracle Cloud server via SSH/rsync
3. THE Deploy_Script SHALL read the remote server host, user, and destination path from environment variables or a `.env` configuration file so that credentials are not hardcoded in the script
4. IF the build process fails (non-zero exit code), THEN THE Deploy_Script SHALL report the error message to stderr and halt without transferring any files to the remote server
5. THE Deploy_Script SHALL provide a Dockerfile and docker-compose.yml that packages the static export with Nginx for containerized deployment as an alternative to rsync

### Requirement 12: SEO and Performance

**User Story:** As a portfolio owner, I want the site to load fast and rank well in search engines, so that recruiters and collaborators can find me easily.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL generate meta tags for each page including a title (maximum 60 characters), a meta description (maximum 160 characters), and Open Graph tags (og:title, og:description, og:image, og:url)
2. IF a page does not have page-specific description or image data available, THEN THE Portfolio_Site SHALL fall back to site-wide default meta description and default Open Graph image
3. THE Portfolio_Site SHALL achieve a Lighthouse performance score above 90 on desktop and above 80 on mobile when tested on pages containing fewer than 50 content items
4. THE Portfolio_Site SHALL apply lazy loading to all images positioned below the initial viewport and serve images in WebP format with JPEG or PNG fallback
5. THE Portfolio_Site SHALL generate a sitemap.xml at the site root that lists all publicly accessible pages including Home, Skills, Projects, Publications, Blog Posts, Gallery, and individual blog post pages
