import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildFullNavTree } from '../utils/navigation';
import { loadConfig } from '../utils/config';

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

  lines.push('This file follows the llms.txt specification (https://llmstxt.org/).');
  lines.push('It provides an overview of all documentation pages for LLM consumption.');
  lines.push('');
  lines.push('A full context file with all page contents is available at /llms-full.txt');
  lines.push('');

  for (const tab of navTree.tabs) {
    lines.push(`## ${tab.name}`);
    lines.push('');

    for (const group of tab.groups) {
      for (const page of group.pages) {
        lines.push(`- [${page.name}](${page.href}): ${group.name}`);
      }
    }

    lines.push('');
  }

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
