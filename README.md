<p align="center">
  <img src="https://img.shields.io/badge/Echox-docs%20builder-7c3aed?style=for-the-badge" alt="Echox" />
</p>

<h1 align="center">Echox</h1>
<p align="center">
  <strong>Static documentation sites from Markdown, OpenAPI, and tasks.</strong>
</p>
<p align="center">
  Powered by Astro · Zero config for your content · Dark mode · Full-text search
</p>

---

**Echox** turns a folder of Markdown files into a polished documentation site. Add a `config.json`, run `echox dev`, and you get tabs, sidebar navigation, search, optional OpenAPI docs, and file-based task boards—without touching the framework source. Perfect for product docs, API references, and internal wikis.

## Features

| | |
|---|---|
| **Folder-based routing** | Your `content/` structure becomes the site. No routing config. |
| **Static by default** | HTML + CSS. No runtime JS unless you add it. |
| **OpenAPI** | Drop `.json` specs into `apis/`; each file becomes a tab with generated endpoint docs. |
| **Tasks** | Add `tasks.yml` per tab for Todo / In progress / Done views. |
| **Search** | Pagefind index built at build time. Cmd+K / Ctrl+K in the UI. |
| **Theming** | One `color` in config; 22 Tailwind palettes. Dark mode with system detection. |
| **Callouts, cards, accordions** | GitHub-style alerts and custom directives in Markdown. |
| **Syntax highlighting** | Shiki, copy button, line highlight, diff view, Mermaid diagrams. |

## Quick start

**1. Scaffold a new project**

```bash
npx echox init
# or: echox init --name "My Docs"
```

This creates `content/`, `assets/`, `config.json`, a sample OpenAPI spec in `apis/`, and a `tasks.yml` example.

**2. Run the dev server**

```bash
echox dev
```

**3. Build for production**

```bash
echox build
```

Output goes to `dist/`. Use `echox preview` to serve it locally.

## Install

**From npm (npmjs.com)**

```bash
npm install -g @sonmezerekrem/echox
```

After install, run `echox` from any directory that has a docs project (see [Project structure](#project-structure)).

**From GitHub (clone and link)**

```bash
git clone https://github.com/sonmezerekrem/echox.git
cd echox
npm install
npm link
```

**From GitHub Packages** (scoped): set `@sonmezerekrem:registry=https://npm.pkg.github.com` in `~/.npmrc` and `npm login --registry=https://npm.pkg.github.com` with a token that has `read:packages`. Then `npm install -g @sonmezerekrem/echox`.

## Project structure

Your docs repo stays minimal:

```
my-docs/
├── content/              # Markdown only
│   └── guides/
│       └── getting_started/
│           └── introduction.md
├── apis/                 # Optional OpenAPI 3.x JSON (one file = one tab)
│   └── sample_api.json
├── assets/               # Images, favicon, logo (served at /)
└── config.json          # Site name, theme color, logo, links, footer
```

- **Tabs** = top-level folders under `content/` (e.g. `guides`, `api_reference`).
- **Groups** = second-level folders (e.g. `getting_started`).
- **Pages** = `.md` files. Use frontmatter for title, order, icon, status badge.

Add `_meta.json` in any tab or group folder to set display name and sort order. Add `tasks.yml` in a tab folder to get Todo / In progress / Done pages for that tab.

## Configuration

Minimal `config.json`:

```json
{
  "name": "My Docs",
  "color": "blue"
}
```

Optional: `description`, `logo`, `favicon`, `github`, `links`, `footer`. Valid `color` values: any Tailwind-style name (e.g. `slate`, `emerald`, `violet`, `rose`). Use `echox logo <color>` to generate a logo and favicon from your project name.

## CLI commands

| Command | Description |
|--------|--------------|
| `echox init` | Scaffold `content/`, `config.json`, `apis/`, `assets/`, and sample tasks |
| `echox dev` | Start dev server with hot reload |
| `echox build` | Build static site to `dist/` (runs link check + Pagefind) |
| `echox build --no-link-check` | Build without broken-link check |
| `echox preview` | Serve the built `dist/` locally |
| `echox logo <color>` | Generate `logo.svg` and `favicon.svg` in `assets/` and set paths in config |

## Documentation

- **[Full docs](https://github.com/sonmezerekrem/echox/tree/main/example)** — The `example/` folder in this repo is a full Echox site; use it as reference.
- **[Agent skill](.cursor/skills/echox/SKILL.md)** — Copy-paste rules for AI tools to write Echox-compliant Markdown.
- **[AGENTS.md](./AGENTS.md)** — For AI coding agents working on the Echox codebase.

## Contributing

Contributions are welcome. Open an issue or a pull request. If you change behavior or add options, consider updating the `example/` content and the skill docs so they stay in sync.

## License

GNU GPL v3. You may use, modify, and distribute this software under the terms of the [GNU General Public License version 3](https://www.gnu.org/licenses/gpl-3.0.html). If you distribute it, you must provide the source and preserve the same license. See [LICENSE](./LICENSE) for the full text.
