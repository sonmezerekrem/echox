---
name: echox
description: Build and manage documentation sites with Echox. Use when creating docs projects, writing markdown content, configuring config.json, setting up folder structure, adding OpenAPI specs, or running echox CLI commands.
---

# Echox

Echox is a static documentation site builder powered by Astro. Markdown files in `content/` become a themed site with tabs, sidebar, search, and optional OpenAPI tabs.

## When to Use

- Use this skill when creating or editing documentation for an Echox site
- Use when writing markdown that will be built with Echox (content, config.json, assets)
- Use when configuring config.json, adding pages, or setting up navigation and _meta.json
- Use when you need Echox conventions: frontmatter, absolute links, callouts, cards, accordions, code blocks
- Use when running echox CLI (init, dev, build, preview, logo)

## Instructions

### Project layout

- **Pages** must be exactly three levels deep: `content/{tab}/{group}/{page}.md` (e.g. `content/guides/getting_started/introduction.md`).
- **Tab** = first folder (e.g. `guides`, `api_reference`). **Group** = second folder (e.g. `getting_started`). **Page** = `.md` file.
- Use lowercase with underscores for folders and filenames; they are shown as title-case (e.g. `getting_started` → "Getting Started").
- Optional: add `_meta.json` in any tab or group folder: `{ "order": 1, "name": "Display Name" }` to control order and display name.

### Frontmatter (every .md page)

Use YAML between `---` lines. All fields optional.

- `name`: Page title (default: filename humanized)
- `order`: Number for sidebar order (default: alphabetical)
- `icon`: Hugeicons stroke-rounded name, lowercase hyphenated (e.g. `home-04`, `file-01`, `settings-02`)
- `status`: `new` | `beta` | `deprecated` | `draft` (colored badge)

### Links and assets

- **Internal links**: always absolute paths from site root, e.g. `[Setup](/guides/getting_started/setup)`. No relative paths (`../`, `./`).
- **Images**: files in `assets/` are served at root. Use `![Alt](/image.png)`.

### Content components

- **Callouts**: `> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`, `> [!DANGER]` (GitHub-style blockquotes).
- **Accordions**: `:::accordion{title="Click to expand"}` … `:::`.
- **Cards**: `:::card{title="Title" href="/path" icon="icon-name"}` Description `:::`; optional `::::card-group` for a grid. Omit `href` for non-clickable cards. Icons: [Hugeicons](https://hugeicons.com/) stroke-rounded names.

### Code blocks

- Filename: ` ```ts title="config.ts" `
- Line highlighting: ` ```js {1,3-5} `
- Diff: `// [!code ++]` and `// [!code --]` (stripped in output, lines styled).
- Use language tags (js, ts, json, bash, mermaid, etc.) for syntax highlighting.

### CLI

Run from the directory that contains `content/`, `config.json`, and optionally `assets/`, `apis/`:

```bash
echox init                    # Scaffold project (prompts for name)
echox init --name "My Docs"    # Scaffold with name
echox dev                      # Dev server with hot reload
echox build                    # Build to ./dist (includes link check)
echox build --no-link-check    # Build without link check
echox preview                  # Preview built site
echox logo <color>             # Generate logo + favicon (letter from config name; color e.g. blue, lime)
```

### config.json

- Required: `"name": "My Docs"`.
- Optional: `description`, `logo`, `favicon`, `color` (Tailwind name), `github`, `links`, `footer`.
- Valid colors: `slate`, `gray`, `zinc`, `neutral`, `stone`, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`.

### OpenAPI

Place OpenAPI 3.x JSON files in `apis/`. Each file becomes a tab; tags → groups, operations → pages.

## Additional resources

- For a **copy-paste prompt** to give to other AI tools (ChatGPT, Claude, etc.) so they write Echox-compliant docs, see [references/docs-rules.md](references/docs-rules.md).
- For **full reference** (config schema, status badges, code block options, features list), see [references/full-reference.md](references/full-reference.md).
