/**
 * Extracts page name from a markdown file when frontmatter has no name/title.
 * Parses H1 attributes like {label="Implemented"} and returns clean name + attributes.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

const userDir = process.env.ECHOX_DIR || process.cwd();

/** Matches a single {key="value"} block */
const ATTR_BLOCK_RE = /\s*\{([^}]*)\}\s*/g;
/** Matches key="value" pairs inside a block */
const ATTR_PAIR_RE = /(\w+)\s*=\s*"([^"]*)"/g;

export interface H1Result {
  name: string;
  attributes?: Record<string, string>;
  /** All label values from {label="X"} blocks (supports multiple: {label="A"} {label="B"}) */
  labels?: string[];
}

/** Normalizes status/label for CSS class: "Implemented" → "implemented", "In Review" → "in-review" */
export function toStatusSlug(val: string): string {
  return val.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Parses H1 text: strips {key="value"} blocks and extracts attributes.
 * e.g. "My Feature {label=\"Implemented\"}" → { name: "My Feature", attributes: { label: "Implemented" } }
 */
export function parseH1WithAttributes(rawText: string): H1Result {
  const trimmed = typeof rawText === 'string' ? rawText.trim() : '';
  if (!trimmed) return { name: '' };

  const attributes: Record<string, string> = {};
  const labels: string[] = [];

  for (const m of trimmed.matchAll(ATTR_BLOCK_RE)) {
    const blockContent = m[1];
    if (blockContent == null || typeof blockContent !== 'string') continue;
    for (const pairMatch of blockContent.matchAll(ATTR_PAIR_RE)) {
      attributes[pairMatch[1]] = pairMatch[2];
      if (pairMatch[1] === 'label') labels.push(pairMatch[2]);
    }
  }

  const cleanName = trimmed.replace(ATTR_BLOCK_RE, '').trim();
  return {
    name: cleanName || trimmed,
    ...(Object.keys(attributes).length ? { attributes } : {}),
    ...(labels.length ? { labels } : {}),
  };
}

/**
 * Returns the first H1 as page name when frontmatter has no name/title.
 * Strips {key="value"} from display and parses attributes (label, status, etc.).
 */
export function getFirstH1AsName(entryId: string): string | null {
  const result = getFirstH1AsNameAndAttrs(entryId);
  return result?.name ?? null;
}

/**
 * Returns the first H1 with parsed attributes for augmentation.
 */
export function getFirstH1AsNameAndAttrs(entryId: string): H1Result | null {
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
  const h1Text = match?.[1];
  if (h1Text == null || typeof h1Text !== 'string') return null;

  return parseH1WithAttributes(h1Text.trim());
}
