# Architecture & Technology Deep Dive

A complete breakdown of every technology used in this portfolio, how they work internally, and how the frontend/backend interact.

---

## Tech Stack Overview

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 16 (App Router) | Static site generation, file-based routing |
| Language | TypeScript | Type safety, compile-time error catching |
| Styling | Tailwind CSS v4 | Utility-first CSS framework |
| Animations | Framer Motion | React animation library |
| Canvas Animations | HTML5 Canvas API | Particle constellation, circuit grid |
| Data Validation | Zod v4 | Schema validation for JSON data |
| Markdown | Remark + Remark-HTML | Markdown to HTML parsing |
| SEO | next-sitemap | Sitemap/robots.txt generation |
| Testing | Vitest + fast-check | Unit and property-based testing |
| Deployment | rsync over SSH | Static file transfer to server |
| Web Server | Nginx | Serves static files in production |
| Containerization | Docker + Nginx | Alternative deployment method |

---

## How It Works: The Big Picture

```
┌─────────────────────────────────────────────────────┐
│                  YOUR LOCAL MACHINE                   │
│                                                      │
│  data/*.json  ──→  Zod Validation  ──→  Next.js Build │
│  app/*.tsx    ──→  React Components ──→  Static HTML  │
│                                                      │
│  Output: out/ folder (pure HTML/CSS/JS)              │
└────────────────────────┬────────────────────────────┘
                         │ rsync (SSH)
                         ▼
┌─────────────────────────────────────────────────────┐
│               ORACLE CLOUD SERVER                    │
│                                                      │
│  Nginx ──→ serves static files from /var/www/html/  │
│  No Node.js, no database, no backend runtime         │
│                                                      │
│  User visits gajendramandal.in ──→ gets HTML files   │
└─────────────────────────────────────────────────────┘
```

**Key insight: There is NO backend running in production.** Your site is 100% static HTML/CSS/JS files served by Nginx. All the "magic" happens at build time on your local machine.

---

## Frontend: How It Works

### Next.js App Router (The Framework)

**What it does:** Converts your React components + data into static HTML pages.

**How it works internally:**

1. **File-based routing:** Every file in `app/` becomes a URL route:
   - `app/page.tsx` → `gajendramandal.in/`
   - `app/projects/page.tsx` → `gajendramandal.in/projects`
   - `app/blog/[slug]/page.tsx` → `gajendramandal.in/blog/getting-started-with-ml`

2. **Server Components (default):** Pages are rendered at BUILD TIME, not in the browser. When you run `npm run build`:
   - Next.js executes your page components on your machine
   - Reads JSON data files using Node.js `fs.readFileSync`
   - Validates data with Zod schemas
   - Renders React components to static HTML strings
   - Outputs `.html` files to `out/`

3. **Client Components (`'use client'`):** Components that need interactivity (useState, onClick, animations) are bundled as JavaScript and sent to the browser. Examples:
   - `Navbar.tsx` (hamburger toggle)
   - `FilterButtons.tsx` (category selection)
   - `NeuralNetwork.tsx` (canvas animation)
   - `TypeWriter.tsx` (typing effect)

4. **Static Export (`output: 'export'`):** Instead of running a Node.js server, Next.js generates a folder of plain HTML/CSS/JS files. No server needed.

### React (UI Library)

**What it does:** Lets you write UI as components (reusable building blocks).

**How it works:**
- You write JSX (HTML-like syntax in JavaScript)
- React converts it to a virtual DOM (JavaScript object tree)
- At build time: React renders to HTML strings (server-side rendering)
- In browser: React "hydrates" the HTML — attaches event listeners to make it interactive

### TypeScript (Language)

**What it does:** Adds type checking to JavaScript. Catches errors before runtime.

**How it works:**
- You write `.tsx` files with type annotations
- TypeScript compiler (`tsc`) checks types at build time
- If there's a type error, the build fails (you see it, users never do)
- Output is plain JavaScript — browsers don't run TypeScript directly

### Tailwind CSS v4 (Styling)

**What it does:** Utility classes for styling (`text-white`, `p-4`, `rounded-xl`).

**How it works internally:**
1. You write classes in your JSX: `className="text-white bg-purple-500 p-4"`
2. At build time, Tailwind scans all your files for class names
3. Generates ONLY the CSS for classes you actually used (tree-shaking)
4. Output: one small CSS file with just your styles (no unused CSS bloat)

The custom styles in `globals.css` (`.glass-card`, `.gradient-text`, `.tech-tag`) are plain CSS that works alongside Tailwind.

### Framer Motion (Animations)

**What it does:** Declarative animations for React components.

**How it works:**
- `ScrollReveal.tsx` uses `motion.div` with `whileInView`
- Framer Motion uses the browser's Intersection Observer API to detect when elements enter the viewport
- Applies CSS transforms (`opacity`, `translateY`) with spring/ease physics
- Uses `requestAnimationFrame` for smooth 60fps animation

### Canvas Animations (Particle Constellation / Circuit Grid)

**What they do:** GPU-accelerated 2D graphics for the hero background and skills page.

**How they work internally:**

1. **HTML5 Canvas:** A bitmap drawing surface. You draw pixels directly using JavaScript.
2. **Animation loop:** Uses `requestAnimationFrame` (browser calls your draw function ~60 times/second)
3. **Particle physics:** Each particle has position (x, y) and velocity (vx, vy). Every frame:
   - Update position: `x += vx`, `y += vy`
   - Apply friction: `vx *= 0.98`
   - Check distances between particles → draw connecting lines
   - Mouse interaction: calculate distance to cursor → apply repulsion force
