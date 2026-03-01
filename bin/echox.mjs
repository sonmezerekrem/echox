#!/usr/bin/env node

import { spawn, spawnSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, '..');
const userDir = process.cwd();

const COMMANDS = ['dev', 'build', 'preview', 'init', 'logo'];

// Hex 600 shade per palette (for logo/favicon background)
const COLOR_HEX_600 = {
  slate: '#475569', gray: '#4b5563', zinc: '#52525b', neutral: '#525252',
  stone: '#57534e', red: '#dc2626', orange: '#ea580c', amber: '#d97706',
  yellow: '#ca8a04', lime: '#65a30d', green: '#16a34a', emerald: '#059669',
  teal: '#0d9488', cyan: '#0891b2', sky: '#0284c7', blue: '#2563eb',
  indigo: '#4f46e5', violet: '#7c3aed', purple: '#9333ea', fuchsia: '#c026d3',
  pink: '#db2777', rose: '#e11d48',
};

function printUsage() {
  console.log(`
  echox - Static documentation site builder

  Usage:
    echox <command> [options]
    echox -v | --version   Print version

  Commands:
    init      Scaffold a new docs project in the current directory
    dev       Start development server with hot reload
    build     Build static site to ./dist
    preview   Preview the built site locally
    logo      Generate logo and favicon (usage: echox logo <color>)

  Build options:
    --no-link-check   Skip broken link detection during build

  Init options:
    --name "My Docs"  Set the project name (skips prompt)

  Your project directory should contain:
    content/     Markdown files organized in folders
    assets/      Static assets (images, etc.)
    config.json  Site configuration

  CI/CD:
    Use "echox build" in your CI pipeline.
    The build will fail if broken internal links are detected.
    See .github/workflows/build-docs.yml for a GitHub Actions example.
`);
}

// ── Config validation (shared with src/utils/config.ts at runtime) ──

const VALID_COLORS = [
  'slate', 'gray', 'zinc', 'neutral', 'stone',
  'red', 'orange', 'amber', 'yellow', 'lime',
  'green', 'emerald', 'teal', 'cyan', 'sky',
  'blue', 'indigo', 'violet', 'purple', 'fuchsia',
  'pink', 'rose',
];

function validateConfig(configPath) {
  let raw;
  try {
    raw = fs.readFileSync(configPath, 'utf-8');
  } catch {
    console.error(`Error: Cannot read ${configPath}`);
    process.exit(1);
  }

  let config;
  try {
    config = JSON.parse(raw);
  } catch (e) {
    console.error(`Error: config.json is not valid JSON`);
    console.error(`  ${e.message}`);
    process.exit(1);
  }

  const errors = [];

  if (typeof config.name !== 'string' || config.name.trim() === '') {
    errors.push('"name" is required and must be a non-empty string');
  }

  if (config.color !== undefined) {
    if (typeof config.color !== 'string' || !VALID_COLORS.includes(config.color)) {
      errors.push(`"color" must be one of: ${VALID_COLORS.join(', ')} (got "${config.color}")`);
    }
  }

  if (config.logo !== undefined && typeof config.logo !== 'string') {
    errors.push('"logo" must be a string');
  }

  if (config.favicon !== undefined && typeof config.favicon !== 'string') {
    errors.push('"favicon" must be a string');
  }

  if (config.github !== undefined) {
    if (typeof config.github !== 'string' || !config.github.startsWith('https://')) {
      errors.push('"github" must be a URL starting with https://');
    }
  }

  if (config.links !== undefined) {
    if (!Array.isArray(config.links)) {
      errors.push('"links" must be an array');
    } else {
      config.links.forEach((link, i) => {
        if (typeof link !== 'object' || link === null) {
          errors.push(`"links[${i}]" must be an object`);
          return;
        }
        if (typeof link.label !== 'string' || link.label.trim() === '') {
          errors.push(`"links[${i}].label" is required and must be a non-empty string`);
        }
        if (typeof link.url !== 'string' || link.url.trim() === '') {
          errors.push(`"links[${i}].url" is required and must be a non-empty string`);
        }
        if (link.external !== undefined && typeof link.external !== 'boolean') {
          errors.push(`"links[${i}].external" must be a boolean`);
        }
        if (link.type !== undefined && !['link', 'button'].includes(link.type)) {
          errors.push(`"links[${i}].type" must be "link" or "button" (got "${link.type}")`);
        }
      });
    }
  }

  if (config.footer !== undefined) {
    if (typeof config.footer !== 'object' || config.footer === null) {
      errors.push('"footer" must be an object');
    } else {
      if (config.footer.message !== undefined && typeof config.footer.message !== 'string') {
        errors.push('"footer.message" must be a string');
      }
      if (config.footer.columns !== undefined) {
        if (!Array.isArray(config.footer.columns)) {
          errors.push('"footer.columns" must be an array');
        } else {
          config.footer.columns.forEach((col, i) => {
            if (typeof col !== 'object' || col === null) {
              errors.push(`"footer.columns[${i}]" must be an object`);
              return;
            }
            if (typeof col.title !== 'string' || col.title.trim() === '') {
              errors.push(`"footer.columns[${i}].title" is required`);
            }
            if (!Array.isArray(col.links)) {
              errors.push(`"footer.columns[${i}].links" must be an array`);
            }
          });
        }
      }
    }
  }

  if (errors.length > 0) {
    console.error('Error: Invalid config.json');
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }

  return config;
}

