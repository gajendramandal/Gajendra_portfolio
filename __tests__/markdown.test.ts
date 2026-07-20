import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { parseMarkdown } from '@/lib/markdown';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Generate a safe alphanumeric word (avoids special markdown characters) */
function arbitrarySafeWord(): fc.Arbitrary<string> {
  return fc.stringMatching(/^[A-Za-z][A-Za-z0-9]{0,19}$/);
}

/** Generate a heading level (1-6) */
function arbitraryHeadingLevel(): fc.Arbitrary<number> {
  return fc.integer({ min: 1, max: 6 });
}

// ─── Markdown Element Generators ──────────────────────────────────────────────

/** Generate a markdown heading (e.g., "# Title", "## Subtitle") */
function arbitraryHeading(): fc.Arbitrary<{ markdown: string; level: number }> {
  return fc.record({
    level: arbitraryHeadingLevel(),
    text: arbitrarySafeWord(),
  }).map(({ level, text }) => ({
    markdown: `${'#'.repeat(level)} ${text}`,
    level,
  }));
}

/** Generate bold markdown text (e.g., "**text**") */
function arbitraryBold(): fc.Arbitrary<{ markdown: string; text: string }> {
  return arbitrarySafeWord().map((text) => ({
    markdown: `**${text}**`,
    text,
  }));
}

/** Generate a markdown link (e.g., "[text](url)") */
function arbitraryLink(): fc.Arbitrary<{ markdown: string; text: string; url: string }> {
  return fc.record({
    text: arbitrarySafeWord(),
    url: fc.constant('https://example.com'),
  }).map(({ text, url }) => ({
    markdown: `[${text}](${url})`,
    text,
    url,
  }));
}

/** Generate an inline code snippet (e.g., "`code`") */
function arbitraryInlineCode(): fc.Arbitrary<{ markdown: string; code: string }> {
  return arbitrarySafeWord().map((code) => ({
    markdown: `\`${code}\``,
    code,
  }));
}

/** Generate a fenced code block */
function arbitraryCodeBlock(): fc.Arbitrary<{ markdown: string; code: string }> {
  return arbitrarySafeWord().map((code) => ({
    markdown: `\n\`\`\`\n${code}\n\`\`\`\n`,
    code,
  }));
}

/**
 * Generate a full markdown document combining various elements.
 * Returns the markdown string and metadata about what elements it contains.
 */
function arbitraryMarkdown(): fc.Arbitrary<{
  markdown: string;
  hasHeading: boolean;
  hasBold: boolean;
  hasLink: boolean;
  hasCode: boolean;
}> {
  return fc.record({
    heading: fc.option(arbitraryHeading(), { nil: null }),
    bold: fc.option(arbitraryBold(), { nil: null }),
    link: fc.option(arbitraryLink(), { nil: null }),
    code: fc.option(
      fc.oneof(arbitraryInlineCode(), arbitraryCodeBlock()),
      { nil: null }
    ),
    extraText: arbitrarySafeWord(),
  }).map(({ heading, bold, link, code, extraText }) => {
    const parts: string[] = [];

    if (heading) parts.push(heading.markdown);
    if (bold) parts.push(`Some text with ${bold.markdown} in it.`);
    if (link) parts.push(`Check out ${link.markdown} for more.`);
    if (code) parts.push(`Here is code: ${code.markdown}`);
    parts.push(extraText);

    return {
      markdown: parts.join('\n\n'),
      hasHeading: heading !== null,
      hasBold: bold !== null,
      hasLink: link !== null,
      hasCode: code !== null,
    };
  });
}

// ─── Basic HTML validation helper ─────────────────────────────────────────────

/**
 * Basic check for unclosed tags by verifying that common self-closing/void
 * elements are excluded and other tags have matching open/close pairs.
 */
