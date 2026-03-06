import fs from 'node:fs';
import path from 'node:path';
import { PALETTES } from './colors';

export interface HeaderLink {
  label: string;
  url: string;
  external?: boolean;
  type?: 'link' | 'button';
}

export interface FooterLink {
  label: string;
  url: string;
  external?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterConfig {
  message?: string;
  columns?: FooterColumn[];
}

export interface SiteConfig {
  name: string;
  description?: string;
  logo?: string;
  favicon?: string;
  color?: string;
  theme?: string;
  github?: string;
  links?: HeaderLink[];
  footer?: FooterConfig;
}

const userDir = process.env.ECHOX_DIR || process.cwd();
const isDev = process.env.NODE_ENV !== 'production';

let cachedConfig: SiteConfig | null = null;

function validateConfig(config: unknown): SiteConfig {
  if (typeof config !== 'object' || config === null) {
    throw new Error('config.json must contain a JSON object');
  }

  const obj = config as Record<string, unknown>;
  const errors: string[] = [];

  if (typeof obj.name !== 'string' || obj.name.trim() === '') {
    errors.push('"name" is required and must be a non-empty string');
  }

  if (obj.description !== undefined && typeof obj.description !== 'string') {
    errors.push('"description" must be a string');
  }

  if (obj.color !== undefined) {
    if (typeof obj.color !== 'string' || !PALETTES[obj.color]) {
      const valid = Object.keys(PALETTES).join(', ');
      errors.push(`"color" must be one of: ${valid} (got "${obj.color}")`);
    }
  }

  if (obj.theme !== undefined && typeof obj.theme !== 'string') {
    errors.push('"theme" must be a string');
  }

  if (obj.logo !== undefined && typeof obj.logo !== 'string') {
    errors.push('"logo" must be a string');
  }

  if (obj.favicon !== undefined && typeof obj.favicon !== 'string') {
    errors.push('"favicon" must be a string');
  }

  if (obj.github !== undefined) {
    if (typeof obj.github !== 'string' || !obj.github.startsWith('https://')) {
      errors.push('"github" must be a URL starting with https://');
    }
  }

  if (obj.links !== undefined) {
    if (!Array.isArray(obj.links)) {
      errors.push('"links" must be an array');
    } else {
      (obj.links as unknown[]).forEach((link, i) => {
        if (typeof link !== 'object' || link === null) {
          errors.push(`"links[${i}]" must be an object`);
          return;
        }
        const l = link as Record<string, unknown>;
        if (typeof l.label !== 'string' || l.label.trim() === '') {
          errors.push(`"links[${i}].label" is required and must be a non-empty string`);
        }
        if (typeof l.url !== 'string' || l.url.trim() === '') {
          errors.push(`"links[${i}].url" is required and must be a non-empty string`);
        }
        if (l.external !== undefined && typeof l.external !== 'boolean') {
          errors.push(`"links[${i}].external" must be a boolean`);
        }
        if (l.type !== undefined && l.type !== 'link' && l.type !== 'button') {
          errors.push(`"links[${i}].type" must be "link" or "button" (got "${l.type}")`);
        }
      });
    }
  }

  if (obj.footer !== undefined) {
    if (typeof obj.footer !== 'object' || obj.footer === null) {
      errors.push('"footer" must be an object');
    } else {
      const f = obj.footer as Record<string, unknown>;
      if (f.message !== undefined && typeof f.message !== 'string') {
        errors.push('"footer.message" must be a string');
      }
      if (f.columns !== undefined) {
        if (!Array.isArray(f.columns)) {
          errors.push('"footer.columns" must be an array');
        } else {
          (f.columns as unknown[]).forEach((col, i) => {
            if (typeof col !== 'object' || col === null) {
              errors.push(`"footer.columns[${i}]" must be an object`);
              return;
            }
            const c = col as Record<string, unknown>;
            if (typeof c.title !== 'string' || c.title.trim() === '') {
              errors.push(`"footer.columns[${i}].title" is required and must be a non-empty string`);
            }
            if (!Array.isArray(c.links)) {
              errors.push(`"footer.columns[${i}].links" must be an array`);
            } else {
              (c.links as unknown[]).forEach((link, j) => {
                if (typeof link !== 'object' || link === null) {
                  errors.push(`"footer.columns[${i}].links[${j}]" must be an object`);
                  return;
                }
                const lnk = link as Record<string, unknown>;
                if (typeof lnk.label !== 'string' || lnk.label.trim() === '') {
                  errors.push(`"footer.columns[${i}].links[${j}].label" is required`);
                }
                if (typeof lnk.url !== 'string' || lnk.url.trim() === '') {
                  errors.push(`"footer.columns[${i}].links[${j}].url" is required`);
                }
              });
            }
          });
        }
      }
    }
  }

  if (errors.length > 0) {
    const msg = ['Invalid config.json:', ...errors.map((e) => `  - ${e}`)].join('\n');
    throw new Error(msg);
  }

  const siteConfig = obj as unknown as SiteConfig;
  siteConfig.theme = siteConfig.theme ?? 'default';
  return siteConfig;
}

export function loadConfig(): SiteConfig {
  if (!isDev && cachedConfig) return cachedConfig;

  const configPath = path.join(userDir, 'config.json');

  let raw: string;
  try {
    raw = fs.readFileSync(configPath, 'utf-8');
  } catch {
    throw new Error(`Cannot read config.json at ${configPath}`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`config.json is not valid JSON: ${msg}`);
  }

  const config = validateConfig(parsed);
  cachedConfig = config;
  return config;
}
