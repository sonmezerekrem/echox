import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';
import { buildFullNavTree } from '../utils/navigation';
import { loadConfig } from '../utils/config';
import { loadOpenApiSpecs, type ApiEndpoint } from '../utils/openapi';

const userDir = process.env.ECHOX_DIR || process.cwd();

function readMarkdownSource(entryId: string): string {
  const filePath = path.join(userDir, entryId + '.md');
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return raw.replace(/^---[\s\S]*?---\n*/, '');
  } catch {
    const altPath = path.join(userDir, entryId, 'index.md');
    try {
      const raw = fs.readFileSync(altPath, 'utf-8');
      return raw.replace(/^---[\s\S]*?---\n*/, '');
    } catch {
      return '';
    }
  }
}

function formatEndpoint(ep: ApiEndpoint): string {
  const lines: string[] = [];
  lines.push(`### ${ep.method.toUpperCase()} ${ep.path}`);
  lines.push('');
  if (ep.description) {
    lines.push(ep.description);
    lines.push('');
  }
  if (ep.parameters.length > 0) {
    lines.push('**Parameters:**');
    for (const p of ep.parameters) {
      lines.push(`- \`${p.name}\` (${p.type}, ${p.in}${p.required ? ', required' : ''}): ${p.description}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

export const GET: APIRoute = async () => {
  const config = loadConfig();
  const entries = await getCollection('docs');
  const navTree = buildFullNavTree(entries);

  const lines: string[] = [];

  lines.push(`# ${config.name}`);
  lines.push('');

  if (config.description) {
    lines.push(`> ${config.description}`);
    lines.push('');
  }

  lines.push('This is the full context file containing all documentation content.');
  lines.push('');

  for (const tab of navTree.tabs) {
    lines.push(`## ${tab.name}`);
    lines.push('');

    if (tab.type === 'api') {
      const { endpoints: allEndpoints } = loadOpenApiSpecs();
      const tabEndpoints = allEndpoints.filter((ep: ApiEndpoint) =>
        ep.slug.startsWith(`api/${tab.slug}/`)
      );
      for (const ep of tabEndpoints) {
        lines.push(formatEndpoint(ep));
      }
      continue;
    }

    for (const group of tab.groups) {
      lines.push(`### ${group.name}`);
      lines.push('');

      for (const page of group.pages) {
        const content = readMarkdownSource(page.slug);
        if (content) {
          lines.push(`#### ${page.name}`);
          lines.push('');
          lines.push(content.trim());
          lines.push('');
        }
      }
    }
  }

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