function validate() {
  const contentDir = path.join(userDir, 'content');
  const configFile = path.join(userDir, 'config.json');

  if (!fs.existsSync(contentDir)) {
    console.error(`Error: No content/ directory found in ${userDir}`);
    console.error('Create a content/ directory with your markdown files.');
    console.error('Run "echox init" to scaffold a new project.');
    process.exit(1);
  }

  if (!fs.existsSync(configFile)) {
    console.error(`Error: No config.json found in ${userDir}`);
    console.error('Create a config.json with at least: { "name": "My Docs" }');
    console.error('Run "echox init" to scaffold a new project.');
    process.exit(1);
  }

  validateConfig(configFile);
}

// ── Init command ──

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function runInit() {
  const contentDir = path.join(userDir, 'content');
  const configFile = path.join(userDir, 'config.json');

  if (fs.existsSync(contentDir) || fs.existsSync(configFile)) {
    console.error('Error: This directory already contains content/ or config.json');
    console.error('The init command should be run in an empty directory.');
    process.exit(1);
  }

  const nameFlag = process.argv.indexOf('--name');
  let projectName;
  if (nameFlag !== -1 && process.argv[nameFlag + 1]) {
    projectName = process.argv[nameFlag + 1];
  } else {
    const dirName = path.basename(userDir)
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    projectName = await prompt(`Project name (${dirName}): `);
    if (!projectName.trim()) projectName = dirName;
  }

  const starterMd = `---
name: Introduction
order: 1
icon: home-04
---

# Welcome to ${projectName}

This is your documentation site. Start editing this file or add new markdown files to the \`content/\` directory.

## Getting Started

Your documentation is organized in a three-level folder structure:

- **Tabs** -- top-level folders in \`content/\` appear as tabs in the header
- **Groups** -- second-level folders become sidebar section headings
- **Pages** -- markdown files are listed as links under their group

## What's Next

- Add more pages by creating \`.md\` files in \`content/\`
- Put images in the \`assets/\` directory
- Edit \`config.json\` to customize your site
`;

  const config = {
    name: projectName,
    color: 'blue',
  };

  const tasksYaml = `# Tasks for this tab. Add tasks with id, name, and status (todo | in-progress | done).
# Optional: description, type, labels, steps, acceptance_criteria, relations, dependencies.
# See docs for the full schema. This tab will show Todo / In progress / Done pages in the sidebar.
tasks:
  - id: TASK-1
    name: Edit the introduction page
    description: Customize content/docs/getting_started/introduction.md for your project.
    type: docs
    labels:
      - onboarding
    status: todo
    steps:
      - Open content/docs/getting_started/introduction.md
      - Update the welcome text and next steps
    acceptance_criteria:
      - Introduction reflects your project name and goals
  - id: TASK-2
    name: Add your first real page
    description: Create a new markdown file under content/docs/ to document a topic.
    type: docs
    labels:
      - content
    status: todo
    steps:
      - Create a new folder under content/docs/ (e.g. content/docs/guides/)
      - Add a .md file (e.g. my_topic.md) with frontmatter and content
    acceptance_criteria:
      - New page appears in the sidebar and builds without errors
    relations:
      - docs/getting_started/introduction
`;

  const openApiSpec = {
    openapi: '3.0.3',
    info: {
      title: 'Sample API',
      description: 'A minimal OpenAPI spec to show how Echox renders API docs. Each file in apis/ becomes a tab; tags become sidebar groups; paths become pages.',
      version: '1.0.0',
    },
    servers: [{ url: 'https://api.example.com/v1' }],
    paths: {
      '/hello': {
        get: {
          tags: ['Greeting'],
          operationId: 'getHello',
          summary: 'Say hello',
          description: 'Returns a greeting. Use this to verify the API is up.',
          parameters: [
            { name: 'name', in: 'query', required: false, description: 'Name to greet', schema: { type: 'string', default: 'World' } },
          ],
          responses: {
            200: {
              description: 'Greeting message',
              content: {
                'application/json': {
                  schema: { type: 'object', properties: { message: { type: 'string', example: 'Hello, World!' } } },
                },
              },
            },
          },
        },
      },
      '/health': {
        get: {
          tags: ['System'],
          operationId: 'getHealth',
          summary: 'Health check',
          description: 'Returns service health status.',
          responses: {
            200: {
              description: 'Service is healthy',
              content: {
                'application/json': {
                  schema: { type: 'object', properties: { status: { type: 'string', example: 'ok' } } },
                },
              },
            },
          },
        },
      },
    },
  };

  fs.mkdirSync(path.join(contentDir, 'docs', 'getting_started'), { recursive: true });
  fs.mkdirSync(path.join(userDir, 'assets'), { recursive: true });
  fs.mkdirSync(path.join(userDir, 'apis'), { recursive: true });
  fs.writeFileSync(
    path.join(contentDir, 'docs', 'getting_started', 'introduction.md'),
    starterMd,
  );
  fs.writeFileSync(path.join(contentDir, 'docs', 'tasks.yml'), tasksYaml);
  fs.writeFileSync(
    path.join(userDir, 'apis', 'sample_api.json'),
    JSON.stringify(openApiSpec, null, 2) + '\n',
  );
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2) + '\n');

  const gitignoreContent = `# Build output
dist/

# Environment
.env
.env.*

# Logs and OS
*.log
.DS_Store
`;

  fs.writeFileSync(path.join(userDir, '.gitignore'), gitignoreContent);

  const dockerfileContent = `# Build docs with Echox (requires 'echox' on npm or use a custom base image)
FROM node:22-alpine
RUN npm install -g echox

WORKDIR /docs
COPY . .
RUN echox build

# Serve the built site with nginx
FROM nginx:alpine
COPY --from=0 /docs/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
`;

  const dockerignoreContent = `# Build output
dist/

# Git and env
.git/
.env
.env.*

# Logs and OS
*.log
.DS_Store
`;

  fs.writeFileSync(path.join(userDir, 'Dockerfile'), dockerfileContent);
  fs.writeFileSync(path.join(userDir, '.dockerignore'), dockerignoreContent);

  const gitDir = path.join(userDir, '.git');
  let gitInitialized = false;
  if (!fs.existsSync(gitDir)) {
    const result = spawnSync('git', ['init'], { cwd: userDir, stdio: 'pipe', encoding: 'utf-8' });
    gitInitialized = result.status === 0;
  }

  console.log(`
  Project "${projectName}" created successfully!

  Created files:
    config.json
    content/docs/getting_started/introduction.md
    content/docs/tasks.yml
    apis/sample_api.json
    assets/
    .gitignore
    Dockerfile
    .dockerignore${gitInitialized ? '\n    (git init)' : ''}

  Next steps:
    echox dev      Start the development server (Docs + Sample Api tabs; Tasks: Todo / In progress / Done)
    echox build    Build for production
    docker build -t my-docs . && docker run -p 80:80 my-docs   Build and serve with Docker
`);
}

