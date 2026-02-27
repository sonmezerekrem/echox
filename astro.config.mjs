import { defineConfig } from 'astro/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import {
  transformerMetaHighlight,
  transformerNotationDiff,
} from '@shikijs/transformers';
import remarkDirective from 'remark-directive';
import remarkComponents from './src/plugins/remark-components.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const userDir = process.env.ECHOX_DIR
  ? path.resolve(process.env.ECHOX_DIR)
  : process.cwd();

function loadUserPlugins() {
  const pluginsDir = path.join(userDir, 'plugins');
  const remarkPlugins = [];
  const rehypePlugins = [];

  if (!fs.existsSync(pluginsDir)) return { remarkPlugins, rehypePlugins };

  const files = fs.readdirSync(pluginsDir).filter((f) => f.endsWith('.mjs'));
  for (const file of files) {
    const pluginPath = path.join(pluginsDir, file);
    if (file.startsWith('remark-')) {
      remarkPlugins.push(pluginPath);
    } else if (file.startsWith('rehype-')) {
      rehypePlugins.push(pluginPath);
    }
  }

  return { remarkPlugins, rehypePlugins };
}

const { remarkPlugins, rehypePlugins } = loadUserPlugins();

const configPath = path.join(userDir, 'config.json');

function echoxConfigReload() {
  return {
    name: 'echox-config-reload',
    configureServer(server) {
      server.watcher.add(configPath);
      server.watcher.on('change', (changedPath) => {
        if (path.resolve(changedPath) === path.resolve(configPath)) {
          server.ws.send({ type: 'full-reload' });
        }
      });
    },
  };
}

export default defineConfig({
  output: 'static',
  outDir: path.join(userDir, 'dist'),
  publicDir: path.join(userDir, 'assets'),
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
      transformers: [
        transformerMetaHighlight(),
        transformerNotationDiff(),
        {
          name: 'echox:title',
          pre(node) {
            const meta = this.options.meta?.__raw;
            if (!meta) return;
            const match = meta.match(/title="([^"]+)"/);
            if (match) {
              node.properties['data-title'] = match[1];
            }
          },
        },
      ],
    },
    remarkPlugins: [remarkDirective, remarkComponents, ...remarkPlugins],
    rehypePlugins,
  },
  vite: {
    plugins: [echoxConfigReload()],
    resolve: {
      alias: {
        '@config': configPath,
      },
    },
  },
});