function hasNoUnclosedTags(html: string): boolean {
  // Void elements that don't need closing tags
  const voidElements = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr',
  ]);

  const tagPattern = /<\/?([a-z][a-z0-9]*)[^>]*>/gi;
  const stack: string[] = [];
  let match;

  while ((match = tagPattern.exec(html)) !== null) {
    const fullMatch = match[0];
    const tagName = match[1].toLowerCase();

    if (voidElements.has(tagName)) continue;
    // Skip self-closing tags like <br />
    if (fullMatch.endsWith('/>')) continue;

    if (fullMatch.startsWith('</')) {
      // Closing tag
      if (stack.length === 0 || stack[stack.length - 1] !== tagName) {
        return false;
      }
      stack.pop();
    } else {
      // Opening tag
      stack.push(tagName);
    }
  }

  return stack.length === 0;
}

// ─── Property Tests ───────────────────────────────────────────────────────────

describe('Feature: scalable-ai-portfolio, Property 10: Markdown parsing produces valid HTML containing expected elements', () => {
  /**
   * Validates: Requirements 4.2
   */

  it('headings in markdown produce corresponding <h1>-<h6> elements in HTML', async () => {
    await fc.assert(
      fc.asyncProperty(arbitraryHeading(), async ({ markdown, level }) => {
        const html = await parseMarkdown(markdown);
        expect(html).toContain(`<h${level}>`);
        expect(html).toContain(`</h${level}>`);
      }),
      { numRuns: 100 }
    );
  });

  it('bold markdown produces <strong> element in HTML', async () => {
    await fc.assert(
      fc.asyncProperty(arbitraryBold(), async ({ markdown, text }) => {
        const html = await parseMarkdown(markdown);
        expect(html).toContain('<strong>');
        expect(html).toContain('</strong>');
        expect(html).toContain(text);
      }),
      { numRuns: 100 }
    );
  });

  it('links in markdown produce <a> elements in HTML', async () => {
    await fc.assert(
      fc.asyncProperty(arbitraryLink(), async ({ markdown, text, url }) => {
        const html = await parseMarkdown(markdown);
        expect(html).toContain('<a');
        expect(html).toContain(`href="${url}"`);
        expect(html).toContain(text);
      }),
      { numRuns: 100 }
    );
  });

  it('inline code in markdown produces <code> element in HTML', async () => {
    await fc.assert(
      fc.asyncProperty(arbitraryInlineCode(), async ({ markdown, code }) => {
        const html = await parseMarkdown(markdown);
        expect(html).toContain('<code>');
        expect(html).toContain('</code>');
        expect(html).toContain(code);
      }),
      { numRuns: 100 }
    );
  });

  it('fenced code blocks in markdown produce <code> and/or <pre> elements in HTML', async () => {
    await fc.assert(
      fc.asyncProperty(arbitraryCodeBlock(), async ({ markdown, code }) => {
        const html = await parseMarkdown(markdown);
        // Fenced code blocks typically produce <pre><code>...</code></pre>
        expect(html).toContain('<code>');
        expect(html).toContain(code);
      }),
      { numRuns: 100 }
    );
  });

  it('parsed markdown output has no unclosed HTML tags', async () => {
    await fc.assert(
      fc.asyncProperty(arbitraryMarkdown(), async ({ markdown }) => {
        const html = await parseMarkdown(markdown);
        expect(hasNoUnclosedTags(html)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('combined markdown with multiple elements produces all corresponding HTML elements', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbitraryHeading(),
        arbitraryBold(),
        arbitraryLink(),
        arbitraryInlineCode(),
        async (heading, bold, link, code) => {
          const combined = [
            heading.markdown,
            `Text with ${bold.markdown} words.`,
            `Visit ${link.markdown} now.`,
            `Use ${code.markdown} here.`,
          ].join('\n\n');

          const html = await parseMarkdown(combined);

          expect(html).toContain(`<h${heading.level}>`);
          expect(html).toContain('<strong>');
          expect(html).toContain('<a');
          expect(html).toContain('<code>');
          expect(hasNoUnclosedTags(html)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
