# AGENTS.md

README for AI coding agents working on Echox. See [agents.md](https://agents.md/) for the format.

## Project overview

Echox is an npm CLI that builds static documentation sites from markdown. It wraps Astro 5. End users only need `content/`, `assets/`, and `config.json`; the package source lives in `bin/` and `src/`. All path resolution uses `process.env.ECHOX_DIR` (user's docs directory); the CLI sets it and spawns Astro with `--root` pointing at the package.

## Setup commands

- Install deps: `npm install`
- Dev server (example project): `npm run dev` (uses `ECHOX_DIR=./example`)
- Build example: `npm run build` (builds `example/` to `example/dist`, then runs link check and Pagefind)
- Preview built site: `npm run preview`

Run these from the package root (where `package.json` and `src/` are).

## Code style

- ES modules only (`type: "module"` in package.json)
- CLI: `bin/echox.mjs` is plain JavaScript (no TypeScript)
- Astro: `.astro` single-file components; no React/Vue/Svelte
- Utils: `src/utils/*.ts` are TypeScript
- Client scripts in components: use `is:inline` to avoid Vite bundling
- Styles: all in `src/styles/global.css`; theme uses CSS custom properties and `colors.ts` for `--color-primary`, etc.

## Repository layout

```
echox/
├── bin/echox.mjs              # CLI (dev, build, preview, init, logo)
├── src/
│   ├── content.config.ts      # Content collection (ECHOX_DIR/content)
│   ├── layouts/DocsLayout.astro
│   ├── pages/                 # index, [...slug], api/[...path], 404, llms.txt
│   ├── components/            # Sidebar, TOC, Header, Footer, SearchBar, etc.
│   ├── styles/global.css      # All styles
│   ├── plugins/remark-components.mjs  # Callouts, accordions, cards
│   └── utils/                 # config.ts, navigation.ts, colors.ts, openapi.ts
├── example/                   # Example docs project (content/, assets/, config.json)
├── astro.config.mjs           # Dynamic config, uses ECHOX_DIR
└── package.json
```

## Key architecture

- **ECHOX_DIR**: User docs root. CLI sets it; Astro and `src/utils` read from it for content, assets, config, apis.
- **Navigation**: `content/{tab}/{group}/{page}.md` → three-level nav; OpenAPI in `apis/` merged as tabs. `_meta.json` in folders: `{ "order", "name" }`. See `src/utils/navigation.ts`, `buildFullNavTree()`.
- **Theming**: `colors.ts` → `getColorVars()` injects CSS vars; dark mode `[data-theme='dark']`, key `echox-theme`.
- **Build**: `echox build` → Astro build → link checker → Pagefind index.

## Common modifications

- **New config field**: Add to `SiteConfig` in `src/utils/config.ts`, validate in `validateConfig()` there and in `bin/echox.mjs`, then use in layout/components.
- **New component**: Add `src/components/MyComponent.astro`, use in `DocsLayout.astro` or target page, add styles in `src/styles/global.css`.
- **New page type**: New catch-all in `src/pages/`, `getStaticPaths()`, render inside `DocsLayout`.
- **Styles**: Edit `src/styles/global.css` only; theme variables come from `colors.ts`.

## Testing / validation

- No test suite in repo. After changes: run `npm run build` to ensure the example project builds and the link checker passes.
- Config validation runs at CLI start (for init/logo/dev/build) via `validateConfig()` in `bin/echox.mjs`; keep it in sync with `src/utils/config.ts`.
