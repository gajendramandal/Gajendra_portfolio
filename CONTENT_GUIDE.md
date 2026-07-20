# Portfolio Content & Deployment Guide

A complete guide for updating content, adding new projects/blogs/gallery/skills, and deploying to your Oracle Cloud server.

---

## Project Structure (What Goes Where)

```
data/
├── projects.json         ← All projects
├── publications.json     ← All publications
├── blog.json             ← Blog post entries
├── gallery.json          ← Gallery images
├── skills.json           ← Skill categories
├── profile.json          ← Your bio, links, stats, timeline
└── markdown/             ← Blog post markdown files
    └── your-post.md

public/
├── images/               ← All images (profile, gallery, etc.)
└── files/                ← Resume PDF and other downloadable files
```

---

## 1. Adding a New Project

Open `data/projects.json` and add an entry to the array:

```json
{
  "title": "Your Project Title",
  "description": "A brief description of the project (max 500 chars).",
  "category": "Machine Learning",
  "technologies": ["Python", "PyTorch", "Docker"],
  "status": "completed",
  "date": "2025-06-15",
  "githubUrl": "https://github.com/gajendramandal/your-repo",
  "demoUrl": "https://your-demo.com"
}
```

**Fields:**
| Field | Required | Notes |
|-------|----------|-------|
| title | Yes | Max 150 characters |
| description | Yes | Max 500 characters |
| category | Yes | Machine Learning, NLP & AI, Computer Vision, Web Development, Research |
| technologies | Yes | Array of 1–20 strings |
| status | Yes | `completed`, `ongoing`, or `planned` |
| date | Yes | Format: `YYYY-MM-DD` |
| githubUrl | No | Full GitHub URL |
| demoUrl | No | Full demo URL |

---

## 2. Adding a New Blog Post

### Option A: Markdown file (recommended for long posts)

1. Create your markdown file at `data/markdown/your-post-title.md`
2. Add an entry to `data/blog.json`:

```json
{
  "title": "Your Blog Post Title",
  "date": "2025-06-20",
  "description": "A short summary shown on the blog listing page (max 300 chars).",
  "markdown": "data/markdown/your-post-title.md"
}
```

### Option B: Inline content (short posts)

```json
{
  "title": "Quick Note on Something",
  "date": "2025-06-20",
  "description": "A short summary.",
  "content": "## Your Heading\n\nYour markdown content here. Supports **bold**, *italic*, [links](url), code blocks, lists, blockquotes."
}
```

### Option C: External link (link to Medium, etc.)

```json
{
  "title": "Article on Medium",
  "date": "2025-06-20",
  "description": "Summary of the external article.",
  "externalUrl": "https://medium.com/@you/your-article"
}
```

**Rule:** Each blog entry must have EXACTLY ONE of: `content`, `markdown`, or `externalUrl`.

**Slug generation:** The URL will be `/blog/your-blog-post-title` (auto-generated from title, lowercase, hyphens).

---

## 3. Adding a New Gallery Image

1. Put your image in `public/images/` (e.g., `public/images/new-photo.jpg`)
2. Add an entry to `data/gallery.json`:

```json
{
  "image": "/images/new-photo.jpg",
  "title": "Photo Title",
  "date": "2025-06-20",
  "category": "Campus Life",
  "description": "Optional description of the photo (max 500 chars).",
  "location": "IIT Gandhinagar, Gujarat"
}
```

**Fields:**
| Field | Required | Notes |
|-------|----------|-------|
| image | Yes | Path relative to public/ (starts with `/images/`) |
| title | Yes | Max 150 characters |
| date | Yes | Format: `YYYY-MM-DD` |
| category | Yes | Any string (used for filtering). Existing: Campus Life, Research Lab, Personal |
| description | No | Max 500 characters |
| location | No | Free text |

---

## 4. Adding/Updating Skills

Open `data/skills.json`. Each entry is a category with items:

```json
{
  "category": "New Category Name",
  "items": ["Skill 1", "Skill 2", "Skill 3"]
}
```

To add a skill to an existing category, just add to that category's `items` array.
To add a new category, add a new object to the array.

**Limits:** Category name max 100 chars, items array 1–50 items.

---

## 5. Updating Your Profile

Edit `data/profile.json`:

- **name** — Your display name
- **title** — Your title (e.g., "AI Researcher & ML Engineer")
- **bio** — Your bio paragraph (max 2000 chars)
- **socialLinks** — Array of `{ "label": "GitHub", "url": "https://..." }`
- **stats** — Array of `{ "value": "5+", "label": "ML Projects" }` (max 10)
- **timeline** — Array of `{ "date": "2025", "description": "What happened" }` (max 30)

