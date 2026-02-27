import fs from 'node:fs';
import path from 'node:path';
import type { NavTab, NavGroup, NavPage } from './navigation';

const userDir = process.env.ECHOX_DIR || process.cwd();

export interface ApiParameter {
  name: string;
  in: 'path' | 'query' | 'header' | 'cookie';
  required: boolean;
  description: string;
  type: string;
}

export interface ApiResponseEntry {
  code: string;
  description: string;
  example?: string;
}

export interface ApiEndpoint {
  method: string;
  path: string;
  operationId: string;
  summary: string;
  description: string;
  parameters: ApiParameter[];
  requestBody?: { description: string; contentType: string; schema: string; example: string };
  responses: ApiResponseEntry[];
  tags: string[];
  slug: string;
  apiSlug: string;
  tabName: string;
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[{}]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function humanize(slug: string): string {
  return slug
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function resolveRef(spec: any, ref: string): any {
  const parts = ref.replace(/^#\//, '').split('/');
  let current = spec;
  for (const part of parts) {
    current = current?.[part];
  }
  return current;
}

function resolveSchema(spec: any, schema: any): any {
  if (!schema) return schema;
  if (schema.$ref) return resolveRef(spec, schema.$ref);
  if (schema.items) {
    return { ...schema, items: resolveSchema(spec, schema.items) };
  }
  if (schema.properties) {
    const resolved: Record<string, any> = {};
    for (const [key, val] of Object.entries(schema.properties)) {
      resolved[key] = resolveSchema(spec, val);
    }
    return { ...schema, properties: resolved };
  }
  return schema;
}

function schemaToTypeString(schema: any): string {
  if (!schema) return 'any';
  if (schema.type === 'array') {
    return `${schemaToTypeString(schema.items)}[]`;
  }
  if (schema.type === 'object' || schema.properties) {
    return 'object';
  }
  return schema.type || 'any';
}

function generateExample(spec: any, schema: any): any {
  if (!schema) return undefined;
  if (schema.example !== undefined) return schema.example;

  const resolved = resolveSchema(spec, schema);
  if (resolved.example !== undefined) return resolved.example;

  if (resolved.type === 'object' || resolved.properties) {
    const obj: Record<string, any> = {};
    if (resolved.properties) {
      for (const [key, prop] of Object.entries<any>(resolved.properties)) {
        obj[key] = generateExample(spec, prop);
      }
    }
    return obj;
  }
  if (resolved.type === 'array') {
    const item = generateExample(spec, resolved.items);
    return item !== undefined ? [item] : [];
  }
  if (resolved.type === 'string') return resolved.enum?.[0] ?? 'string';
  if (resolved.type === 'integer' || resolved.type === 'number') return 0;
  if (resolved.type === 'boolean') return true;
  return null;
}

function parseSpec(apiSlug: string, spec: any): { tab: NavTab; endpoints: ApiEndpoint[] } {
  const title = spec.info?.title || humanize(apiSlug);
  const endpoints: ApiEndpoint[] = [];

  const tagGroups = new Map<string, NavPage[]>();

  for (const [pathStr, pathItem] of Object.entries<any>(spec.paths || {})) {
    const methods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'];
    for (const method of methods) {
      const operation = pathItem[method];
      if (!operation) continue;

      const tag = operation.tags?.[0] || 'Default';
      const endpointSlug = `${method}-${slugify(pathStr)}`;
      const fullSlug = `api/${apiSlug}/${endpointSlug}`;

      const params: ApiParameter[] = [
        ...(pathItem.parameters || []),
        ...(operation.parameters || []),
      ].map((p: any) => {
        const resolved = p.$ref ? resolveRef(spec, p.$ref) : p;
        const paramSchema = resolveSchema(spec, resolved.schema);
        return {
          name: resolved.name,
          in: resolved.in,
          required: resolved.required ?? false,
          description: resolved.description || '',
          type: schemaToTypeString(paramSchema),
        };
      });

      let requestBody: ApiEndpoint['requestBody'];
      if (operation.requestBody) {
        const rb = operation.requestBody.$ref
          ? resolveRef(spec, operation.requestBody.$ref)
          : operation.requestBody;
        const content = rb.content || {};
        const contentType = Object.keys(content)[0] || 'application/json';
        const mediaType = content[contentType];
        const schema = mediaType?.schema ? resolveSchema(spec, mediaType.schema) : undefined;
        requestBody = {
          description: rb.description || '',
          contentType,
          schema: schema ? JSON.stringify(schema, null, 2) : '',
          example: JSON.stringify(generateExample(spec, mediaType?.schema), null, 2),
        };
      }

      const responses: ApiResponseEntry[] = Object.entries<any>(operation.responses || {}).map(
        ([code, resp]) => {
          const resolved = resp.$ref ? resolveRef(spec, resp.$ref) : resp;
          const content = resolved.content || {};
          const contentType = Object.keys(content)[0];
          const mediaType = contentType ? content[contentType] : undefined;
          let example: string | undefined;
          if (mediaType?.schema) {
            example = JSON.stringify(generateExample(spec, mediaType.schema), null, 2);
          }
          return {
            code,
            description: resolved.description || '',
            example,
          };
        }
      );

      const endpoint: ApiEndpoint = {
        method: method.toUpperCase(),
        path: pathStr,
        operationId: operation.operationId || endpointSlug,
        summary: operation.summary || '',
        description: operation.description || '',
        parameters: params,
        requestBody,
        responses,
        tags: operation.tags || ['Default'],
        slug: fullSlug,
        apiSlug,
        tabName: title,
      };

      endpoints.push(endpoint);

      const tagSlug = slugify(tag);
      if (!tagGroups.has(tagSlug)) {
        tagGroups.set(tagSlug, []);
      }

      const methodIcons: Record<string, string> = {
        GET: 'download-04',
        POST: 'upload-04',
        PUT: 'edit-02',
        PATCH: 'edit-02',
        DELETE: 'delete-02',
        HEAD: 'information-circle',
        OPTIONS: 'settings-02',
      };

      tagGroups.get(tagSlug)!.push({
        slug: fullSlug,
        name: `${method.toUpperCase()} ${operation.summary || pathStr}`,
        href: `/${fullSlug}`,
        order: endpoints.length,
        icon: methodIcons[method.toUpperCase()] || 'file-01',
      });
    }
  }

  const groups: NavGroup[] = [];
  for (const [tagSlug, pages] of tagGroups) {
    groups.push({
      slug: tagSlug,
      name: humanize(tagSlug),
      pages,
      order: groups.length,
    });
  }

  const tab: NavTab = {
    slug: `api-${apiSlug}`,
    name: title,
    groups,
    order: Number.MAX_SAFE_INTEGER,
    type: 'api' as const,
  };

  return { tab, endpoints };
}

let cachedResult: { tabs: NavTab[]; endpoints: ApiEndpoint[] } | null = null;

export function loadOpenApiSpecs(): { tabs: NavTab[]; endpoints: ApiEndpoint[] } {
  if (cachedResult) return cachedResult;

  const apisDir = path.join(userDir, 'apis');
  const tabs: NavTab[] = [];
  const allEndpoints: ApiEndpoint[] = [];

  if (!fs.existsSync(apisDir)) {
    cachedResult = { tabs, endpoints: allEndpoints };
    return cachedResult;
  }

  const files = fs.readdirSync(apisDir).filter((f) => f.endsWith('.json')).sort();

  for (const file of files) {
    const filePath = path.join(apisDir, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    let spec: any;
    try {
      spec = JSON.parse(raw);
    } catch {
      continue;
    }

    const apiSlug = file.replace(/\.json$/, '');
    const { tab, endpoints } = parseSpec(apiSlug, spec);
    tabs.push(tab);
    allEndpoints.push(...endpoints);
  }

  cachedResult = { tabs, endpoints: allEndpoints };
  return cachedResult;
}

export function getEndpointBySlug(slug: string): ApiEndpoint | undefined {
  const { endpoints } = loadOpenApiSpecs();
  return endpoints.find((e) => e.slug === slug);
}
