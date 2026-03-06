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
import remarkStripH1WhenUsedAsTitle from './src/plugins/remark-strip-h1-when-used-as-title.mjs';

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

const contentDir = path.join(userDir, 'content');
const apisDir = path.join(userDir, 'apis');
const assetsDir = path.join(userDir, 'assets');

function echoxConfigReload() {
  return {
    name: 'echox-config-reload',
    configureServer(server) {
      // Watch user config, content, apis, and assets so edits trigger reload (they live outside Astro root)
      server.watcher.add(configPath);
      if (fs.existsSync(contentDir)) server.watcher.add(contentDir);
      if (fs.existsSync(apisDir)) server.watcher.add(apisDir);
      if (fs.existsSync(assetsDir)) server.watcher.add(assetsDir);

      const triggerReload = (changedPath) => {
        const resolved = path.resolve(changedPath);
        if (resolved === path.resolve(configPath)) return true;
        const contentResolved = path.resolve(contentDir);
        const apisResolved = path.resolve(apisDir);
        const assetsResolved = path.resolve(assetsDir);
        if (
          resolved.startsWith(contentResolved) ||
          resolved.startsWith(apisResolved) ||
          resolved.startsWith(assetsResolved)
        )
          return true;
        return false;
      };

      for (const event of ['change', 'add', 'unlink']) {
        server.watcher.on(event, (p) => {
          if (triggerReload(p)) server.ws.send({ type: 'full-reload' });
        });
      }
    },
  };
}

const basePath = process.env.ECHOX_BASE || '/';

export default defineConfig({
  output: 'static',
  base: basePath,
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
    remarkPlugins: [remarkDirective, remarkComponents, remarkStripH1WhenUsedAsTitle, ...remarkPlugins],
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
