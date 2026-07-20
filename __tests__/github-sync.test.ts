import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  transformRepo,
  mergeProjects,
  GitHubRepo,
  ProjectEntry,
} from '@/lib/github-sync';

// ─── Arbitraries ──────────────────────────────────────────────────────────────

/** Generate a YYYY-MM-DDThh:mm:ssZ ISO date string (like GitHub API returns) */
function arbitraryIsoDateString(): fc.Arbitrary<string> {
  return fc
    .record({
      year: fc.integer({ min: 2000, max: 2025 }),
      month: fc.integer({ min: 1, max: 12 }),
      day: fc.integer({ min: 1, max: 28 }),
      hour: fc.integer({ min: 0, max: 23 }),
      minute: fc.integer({ min: 0, max: 59 }),
      second: fc.integer({ min: 0, max: 59 }),
    })
    .map(
      ({ year, month, day, hour, minute, second }) =>
        `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}Z`
    );
}

/** Generate a valid GitHub API repo response object */
function arbitraryGitHubRepo(): fc.Arbitrary<GitHubRepo> {
  return fc.record({
    name: fc.string({ minLength: 1, maxLength: 50 }).map((s) =>
      s.replace(/[^a-zA-Z0-9-_]/g, 'a')
    ),
    full_name: fc
      .record({
        owner: fc.string({ minLength: 1, maxLength: 20 }).map((s) =>
          s.replace(/[^a-zA-Z0-9-]/g, 'a')
        ),
        repo: fc.string({ minLength: 1, maxLength: 30 }).map((s) =>
          s.replace(/[^a-zA-Z0-9-_]/g, 'a')
        ),
      })
      .map(({ owner, repo }) => `${owner}/${repo}`),
    description: fc.option(fc.string({ minLength: 1, maxLength: 200 }), {
      nil: null,
    }),
    language: fc.option(
      fc.constantFrom('TypeScript', 'Python', 'JavaScript', 'Rust', 'Go', 'Java', 'C++'),
      { nil: null }
    ),
    topics: fc.array(
      fc.string({ minLength: 1, maxLength: 30 }).map((s) =>
        s.replace(/[^a-z0-9-]/g, 'a')
      ),
      { minLength: 0, maxLength: 5 }
    ),
    html_url: fc
      .string({ minLength: 1, maxLength: 30 })
      .map((s) => `https://github.com/${s.replace(/[^a-zA-Z0-9-]/g, 'a')}`),
    stargazers_count: fc.integer({ min: 0, max: 100000 }),
    created_at: arbitraryIsoDateString(),
  });
}

/** Generate a manual ProjectEntry (no source field) */
function arbitraryManualProject(): fc.Arbitrary<ProjectEntry> {
  return fc.record({
    title: fc.string({ minLength: 1, maxLength: 100 }),
    description: fc.string({ minLength: 0, maxLength: 200 }),
    category: fc.constantFrom('Research', 'Machine Learning', 'Web Development'),
    technologies: fc.array(fc.string({ minLength: 1, maxLength: 20 }), {
      minLength: 1,
      maxLength: 5,
    }),
    status: fc.constantFrom('completed' as const, 'ongoing' as const, 'planned' as const),
    date: fc
      .record({
        year: fc.integer({ min: 2000, max: 2025 }),
        month: fc.integer({ min: 1, max: 12 }),
        day: fc.integer({ min: 1, max: 28 }),
      })
      .map(
        ({ year, month, day }) =>
          `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      ),
    githubUrl: fc.option(fc.webUrl(), { nil: undefined }),
    demoUrl: fc.option(fc.webUrl(), { nil: undefined }),
  });
}

/** Generate a GitHub-sourced ProjectEntry (has source: 'github' and repoFullName) */
function arbitraryGithubProject(): fc.Arbitrary<ProjectEntry> {
  return fc.record({
    title: fc.string({ minLength: 1, maxLength: 100 }),
    description: fc.string({ minLength: 0, maxLength: 200 }),
    category: fc.constant('Research'),
    technologies: fc.array(fc.string({ minLength: 1, maxLength: 20 }), {
      minLength: 1,
      maxLength: 5,
    }),
    status: fc.constant('completed' as const),
    date: fc
      .record({
        year: fc.integer({ min: 2000, max: 2025 }),
        month: fc.integer({ min: 1, max: 12 }),
        day: fc.integer({ min: 1, max: 28 }),
      })
      .map(
        ({ year, month, day }) =>
          `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      ),
    githubUrl: fc.webUrl(),
    source: fc.constant('github' as const),
    repoFullName: fc
      .record({
        owner: fc.string({ minLength: 1, maxLength: 20 }).map((s) =>
          s.replace(/[^a-zA-Z0-9-]/g, 'a')
        ),
        repo: fc.string({ minLength: 1, maxLength: 30 }).map((s) =>
          s.replace(/[^a-zA-Z0-9-_]/g, 'a')
        ),
      })
      .map(({ owner, repo }) => `${owner}/${repo}`),
    stars: fc.integer({ min: 0, max: 50000 }),
  });
}

