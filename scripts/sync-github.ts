/**
 * GitHub Repository Auto-Sync Script
 *
 * Fetches public repositories for the user "gajendramandal" from the GitHub API
 * and merges them into data/projects.json. Manual entries (without source: "github")
 * are preserved unchanged. Existing GitHub entries are updated by repoFullName,
 * and new repos are appended.
 *
 * Usage: npx tsx scripts/sync-github.ts
 * Exit codes:
 *   0 - success
 *   1 - API failure, timeout, or other error (file not modified)
 */

import fs from 'fs';
import path from 'path';
import { transformRepo, mergeProjects, GitHubRepo, ProjectEntry } from '../lib/github-sync';

const GITHUB_API_URL =
  'https://api.github.com/users/gajendramandal/repos?per_page=100&sort=updated';
const TIMEOUT_MS = 30_000;
const PROJECTS_FILE = path.join(process.cwd(), 'data', 'projects.json');

async function main(): Promise<void> {
  // Fetch repositories from GitHub API with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(GITHUB_API_URL, {
      signal: controller.signal,
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'gajendramandal-portfolio-sync',
      },
    });
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      process.stderr.write('Error: GitHub API request timed out (30s)\n');
    } else {
      process.stderr.write(
        `Error: Failed to fetch GitHub API - ${error instanceof Error ? error.message : String(error)}\n`
      );
    }
    process.exit(1);
  }
  clearTimeout(timeoutId);

  // Check for non-200 responses
  if (!response.ok) {
    process.stderr.write(
      `Error: GitHub API returned status ${response.status} ${response.statusText}\n`
    );
    process.exit(1);
  }

  // Parse response
  let repos: GitHubRepo[];
  try {
    repos = (await response.json()) as GitHubRepo[];
  } catch {
    process.stderr.write('Error: Failed to parse GitHub API response as JSON\n');
    process.exit(1);
  }

  // Transform repos to project entries
  const syncedProjects = repos.map(transformRepo);

  // Read existing projects file
  let existingProjects: ProjectEntry[] = [];
  try {
    const raw = fs.readFileSync(PROJECTS_FILE, 'utf-8');
    existingProjects = JSON.parse(raw) as ProjectEntry[];
  } catch {
    // If file doesn't exist or is invalid, start with empty array
    existingProjects = [];
  }

  // Merge and write
  const merged = mergeProjects(existingProjects, syncedProjects);
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(merged, null, 2) + '\n', 'utf-8');

  process.stdout.write(
    `Successfully synced ${syncedProjects.length} GitHub repositories. ` +
      `Total projects: ${merged.length}\n`
  );
}

main();
