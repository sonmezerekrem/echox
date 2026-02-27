import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

const userDir = process.env.ECHOX_DIR || process.cwd();
const contentDir = path.join(userDir, 'content');

export interface TaskRelation {
  label?: string;
  url: string;
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  labels?: string[];
  status: string;
  relations?: (string | TaskRelation)[];
  type?: string;
  steps?: string[];
  acceptanceCriteria?: string[];
  createdAt?: string;
  updatedAt?: string;
  dependencies?: string[];
}

function normalizeRelation(raw: unknown): TaskRelation | null {
  if (typeof raw === 'string') {
    const s = raw.trim();
    if (!s) return null;
    if (s.startsWith('http')) return { url: s };
    // Jira-style task ID (e.g. ECX-1) → same-page anchor
    if (/^[A-Z][A-Z0-9]+-\d+$/i.test(s)) return { url: `#task-${s}`, label: s };
    return { url: s.startsWith('/') ? s : `/${s}` };
  }
  if (typeof raw === 'object' && raw !== null) {
    const o = raw as Record<string, unknown>;
    const url = typeof o.url === 'string' ? o.url : typeof o.href === 'string' ? o.href : null;
    if (url) {
      return {
        label: typeof o.label === 'string' ? o.label : undefined,
        url: url.startsWith('http') ? url : `/${url}`,
      };
    }
  }
  return null;
}

function normalizeTask(raw: unknown): Task | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === 'string' ? o.id.trim() : null;
  const name = typeof o.name === 'string' ? o.name.trim() : null;
  if (!id || !name) return null;

  const status = typeof o.status === 'string' ? o.status : 'todo';
  const type = typeof o.type === 'string' ? o.type : undefined;

  let labels: string[] = [];
  if (Array.isArray(o.labels)) {
    labels = o.labels.filter((l): l is string => typeof l === 'string');
  }

  let relations: (string | TaskRelation)[] = [];
  if (Array.isArray(o.relations)) {
    relations = o.relations
      .map((r) => {
        const rel = normalizeRelation(r);
        if (rel) return rel;
        if (typeof r === 'string') return r;
        return null;
      })
      .filter((r): r is string | TaskRelation => r !== null);
  }

  let steps: string[] | undefined;
  if (Array.isArray(o.steps)) {
    const s = o.steps.filter((v): v is string => typeof v === 'string' && v.trim().length > 0);
    if (s.length) steps = s;
  }

  let acceptanceCriteria: string[] | undefined;
  if (Array.isArray(o['acceptance_criteria']) || Array.isArray(o.acceptanceCriteria)) {
    const src = (Array.isArray(o['acceptance_criteria']) ? o['acceptance_criteria'] : o.acceptanceCriteria) as unknown[];
    const ac = src.filter((v): v is string => typeof v === 'string' && v.trim().length > 0);
    if (ac.length) acceptanceCriteria = ac;
  }

  let dependencies: string[] | undefined;
  if (Array.isArray(o.dependency) || Array.isArray(o.dependencies)) {
    const src = (Array.isArray(o.dependencies) ? o.dependencies : o.dependency) as unknown[];
    const dep = src.filter((v): v is string => typeof v === 'string' && v.trim().length > 0);
    if (dep.length) dependencies = dep;
  }

  const createdAt = typeof o['created_at'] === 'string' ? o['created_at'] : typeof o.createdAt === 'string' ? o.createdAt : undefined;
  const updatedAt = typeof o['updated_at'] === 'string' ? o['updated_at'] : typeof o.updatedAt === 'string' ? o.updatedAt : undefined;

  return {
    id,
    name,
    description: typeof o.description === 'string' ? o.description : undefined,
    labels: labels.length ? labels : undefined,
    status,
    relations: relations.length ? relations : undefined,
     type,
     steps,
     acceptanceCriteria,
     createdAt,
     updatedAt,
     dependencies,
  };
}

/**
 * Returns tab slugs that have a tasks.yml file under content/{tab}/tasks.yml.
 */
export function getTabsWithTasks(): string[] {
  let tabDirs: string[];
  try {
    tabDirs = fs.readdirSync(contentDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch {
    return [];
  }

  return tabDirs.filter((tab) => {
    const tasksPath = path.join(contentDir, tab, 'tasks.yml');
    return fs.existsSync(tasksPath);
  });
}

/**
 * Loads and parses tasks from content/{tabSlug}/tasks.yml.
 * Returns an empty array on missing file or parse/validation errors.
 */
export function loadTasksForTab(tabSlug: string): Task[] {
  const tasksPath = path.join(contentDir, tabSlug, 'tasks.yml');
  let raw: string;
  try {
    raw = fs.readFileSync(tasksPath, 'utf-8');
  } catch {
    return [];
  }

  let parsed: unknown;
  try {
    parsed = parseYaml(raw);
  } catch {
    return [];
  }

  if (!parsed || typeof parsed !== 'object') return [];
  const tasksArray = (parsed as Record<string, unknown>).tasks;
  if (!Array.isArray(tasksArray)) return [];

  const tasks = tasksArray
    .map((t) => normalizeTask(t))
    .filter((t): t is Task => t !== null);
  return tasks;
}
