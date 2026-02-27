import type { CollectionEntry } from 'astro:content';
import { loadOpenApiSpecs } from './openapi';
import { getTabsWithTasks } from './tasks';
import fs from 'node:fs';
import path from 'node:path';

const userDir = process.env.ECHOX_DIR || process.cwd();

export interface NavPage {
  slug: string;
  name: string;
  href: string;
  order: number;
  icon: string;
  status?: string;
}

export interface NavGroup {
  slug: string;
  name: string;
  pages: NavPage[];
  order: number;
}

export interface NavTab {
  slug: string;
  name: string;
  groups: NavGroup[];
  order: number;
  type?: 'docs' | 'api';
}

export interface NavTree {
  tabs: NavTab[];
}

interface FolderMeta {
  name?: string;
  order?: number;
}

function humanize(slug: string): string {
  return slug
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function loadMeta(...segments: string[]): FolderMeta {
  const metaPath = path.join(userDir, 'content', ...segments, '_meta.json');
  try {
    const raw = fs.readFileSync(metaPath, 'utf-8');
    return JSON.parse(raw) as FolderMeta;
  } catch {
    return {};
  }
}

export function buildNavTree(entries: CollectionEntry<'docs'>[]): NavTree {
  const tabsMap = new Map<string, NavTab>();

  for (const entry of entries) {
    const parts = entry.id.split('/');
    if (parts.length < 3) continue;

    const [tabSlug, groupSlug, ...rest] = parts;
    const pageSlug = rest.join('/').replace(/\.md$/, '');

    if (!tabsMap.has(tabSlug)) {
      const meta = loadMeta(tabSlug);
      tabsMap.set(tabSlug, {
        slug: tabSlug,
        name: meta.name || humanize(tabSlug),
        groups: [],
        order: meta.order ?? 0,
        type: 'docs',
      });
    }
    const tab = tabsMap.get(tabSlug)!;

    let group = tab.groups.find((g) => g.slug === groupSlug);
    if (!group) {
      const meta = loadMeta(tabSlug, groupSlug);
      group = {
        slug: groupSlug,
        name: meta.name || humanize(groupSlug),
        pages: [],
        order: meta.order ?? 0,
      };
      tab.groups.push(group);
    }

    const data = entry.data as { name?: string; order?: number; icon?: string; status?: string };
    const pageName = data.name || humanize(pageSlug);
    const pageOrder = data.order ?? Number.MAX_SAFE_INTEGER;
    const pageIcon = data.icon || 'file-01';

    group.pages.push({
      slug: entry.id,
      name: pageName,
      href: `/${entry.id}`,
      order: pageOrder,
      icon: pageIcon,
      status: data.status,
    });
  }

  for (const tabSlug of getTabsWithTasks()) {
    const tab = tabsMap.get(tabSlug);
    if (!tab) continue;
    const tasksPage: NavPage = {
      slug: `${tabSlug}/tasks`,
      name: 'Tasks',
      href: `/${tabSlug}/tasks`,
      order: Number.MAX_SAFE_INTEGER,
      icon: 'task-01',
    };
    const tasksGroup: NavGroup = {
      slug: 'tasks',
      name: 'Tasks',
      pages: [tasksPage],
      order: Number.MAX_SAFE_INTEGER,
    };
    tab.groups.push(tasksGroup);
  }

  const tabs = Array.from(tabsMap.values());

  for (const tab of tabs) {
    for (const group of tab.groups) {
      group.pages.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
    }
    tab.groups.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  }
  tabs.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

  return { tabs };
}

/**
 * Returns the display name for a doc/task path (e.g. "guides/core_concepts/theming" or "/guides/core_concepts/theming").
 * Returns null if the path is not found in the nav tree.
 */
export function getPageNameByPath(navTree: NavTree, pathOrHref: string): string | null {
  const normalized = pathOrHref.replace(/^\//, '');
  for (const tab of navTree.tabs) {
    for (const group of tab.groups) {
      const page = group.pages.find(
        (p) => p.slug === normalized || p.href === pathOrHref || p.href === `/${normalized}`
      );
      if (page) return page.name;
    }
  }
  return null;
}

export function getFirstPage(navTree: NavTree): string | null {
  const firstTab = navTree.tabs[0];
  if (!firstTab) return null;
  const firstGroup = firstTab.groups[0];
  if (!firstGroup) return null;
  const firstPage = firstGroup.pages[0];
  if (!firstPage) return null;
  return firstPage.href;
}

export function findCurrentTab(navTree: NavTree, slug: string): NavTab | null {
  for (const tab of navTree.tabs) {
    for (const group of tab.groups) {
      if (group.pages.some((p) => p.slug === slug)) {
        return tab;
      }
    }
  }
  return null;
}

export interface PrevNext {
  prev: NavPage | null;
  next: NavPage | null;
}

export function getPrevNext(navTree: NavTree, currentSlug: string): PrevNext {
  const tab = findCurrentTab(navTree, currentSlug);
  if (!tab) return { prev: null, next: null };

  const flat: NavPage[] = [];
  for (const group of tab.groups) {
    for (const page of group.pages) {
      flat.push(page);
    }
  }

  const idx = flat.findIndex((p) => p.slug === currentSlug);
  return {
    prev: idx > 0 ? flat[idx - 1] : null,
    next: idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null,
  };
}

export function buildFullNavTree(entries: CollectionEntry<'docs'>[]): NavTree {
  const docsTree = buildNavTree(entries);
  const { tabs: apiTabs } = loadOpenApiSpecs();
  return { tabs: [...docsTree.tabs, ...apiTabs] };
}
