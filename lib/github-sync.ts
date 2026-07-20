/**
 * Pure functions for GitHub repository sync logic.
 *
 * Extracted from scripts/sync-github.ts to enable testability
 * without network calls or process.exit().
 */

export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  topics: string[];
  html_url: string;
  stargazers_count: number;
  created_at: string;
}

export interface ProjectEntry {
  title: string;
  description: string;
  category: string;
  technologies: string[];
  status: 'completed' | 'ongoing' | 'planned';
  date: string;
  githubUrl?: string;
  demoUrl?: string;
  source?: 'github';
  repoFullName?: string;
  stars?: number;
}

/**
 * Transforms a GitHub API repo response object into a ProjectEntry.
 */
export function transformRepo(repo: GitHubRepo): ProjectEntry {
  const technologies = [repo.language, ...repo.topics].filter(
    (t): t is string => t != null && t !== ''
  );

  return {
    title: repo.name,
    description: repo.description || '',
    category: 'Research',
    technologies: technologies.length > 0 ? technologies : ['Unknown'],
    status: 'completed',
    date: repo.created_at.slice(0, 10),
    githubUrl: repo.html_url,
    source: 'github',
    repoFullName: repo.full_name,
    stars: repo.stargazers_count,
  };
}

/**
 * Merges existing project entries with newly synced GitHub entries.
 *
 * - Preserves all manual entries (no `source` field) exactly as-is
 * - Updates existing GitHub entries matched by `repoFullName`
 * - Adds new GitHub repos not present in existing data
 */
export function mergeProjects(
  existing: ProjectEntry[],
  synced: ProjectEntry[]
): ProjectEntry[] {
  // Keep all manual entries (no source field)
  const manualEntries = existing.filter((p) => p.source !== 'github');

  // Build a map of existing GitHub entries by repoFullName for updates
  const existingGithubMap = new Map<string, ProjectEntry>();
  for (const p of existing) {
    if (p.source === 'github' && p.repoFullName) {
      existingGithubMap.set(p.repoFullName, p);
    }
  }

  // Merge synced entries: update existing or add new
  const mergedGithubEntries: ProjectEntry[] = synced.map((syncedEntry) => {
    const existingEntry = existingGithubMap.get(syncedEntry.repoFullName!);
    if (existingEntry) {
      // Update existing entry with fresh data from GitHub
      return { ...existingEntry, ...syncedEntry };
    }
    return syncedEntry;
  });

  return [...manualEntries, ...mergedGithubEntries];
}
