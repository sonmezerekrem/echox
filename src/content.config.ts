import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import path from 'node:path';

const userDir = process.env.ECHOX_DIR || process.cwd();

const docs = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: path.resolve(userDir),
    ignore: ['assets/**', 'apis/**', 'dist/**', 'node_modules/**', '.git/**'],
  }),
  schema: z.object({
    name: z.string().optional(),
    order: z.number().optional(),
    icon: z.string().optional(),
    status: z.enum(['draft', 'beta', 'deprecated', 'new']).optional(),
  }),
});

export const collections = { docs };