4. **Performance:** Canvas is hardware-accelerated. Drawing 100+ particles with connections runs smoothly because it's a single bitmap layer, not 100 DOM elements.

---

## Data Layer: How Content Becomes Pages

### Flow:

```
data/projects.json
       │
       ▼
Zod Schema Validation (ProjectsFileSchema)
       │
       ▼ (if valid)
getProjects() returns typed data
       │
       ▼
React Component receives data as props
       │
       ▼
Next.js renders to static HTML
       │
       ▼
out/projects.html (deployed to server)
```

### Zod Validation (Data Safety)

**What it does:** Ensures your JSON data matches the expected structure. If you make a typo or forget a field, the build FAILS with a clear error.

**How it works:**
1. You define a schema: `ProjectSchema = z.object({ title: z.string().max(150), ... })`
2. At build time: `schema.safeParse(jsonData)` checks every field
3. If invalid: throws an error with the exact file, entry index, and field that failed
4. If valid: returns typed data (TypeScript knows the exact shape)

### Markdown Parsing (Blog Posts)

**What it does:** Converts Markdown files (`.md`) to HTML for blog posts.

**How it works:**
1. `remark` parses Markdown text into an Abstract Syntax Tree (AST)
2. `remark-html` converts the AST to HTML string
3. The HTML is embedded in the page using `dangerouslySetInnerHTML`
4. Custom CSS in `.blog-prose` styles the rendered HTML (headings, code blocks, links, etc.)

---

## Build Process: What Happens When You Run `npm run build`

```
1. next build (Turbopack)
   ├── Reads all page files in app/
   ├── Executes Server Components (reads JSON, validates with Zod)
   ├── Renders React → static HTML for each route
   ├── Bundles Client Components → JavaScript files
   ├── Generates CSS from Tailwind classes
   ├── Copies public/ files to out/
   └── Outputs everything to out/

2. next-sitemap (postbuild hook)
   ├── Reads generated pages from out/
   ├── Generates sitemap.xml (lists all page URLs)
   └── Generates robots.txt

Final output in out/:
├── index.html          (homepage)
├── projects.html       (projects page)
├── publications.html   (publications page)
├── skills.html         (skills page)
├── blog.html           (blog listing)
├── blog/getting-started-with-machine-learning.html
├── gallery.html        (gallery page)
├── sitemap.xml         (for Google)
├── robots.txt          (for crawlers)
├── _next/              (JS bundles, CSS)
├── images/             (your images)
└── files/              (resume PDF)
```

---

## Deployment: How Files Get to the Server

### rsync (The Transfer Tool)

**What it does:** Efficiently copies files from your machine to the server over SSH.

**How it works:**
1. `scripts/deploy.sh` runs `npm run build` first
2. Then: `rsync -avz --delete -e "ssh -i ~/.ssh/oracle_vm.key" out/ ubuntu@150.230.138.171:/var/www/html`
3. rsync compares file checksums — only transfers CHANGED files (fast for updates)
4. `--delete` removes files on server that no longer exist locally (clean deployment)

### Nginx (Web Server on Oracle Cloud)

**What it does:** Listens on port 80/443, serves static files to visitors.

**How it works:**
1. User visits `gajendramandal.in`
2. DNS resolves to your Oracle server IP (150.230.138.171)
3. Nginx receives the HTTP request
4. Looks up the file: `/var/www/html/index.html`
5. Sends the HTML back to the browser
6. Browser loads CSS, JS, images (Nginx serves those too)

**No Node.js running on server. No database. No API. Just file serving.**

### SSL/HTTPS (Let's Encrypt)

**What it does:** Encrypts traffic between user's browser and your server.

**How it works:**
1. Certbot gets a free SSL certificate from Let's Encrypt
2. Configures Nginx to serve on port 443 with encryption
3. Auto-redirects HTTP (port 80) → HTTPS (port 443)
4. Certificate auto-renews every 90 days via cron job

---

## Testing: How Quality is Ensured

### Property-Based Testing (fast-check + Vitest)

**What it does:** Instead of writing specific test cases, you define PROPERTIES that must always be true, and the tool generates hundreds of random inputs to test them.

**Example:** "For any project with a valid category, filtering by that category must include that project."

**How it works:**
1. `fast-check` generates random data (e.g., random project objects)
2. Your property function checks if the invariant holds
3. Runs 100+ iterations with different random inputs
4. If it finds a failing case, it SHRINKS it to the minimal failing example

### Tests in this project:
- Schema validation (Properties 1-3)
- Filtering logic (Properties 4-6)
- Text truncation (Property 7)
- Optional field handling (Property 8)
- Date sorting (Property 9)
- Markdown parsing (Property 10)
- Order preservation (Property 11)
- GitHub sync logic (Properties 12-13)
- Meta tag constraints (Property 14)

---

## Summary: Frontend vs Backend

| | Development (your machine) | Production (Oracle Cloud) |
|---|---|---|
| **What runs** | Next.js dev server (Node.js) | Nginx (static file server) |
| **Language** | TypeScript + React | None (just serves files) |
| **Data source** | JSON files read with `fs` | Pre-rendered into HTML |
| **Rendering** | On-the-fly (hot reload) | Pre-built static HTML |
| **Interactivity** | Full React (hydrated) | Client JS for animations/filters |
| **Database** | None | None |
| **API** | None | None |

**In production, there is no "backend" — it's a static website. The "backend work" (reading data, validation, rendering) all happens once during build on your machine, then the result (HTML files) is uploaded.**