// ─── Property Tests ───────────────────────────────────────────────────────────

describe('Feature: scalable-ai-portfolio, Property 12: GitHub API response transformation correctness', () => {
  /**
   * Validates: Requirements 10.2
   */

  it('transformRepo sets title = repo.name', () => {
    fc.assert(
      fc.property(arbitraryGitHubRepo(), (repo) => {
        const result = transformRepo(repo);
        expect(result.title).toBe(repo.name);
      }),
      { numRuns: 100 }
    );
  });

  it('transformRepo sets description = repo.description or empty string if null', () => {
    fc.assert(
      fc.property(arbitraryGitHubRepo(), (repo) => {
        const result = transformRepo(repo);
        expect(result.description).toBe(repo.description || '');
      }),
      { numRuns: 100 }
    );
  });

  it('transformRepo sets technologies = [repo.language, ...repo.topics].filter(Boolean), or ["Unknown"] if empty', () => {
    fc.assert(
      fc.property(arbitraryGitHubRepo(), (repo) => {
        const result = transformRepo(repo);
        const expected = [repo.language, ...repo.topics].filter(
          (t): t is string => t != null && t !== ''
        );
        if (expected.length > 0) {
          expect(result.technologies).toEqual(expected);
        } else {
          expect(result.technologies).toEqual(['Unknown']);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('transformRepo sets githubUrl = repo.html_url', () => {
    fc.assert(
      fc.property(arbitraryGitHubRepo(), (repo) => {
        const result = transformRepo(repo);
        expect(result.githubUrl).toBe(repo.html_url);
      }),
      { numRuns: 100 }
    );
  });

  it('transformRepo sets source = "github"', () => {
    fc.assert(
      fc.property(arbitraryGitHubRepo(), (repo) => {
        const result = transformRepo(repo);
        expect(result.source).toBe('github');
      }),
      { numRuns: 100 }
    );
  });

  it('transformRepo sets repoFullName = repo.full_name', () => {
    fc.assert(
      fc.property(arbitraryGitHubRepo(), (repo) => {
        const result = transformRepo(repo);
        expect(result.repoFullName).toBe(repo.full_name);
      }),
      { numRuns: 100 }
    );
  });

  it('transformRepo sets stars = repo.stargazers_count', () => {
    fc.assert(
      fc.property(arbitraryGitHubRepo(), (repo) => {
        const result = transformRepo(repo);
        expect(result.stars).toBe(repo.stargazers_count);
      }),
      { numRuns: 100 }
    );
  });

  it('transformRepo sets date = repo.created_at.slice(0, 10)', () => {
    fc.assert(
      fc.property(arbitraryGitHubRepo(), (repo) => {
        const result = transformRepo(repo);
        expect(result.date).toBe(repo.created_at.slice(0, 10));
      }),
      { numRuns: 100 }
    );
  });

  it('transformRepo produces correct output for any valid GitHub repo object', () => {
    fc.assert(
      fc.property(arbitraryGitHubRepo(), (repo) => {
        const result = transformRepo(repo);
        const expectedTech = [repo.language, ...repo.topics].filter(
          (t): t is string => t != null && t !== ''
        );

        expect(result).toEqual({
          title: repo.name,
          description: repo.description || '',
          category: 'Research',
          technologies: expectedTech.length > 0 ? expectedTech : ['Unknown'],
          status: 'completed',
          date: repo.created_at.slice(0, 10),
          githubUrl: repo.html_url,
          source: 'github',
          repoFullName: repo.full_name,
          stars: repo.stargazers_count,
        });
      }),
      { numRuns: 100 }
    );
  });
});

describe('Feature: scalable-ai-portfolio, Property 13: GitHub sync merge preserves manual entries and correctly upserts', () => {
  /**
   * Validates: Requirements 10.3, 10.4
   */

  it('mergeProjects preserves ALL manual entries exactly as-is', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryManualProject(), { minLength: 0, maxLength: 10 }),
        fc.array(arbitraryGithubProject(), { minLength: 0, maxLength: 10 }),
        fc.array(arbitraryGitHubRepo(), { minLength: 0, maxLength: 5 }),
        (manualEntries, existingGithub, newRepos) => {
          const existing = [...manualEntries, ...existingGithub];
          const synced = newRepos.map(transformRepo);

          const result = mergeProjects(existing, synced);

          // Every manual entry must appear in result unchanged
          for (const manual of manualEntries) {
            const found = result.find(
              (r) =>
                r.title === manual.title &&
                r.source !== 'github' &&
                r.description === manual.description &&
                r.date === manual.date
            );
            expect(found).toBeDefined();
            // Check deep equality
            expect(found).toEqual(manual);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('mergeProjects updates existing GitHub entries matched by repoFullName', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryGitHubRepo(), { minLength: 1, maxLength: 5 }),
        (repos) => {
          // Create existing entries from the repos
          const existingGithub = repos.map(transformRepo);
          const existing: ProjectEntry[] = [...existingGithub];

          // Create updated versions with different descriptions
          const updatedRepos: GitHubRepo[] = repos.map((r) => ({
            ...r,
            description: 'UPDATED-' + (r.description || ''),
            stargazers_count: r.stargazers_count + 10,
          }));
          const synced = updatedRepos.map(transformRepo);

          const result = mergeProjects(existing, synced);

          // Each synced entry should have the updated data
          for (const syncedEntry of synced) {
            const found = result.find(
              (r) => r.repoFullName === syncedEntry.repoFullName
            );
            expect(found).toBeDefined();
            expect(found!.description).toBe(syncedEntry.description);
            expect(found!.stars).toBe(syncedEntry.stars);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('mergeProjects adds new GitHub repos not in existing data', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryManualProject(), { minLength: 0, maxLength: 5 }),
        fc.array(arbitraryGitHubRepo(), { minLength: 1, maxLength: 5 }),
        (manualEntries, newRepos) => {
          // Existing has only manual entries — no GitHub entries
          const existing: ProjectEntry[] = [...manualEntries];
          const synced = newRepos.map(transformRepo);

          const result = mergeProjects(existing, synced);

          // All synced entries should appear in result
          for (const syncedEntry of synced) {
            const found = result.find(
              (r) => r.repoFullName === syncedEntry.repoFullName
            );
            expect(found).toBeDefined();
            expect(found!.source).toBe('github');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('mergeProjects result contains no duplicates by repoFullName among github entries', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryManualProject(), { minLength: 0, maxLength: 5 }),
        fc.array(arbitraryGitHubRepo(), { minLength: 1, maxLength: 8 }),
        (manualEntries, repos) => {
          // Use some repos as existing, and all repos as synced to test dedup
          const halfIdx = Math.floor(repos.length / 2);
          const existingGithub = repos.slice(0, halfIdx).map(transformRepo);
          const existing: ProjectEntry[] = [...manualEntries, ...existingGithub];
          const synced = repos.map(transformRepo);

          const result = mergeProjects(existing, synced);

          // Check no duplicate repoFullNames among github entries
          const githubEntries = result.filter((r) => r.source === 'github');
          const repoNames = githubEntries.map((r) => r.repoFullName);
          const uniqueNames = new Set(repoNames);
          expect(uniqueNames.size).toBe(repoNames.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('mergeProjects result length = manual count + unique github repos from synced', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryManualProject(), { minLength: 0, maxLength: 5 }),
        fc.array(arbitraryGitHubRepo(), { minLength: 0, maxLength: 5 }),
        fc.array(arbitraryGitHubRepo(), { minLength: 0, maxLength: 5 }),
        (manualEntries, existingRepos, newRepos) => {
          const existingGithub = existingRepos.map(transformRepo);
          const existing: ProjectEntry[] = [...manualEntries, ...existingGithub];
          const synced = newRepos.map(transformRepo);

          const result = mergeProjects(existing, synced);

          // Manual entries are preserved
          const resultManual = result.filter((r) => r.source !== 'github');
          expect(resultManual.length).toBe(manualEntries.length);

          // GitHub entries in result = number of unique repos from synced input
          const resultGithub = result.filter((r) => r.source === 'github');
          const uniqueSyncedNames = new Set(synced.map((s) => s.repoFullName));
          expect(resultGithub.length).toBe(uniqueSyncedNames.size);
        }
      ),
      { numRuns: 100 }
    );
  });
});