// ── Logo command ──

function runLogo(colorArg) {
  const configFile = path.join(userDir, 'config.json');
  if (!fs.existsSync(configFile)) {
    console.error('Error: No config.json found in the current directory.');
    console.error('Run "echox logo <color>" from your docs project root.');
    process.exit(1);
  }

  const config = validateConfig(configFile);
  const letter = (config.name || 'E').trim().charAt(0).toUpperCase();
  if (!letter) {
    console.error('Error: config.json "name" is empty; cannot derive logo letter.');
    process.exit(1);
  }

  const color = (colorArg || '').toLowerCase();
  if (!VALID_COLORS.includes(color)) {
    console.error(`Error: "${colorArg}" is not a valid color.`);
    console.error(`Use one of: ${VALID_COLORS.join(', ')}`);
    process.exit(1);
  }

  const fill = COLOR_HEX_600[color];
  const assetsDir = path.join(userDir, 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" rx="8" fill="${fill}"/>
  <text x="16" y="22" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="18" fill="#fff">${letter}</text>
</svg>
`;

  const logoPath = path.join(assetsDir, 'logo.svg');
  const faviconPath = path.join(assetsDir, 'favicon.svg');
  fs.writeFileSync(logoPath, svg);
  fs.writeFileSync(faviconPath, svg);

  const rawConfig = fs.readFileSync(configFile, 'utf-8');
  const configToWrite = JSON.parse(rawConfig);
  configToWrite.logo = '/logo.svg';
  configToWrite.favicon = '/favicon.svg';
  fs.writeFileSync(configFile, JSON.stringify(configToWrite, null, 2) + '\n');

  console.log(`
  Logo and favicon created for "${config.name}" (letter "${letter}", color ${color}).

  Written:
    assets/logo.svg
    assets/favicon.svg
    config.json (updated with "logo" and "favicon" paths)
`);
}

// ── Link checker ──

function checkLinks(outDir) {
  const broken = [];

  function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...walkDir(full));
      } else if (entry.name.endsWith('.html')) {
        files.push(full);
      }
    }
    return files;
  }

  const htmlFiles = walkDir(outDir);
  const hrefRegex = /href="([^"#][^"]*?)"/g;

  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    let match;
    while ((match = hrefRegex.exec(content)) !== null) {
      const href = match[1];

      if (!href.startsWith('/') || href.startsWith('//')) continue;
      if (href.startsWith('/pagefind/')) continue;

      const cleanHref = href.split('#')[0].split('?')[0];
      if (!cleanHref || cleanHref === '/') continue;

      const withTrailingSlash = cleanHref.endsWith('/')
        ? cleanHref
        : cleanHref + '/';
      const indexPath = path.join(outDir, withTrailingSlash, 'index.html');
      const directPath = path.join(outDir, cleanHref);
      const directHtmlPath = path.join(outDir, cleanHref + '.html');

      if (
        !fs.existsSync(indexPath) &&
        !fs.existsSync(directPath) &&
        !fs.existsSync(directHtmlPath)
      ) {
        const relSource = path.relative(outDir, file);
        broken.push({ source: relSource, href });
      }
    }
  }

  return broken;
}

// ── Main ──

function getVersion() {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf-8'));
    return pkg.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

const rawArg = process.argv[2];
const isVersionFlag = rawArg === '-v' || rawArg === '-V' || rawArg === '--v' || rawArg === '--version' || rawArg === 'version';

if (isVersionFlag) {
  console.log(getVersion());
  process.exit(0);
}

const command = rawArg;

if (command === 'init') {
  runInit().catch((err) => {
    console.error(err);
    process.exit(1);
  });
} else if (command === 'logo') {
  const colorArg = process.argv[3];
  runLogo(colorArg);
} else if (!command || !COMMANDS.includes(command)) {
  printUsage();
  process.exit(command ? 1 : 0);
} else {
  validate();

  const skipLinkCheck = process.argv.includes('--no-link-check');
  const extraArgs = process.argv.slice(3).filter((a) => a !== '--no-link-check');
  const astroBin = path.join(packageRoot, 'node_modules', '.bin', 'astro');

  const args = [command, '--root', packageRoot, ...extraArgs];

  if (command === 'build') {
    args.push('--outDir', path.join(userDir, 'dist'));
  }

  const child = spawn(astroBin, args, {
    stdio: 'inherit',
    cwd: packageRoot,
    env: {
      ...process.env,
      ECHOX_DIR: userDir,
    },
  });

  child.on('close', (code) => {
    if (code !== 0 || command !== 'build') {
      process.exit(code ?? 0);
    }

    const outDir = path.join(userDir, 'dist');

    // Link checker (runs before pagefind)
    if (!skipLinkCheck) {
      console.log('\nChecking for broken links...');
      const broken = checkLinks(outDir);
      if (broken.length > 0) {
        console.error(`\nFound ${broken.length} broken internal link(s):\n`);
        for (const { source, href } of broken) {
          console.error(`  ${source}`);
          console.error(`    -> ${href}\n`);
        }
        console.error('Fix the broken links or run with --no-link-check to skip.');
        process.exit(1);
      }
      console.log('No broken links found.');
    }

    // Pagefind search index
    const pagefindBin = path.join(packageRoot, 'node_modules', '.bin', 'pagefind');

    console.log('\nBuilding search index...');

    const pf = spawn(pagefindBin, ['--site', outDir], {
      stdio: 'inherit',
      env: process.env,
    });

    pf.on('close', (pfCode) => {
      process.exit(pfCode ?? 0);
    });
  });
}
