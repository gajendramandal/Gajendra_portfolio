import { remark } from 'remark';
import html from 'remark-html';
import fs from 'fs/promises';
import path from 'path';

/**
 * Parse a Markdown string into HTML.
 * Supports headings, bold, italic, links, code blocks, lists, and blockquotes.
 */
export async function parseMarkdown(content: string): Promise<string> {
  const result = await remark().use(html).process(content);
  return result.toString();
}

/**
 * Read a Markdown file from the filesystem and return its parsed HTML content.
 * @param filePath - Path relative to process.cwd() (e.g., "data/markdown/getting-started-with-ml.md")
 * @throws Error if the file does not exist or cannot be read
 */
export async function getMarkdownContent(filePath: string): Promise<string> {
  const fullPath = path.join(process.cwd(), filePath);

  try {
    const content = await fs.readFile(fullPath, 'utf-8');
    return parseMarkdown(content);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(
        `Markdown file not found: ${filePath} (resolved to ${fullPath})`
      );
    }
    throw new Error(
      `Failed to read Markdown file: ${filePath} — ${(error as Error).message}`
    );
  }
}
