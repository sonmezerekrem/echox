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
  children?: NavGroup[];
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
  const metaPath = path.join(userDir, ...segments, '_meta.json');
  try {
    const raw = fs.readFileSync(metaPath, 'utf-8');
    return JSON.parse(raw) as FolderMeta;
  } catch {
    return {};
  }
}

function getOrCreateGroupChain(
  tab: NavTab,
  tabSlug: string,
  folderSegments: string[]
): NavGroup {
  if (folderSegments.length === 0) {
    throw new Error('getOrCreateGroupChain requires at least one folder segment');
  }
  let list: NavGroup[] = tab.groups;
  let parentPath: string[] = [];
  let leaf: NavGroup | null = null;

  for (const segment of folderSegments) {
    parentPath.push(segment);
    const meta = loadMeta(tabSlug, ...parentPath);
    let group = list.find((g) => g.slug === segment);
    if (!group) {
      group = {
        slug: segment,
        name: meta.name || humanize(segment),
        pages: [],
        order: meta.order ?? 0,
        children: [],
      };
      list.push(group);
    }
    if (!group.children) group.children = [];
    list = group.children;
    leaf = group;
  }
  return leaf!;
}

function sortGroupRecursive(group: NavGroup): void {
  if (group.children?.length) {
    group.children.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
    for (const child of group.children) sortGroupRecursive(child);
  }
  group.pages.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

export function flattenPages(group: NavGroup): NavPage[] {
  const out: NavPage[] = [];
  if (group.children?.length) {
    for (const child of group.children) {
      out.push(...flattenPages(child));
    }
  }
  out.push(...group.pages);
  return out;
}

export function getBreadcrumbTrail(navTree: NavTree, currentSlug: string): NavGroup[] {
  const trail: NavGroup[] = [];
  function find(tab: NavTab, groups: NavGroup[], path: NavGroup[]): boolean {
    for (const group of groups) {
      const inPages = group.pages.some((p) => p.slug === currentSlug);
      if (inPages) {
        trail.push(...path, group);
        return true;
      }
      if (group.children?.length && find(tab, group.children, [...path, group])) {
        return true;
      }
    }
    return false;
  }
  for (const tab of navTree.tabs) {
    if (find(tab, tab.groups, [])) break;
  }
  return trail;
}

export function buildNavTree(entries: CollectionEntry<'docs'>[]): NavTree {
  const tabsMap = new Map<string, NavTab>();

  for (const entry of entries) {
    const parts = entry.id.split('/');
    if (parts.length < 3) continue;

    const tabSlug = parts[0];
    const folderSegments = parts.slice(1, -1);
    const filePart = parts[parts.length - 1];
    const pageSlug = filePart.replace(/\.md$/, '');

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
    const leafGroup = getOrCreateGroupChain(tab, tabSlug, folderSegments);

    const data = entry.data as { name?: string; order?: number; icon?: string; status?: string };
    const pageName = data.name || humanize(pageSlug);
    const pageOrder = data.order ?? Number.MAX_SAFE_INTEGER;
    const pageIcon = data.icon || 'file-01';

    leafGroup.pages.push({
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
    const todoPage: NavPage = {
      slug: `${tabSlug}/tasks/todo`,
      name: 'Todo',
      href: `/${tabSlug}/tasks/todo`,
      order: 1,
      icon: 'left-to-right-list-bullet',
    };
    const inProgressPage: NavPage = {
      slug: `${tabSlug}/tasks/in-progress`,
      name: 'In progress',
      href: `/${tabSlug}/tasks/in-progress`,
      order: 2,
      icon: 'pencil-edit-01',
    };
    const donePage: NavPage = {
      slug: `${tabSlug}/tasks/done`,
      name: 'Done',
      href: `/${tabSlug}/tasks/done`,
      order: 3,
      icon: 'tick-double-02',
    };
    const tasksGroup: NavGroup = {
      slug: 'tasks',
      name: 'Tasks',
      pages: [todoPage, inProgressPage, donePage],
      order: Number.MAX_SAFE_INTEGER,
    };
    tab.groups.push(tasksGroup);
  }

  const tabs = Array.from(tabsMap.values());
  for (const tab of tabs) {
    tab.groups.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
    for (const group of tab.groups) sortGroupRecursive(group);
  }
  tabs.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

  return { tabs };
}

function findPageInGroups(
  groups: NavGroup[],
  pathOrHref: string,
  normalized: string
): NavPage | null {
  for (const group of groups) {
    const page = group.pages.find(
      (p) => p.slug === normalized || p.href === pathOrHref || p.href === `/${normalized}`
    );
    if (page) return page;
    if (group.children?.length) {
      const found = findPageInGroups(group.children, pathOrHref, normalized);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Returns the display name for a doc/task path (e.g. "guides/core_concepts/theming" or "/guides/core_concepts/theming").
 * Returns null if the path is not found in the nav tree.
 */
export function getPageNameByPath(navTree: NavTree, pathOrHref: string): string | null {
  const normalized = pathOrHref.replace(/^\//, '');
  for (const tab of navTree.tabs) {
    const page = findPageInGroups(tab.groups, pathOrHref, normalized);
    if (page) return page.name;
  }
  return null;
}

export function getFirstPage(navTree: NavTree): string | null {
  const firstTab = navTree.tabs[0];
  if (!firstTab) return null;
  const flat: NavPage[] = [];
  for (const group of firstTab.groups) flat.push(...flattenPages(group));
  const firstPage = flat[0];
  if (!firstPage) return null;
  return firstPage.href;
}

function groupContainsSlug(group: NavGroup, slug: string): boolean {
  if (group.pages.some((p) => p.slug === slug)) return true;
  if (group.children?.length) {
    return group.children.some((c) => groupContainsSlug(c, slug));
  }
  return false;
}

export function findCurrentTab(navTree: NavTree, slug: string): NavTab | null {
  for (const tab of navTree.tabs) {
    for (const group of tab.groups) {
      if (groupContainsSlug(group, slug)) return tab;
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
  for (const group of tab.groups) flat.push(...flattenPages(group));

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
