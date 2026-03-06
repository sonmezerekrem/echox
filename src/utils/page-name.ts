/**
 * Extracts page name from a markdown file when frontmatter has no name/title.
 * Returns the text of the first H1 in the content, or null if not found.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

const userDir = process.env.ECHOX_DIR || process.cwd();

export function getFirstH1AsName(entryId: string): string | null {
  const filePath = path.join(userDir, entryId + '.md');
  let raw: string;
  try {
    raw = fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }

  const parts = raw.split(/^---\s*$/m);
  if (parts.length >= 2) {
    try {
      const fm = parseYaml(parts[1].trim()) as Record<string, unknown>;
      if (fm?.name || fm?.title) return null;
    } catch {
      // Invalid YAML, treat as no frontmatter
    }
  }

  const content = parts.length >= 2 ? parts.slice(2).join('---').trim() : raw.trim();
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}
