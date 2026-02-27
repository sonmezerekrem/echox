# Echox - Agent Guide

This file helps AI agents understand the Echox codebase and how to work with it effectively.

## What is Echox

Echox is an npm CLI tool that builds static documentation websites from markdown files. It wraps Astro 5 and is designed so end users only need `content/`, `assets/`, and `config.json` — no source code.

## Repository Layout

```
echox/
├── bin/echox.mjs          # CLI entry point (dev, build, preview, init)
├── src/
│   ├── content.config.ts     # Astro content collection (reads from ECHOX_DIR/content)
│   ├── layouts/
│   │   └── DocsLayout.astro  # Main layout (header, sidebar, content, TOC, footer)
│   ├── pages/
│   │   ├── index.astro       # Redirects to first page
│   │   ├── [...slug].astro   # Catch-all for markdown pages
│   │   ├── api/[...path].astro  # Catch-all for OpenAPI endpoints
│   │   ├── 404.astro         # Custom error page
│   │   ├── llms.txt.ts       # /llms.txt endpoint
│   │   └── llms-full.txt.ts  # /llms-full.txt endpoint
│   ├── components/
│   │   ├── TabNav.astro      # Top-level tab navigation
│   │   ├── Sidebar.astro     # Sidebar with groups and pages
│   │   ├── TableOfContents.astro  # TOC with scroll spy
│   │   ├── Breadcrumb.astro
│   │   ├── SearchBar.astro   # Pagefind search modal
│   │   ├── HeaderActions.astro  # Header links, GitHub, theme toggle
│   │   ├── Footer.astro
│   │   └── EndpointView.astro   # OpenAPI endpoint renderer
│   ├── styles/
│   │   └── global.css        # All styles (theming, layout, dark mode)
│   ├── plugins/
│   │   └── remark-components.mjs  # Built-in remark plugin (callouts, accordions, cards)
│   └── utils/
│       ├── config.ts         # Loads and validates config.json
│       ├── navigation.ts     # Builds nav tree from content entries
│       ├── colors.ts         # Tailwind color palettes + CSS variable generator
│       └── openapi.ts        # Parses OpenAPI specs into nav tabs + endpoints
├── example/                  # Example docs project for testing
│   ├── content/
│   ├── assets/
│   ├── apis/
│   └── config.json
├── astro.config.mjs          # Dynamic Astro config (reads ECHOX_DIR env var)
├── package.json
├── Dockerfile
└── docker-compose.yml
```

## Key Architecture Decisions

### Environment Variable: ECHOX_DIR

All path resolution goes through `process.env.ECHOX_DIR`. The CLI sets this to the user's CWD, then spawns Astro with `--root` pointing at the package directory. This lets the bundled Astro project read content from any directory.

### Navigation Tree

The nav tree is built from the content collection entries:

- `content/{tab}/{group}/{page}.md` → three-level hierarchy
- OpenAPI specs in `apis/` are merged as additional tabs
- `buildFullNavTree()` in `navigation.ts` returns the merged tree
- Folders can contain `_meta.json` with `{ "order": number, "name": string }` to control sort order and display name (both optional, loaded by `loadMeta()` in `navigation.ts`)

### Theming

Colors are injected as CSS custom properties via a `<style>` tag in `<head>`. The `getColorVars()` function in `colors.ts` maps a Tailwind color name to `--color-primary`, `--color-primary-bg`, etc. Dark mode uses `[data-theme='dark']` selector and localStorage key `echox-theme`.

### Build Pipeline

```
echox build
  → astro build (generates HTML to dist/)
  → link checker (scans dist/ for broken internal hrefs)
  → pagefind (builds search index in dist/pagefind/)
```

## Development Workflow

```bash
npm run dev      # Runs with ECHOX_DIR=./example
npm run build    # Builds example project
npm run preview  # Previews built example
```

## Common Modifications

### Adding a new config field

1. Add the field to `SiteConfig` interface in `src/utils/config.ts`
2. Add validation logic in the `validateConfig` function in `src/utils/config.ts`
3. Add the same validation in `bin/echox.mjs` (CLI-level early validation)
4. Use the field in the relevant component or layout

### Adding a new component

1. Create `src/components/MyComponent.astro`
2. Import and use it in `DocsLayout.astro` or the relevant page
3. Add styles to `src/styles/global.css`

### Adding a new page type

1. Create a new catch-all route in `src/pages/`
2. Use `getStaticPaths()` for static generation
3. Render inside `DocsLayout` to get the full navigation chrome

### Modifying styles

All styles live in `src/styles/global.css`. The file uses CSS custom properties defined in `:root` / `[data-theme='dark']` selectors. Dynamic color variables are injected via `colors.ts`.

## Code Conventions

- All source uses ES modules (`type: "module"` in package.json)
- The CLI file (`bin/echox.mjs`) uses plain JavaScript (no TypeScript)
- Astro components use `.astro` single-file format
- Utility files in `src/utils/` are TypeScript
- Client-side scripts in components use `is:inline` to avoid Vite bundling
- No React/Vue/Svelte — pure Astro components only