---

## 6. Updating the Home Page Content

The home page content is in `app/page.tsx`. Key sections to edit:

- **Bio text** — Search for "B.Tech Data Science student" and update the paragraph
- **Roles** — In `components/animations/TypeWriter.tsx`, the `words` array in `HeroAnimations.tsx` controls the rotating text
- **Stat cards** — Search for "IEEE Publication", "ML Projects", "CGPA" and update numbers
- **Experience** — Search for "AI / ML Intern" and "Research Intern" sections
- **Achievements** — The grid of 6 achievement cards

---

## 7. Adding a New Publication

Add to `data/publications.json`:

```json
{
  "title": "Your Paper Title",
  "authors": "Gajendra Mandal, Co-Author Name",
  "venue": "Conference or Journal Name",
  "year": 2025,
  "category": "conference",
  "abstract": "Optional abstract (max 1000 chars).",
  "tags": ["machine learning", "computer vision"],
  "link": "https://arxiv.org/abs/your-paper"
}
```

**Category options:** `journal`, `conference`, `workshop`, `preprint`, `book`

---

## 8. Building for Production

```bash
npm run build
```

This creates a static export in the `out/` directory. All HTML/CSS/JS is pre-rendered — no Node.js needed on the server.

---

## 9. Deploying to Oracle Cloud Server

### Prerequisites

- SSH access to your Oracle Cloud instance
- Nginx installed on the server
- Your `.env` file configured (copy from `.env.example`):

```bash
cp .env.example .env
```

Then edit `.env`:
```
DEPLOY_HOST=your-oracle-server-ip
DEPLOY_USER=your-ssh-username
DEPLOY_PATH=/var/www/portfolio
```

### Deploy Command

```bash
npm run deploy
```

This runs `scripts/deploy.sh` which:
1. Builds the static site (`npm run build`)
2. Verifies the build succeeded
3. Rsyncs the `out/` folder to your server

### First-Time Server Setup (Nginx)

SSH into your Oracle Cloud server and run:

```bash
# Install Nginx
sudo apt update && sudo apt install nginx -y

# Create the site directory
sudo mkdir -p /var/www/portfolio
sudo chown $USER:$USER /var/www/portfolio

# Configure Nginx
sudo nano /etc/nginx/sites-available/portfolio
```

Paste this Nginx config:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # or server IP

    root /var/www/portfolio;
    index index.html;

    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t          # test config
sudo systemctl restart nginx
```

### Alternative: Docker Deployment

```bash
# Build and deploy with Docker
npm run build
docker compose up -d --build
```

This uses the included `Dockerfile` (Nginx + static files) and `docker-compose.yml`.

---

## 10. Setting Up HTTPS (SSL) with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

Certbot will automatically configure Nginx for HTTPS and set up auto-renewal.

---

## 11. GitHub Auto-Sync (Optional)

To automatically pull your public GitHub repos into the projects list:

```bash
npm run sync-github
```

This fetches your repos from GitHub API and merges them into `data/projects.json`. Manual entries are never touched — only GitHub-sourced entries are updated.

Set up a cron job for automatic sync:
```bash
crontab -e
# Add this line to sync daily at 2 AM:
0 2 * * * cd /path/to/your/project && npm run sync-github
```

---

## Quick Reference: All npm Scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start local development server (http://localhost:3000) |
| `npm run build` | Build static site to `out/` |
| `npm run deploy` | Build + rsync to Oracle Cloud server |
| `npm run test` | Run all property-based tests |
| `npm run sync-github` | Pull GitHub repos into projects.json |
| `npm run lint` | Run ESLint |

---

## Checklist for Adding Content

- [ ] Add data to the correct JSON file
- [ ] Put images in `public/images/`
- [ ] Run `npm run build` to verify no validation errors
- [ ] Preview locally with `npm run dev`
- [ ] Deploy with `npm run deploy`

---

## Troubleshooting

**Build fails with validation error:**
- Check the error message — it tells you which file and field is wrong
- Ensure dates are `YYYY-MM-DD` format
- Ensure required fields aren't missing
- Blog entries need exactly ONE of: content, markdown, or externalUrl

**Images not showing:**
- Images must be in `public/images/` not `images/`
- Path in JSON must start with `/images/` (with leading slash)

**Deploy fails:**
- Check `.env` has correct DEPLOY_HOST, DEPLOY_USER, DEPLOY_PATH
- Ensure SSH key is set up (no password prompts)
- Ensure destination directory exists on server

**404 on deployed site:**
- Check Nginx `try_files` includes `.html` extension
- Run `nginx -t` to check config syntax
