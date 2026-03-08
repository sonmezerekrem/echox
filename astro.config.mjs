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

const apisDir = path.join(userDir, 'apis');
const assetsDir = path.join(userDir, 'assets');
const userDirResolved = path.resolve(userDir);

function echoxReloadIntegration() {
  return {
    name: 'echox-reload',
    hooks: {
      'astro:server:setup': ({ server, refreshContent, logger }) => {
        // Watch user config, content (root), apis, and assets (they live outside Astro root)
        const watchPaths = [configPath, userDir];
        if (fs.existsSync(apisDir)) watchPaths.push(apisDir);
        if (fs.existsSync(assetsDir)) watchPaths.push(assetsDir);
        for (const p of watchPaths) server.watcher.add(p);

        const shouldReload = (changedPath) => {
          const resolved = path.resolve(changedPath);
          if (resolved === path.resolve(configPath)) return true;
          if (resolved.startsWith(userDirResolved)) return true;
          if (fs.existsSync(apisDir) && resolved.startsWith(path.resolve(apisDir))) return true;
          if (fs.existsSync(assetsDir) && resolved.startsWith(path.resolve(assetsDir))) return true;
          return false;
        };

        const handleChange = async (p) => {
          if (!shouldReload(p)) return;
          logger.info(`[echox] Reloading: ${path.relative(userDirResolved, p) || p}`);
          try {
            if (refreshContent) await refreshContent();
          } catch (_) {}
          if (server.moduleGraph) server.moduleGraph.invalidateAll();
          server.ws.send({ type: 'full-reload' });
        };

        for (const event of ['change', 'add', 'unlink']) {
          server.watcher.on(event, handleChange);
        }
      },
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
  integrations: [echoxReloadIntegration()],
  vite: {
    resolve: {
      alias: {
        '@config': configPath,
      },
    },
  },
});
