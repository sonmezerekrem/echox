---
name: echodocs
description: Build and manage documentation sites with EchoDocs. Use when creating docs projects, writing markdown content, configuring config.json, setting up folder structure, adding OpenAPI specs, or running echodocs CLI commands.
---

# EchoDocs

EchoDocs is a static documentation site builder powered by Astro. It turns markdown files into a themed, navigable documentation website with zero client-side JavaScript.

## CLI Commands

```bash
echodocs init                  # Scaffold a new project (prompts for name)
echodocs init --name "My Docs" # Scaffold with a specific name
echodocs dev                   # Start dev server with hot reload
echodocs build                 # Build static site to ./dist
echodocs build --no-link-check # Build without broken link detection
echodocs preview               # Preview the built site locally
```

Run commands from the directory containing `content/`, `assets/`, and `config.json`.

## Project Structure

```
my-docs/
├── content/                  # Markdown files (required)
│   ├── guides/               # Tab: "Guides"
│   │   ├── getting_started/  # Group: "Getting Started"
│   │   │   ├── intro.md      # Page: "Intro"
│   │   │   └── setup.md
│   │   └── advanced/         # Group: "Advanced"
│   │       └── plugins.md
│   └── api_reference/        # Tab: "Api Reference"
│       └── endpoints/
│           └── users.md
├── apis/                     # OpenAPI JSON specs (optional)
│   └── my_api.json           # Each file becomes a tab
├── assets/                   # Static files served at root (optional)
│   ├── logo.svg
│   └── favicon.svg
└── config.json               # Site configuration (required)
```

### Routing Rules

| Folder Level | Maps To | Example |
|---|---|---|
| 1st level in `content/` | Tab (top navigation) | `guides/` → "Guides" |
| 2nd level | Sidebar group | `getting_started/` → "Getting Started" |
| Markdown file | Page | `intro.md` → "Intro" |

Underscores in folder/file names become spaces and are title-cased: `getting_started` → "Getting Started".

Files must be nested 3 levels deep: `content/{tab}/{group}/{page}.md`. Files at fewer levels are ignored.

### Sorting with `_meta.json`

Place a `_meta.json` file inside any tab or group folder to control ordering and display name:

```json
{ "order": 1, "name": "Getting Started" }
```

Both fields are optional. `order` defaults to 0 (alphabetical fallback). `name` overrides the auto-humanized folder name.

```
content/
├── guides/
│   ├── _meta.json              # { "order": 1 }
│   ├── getting_started/
│   │   ├── _meta.json          # { "order": 1 }
│   │   └── intro.md
│   └── advanced/
│       ├── _meta.json          # { "order": 2 }
│       └── plugins.md
└── api_reference/
    ├── _meta.json              # { "order": 2, "name": "API Reference" }
    └── endpoints/
        └── users.md
```

Lower `order` values appear first. Folders with the same order are sorted alphabetically.

## Markdown Frontmatter

```yaml
---
name: Custom Page Title   # Display name (default: filename humanized)
order: 1                   # Sort position in sidebar (default: alphabetical)
icon: home-04              # Hugeicons icon name (default: file-01)
status: new                # Page status badge (optional)
---
```

All fields are optional. Icons use [Hugeicons](https://hugeicons.com/) stroke-rounded names (lowercase, hyphenated).

### Status Badges

The `status` field renders a colored pill badge next to the page title, in the sidebar, and in prev/next navigation. Valid values:

| Value | Color | Use for |
|---|---|---|
| `new` | Green | Recently added pages |
| `beta` | Amber | Experimental or preview content |
| `deprecated` | Red | Outdated content being phased out |
| `draft` | Gray | Work-in-progress, not yet finalized |

## config.json

Minimal required config:

```json
{
  "name": "My Docs"
}
```

Full config with all optional fields:

```json
{
  "name": "My Docs",
  "description": "Project documentation",
  "logo": "/logo.svg",
  "favicon": "/favicon.svg",
  "color": "blue",
  "github": "https://github.com/org/repo",
  "links": [
    { "label": "Blog", "url": "https://blog.example.com", "external": true },
    { "label": "Get Started", "url": "/guides/intro/welcome", "type": "button" }
  ],
  "footer": {
    "message": "Built with EchoDocs",
    "columns": [
      {
        "title": "Resources",
        "links": [
          { "label": "Docs", "url": "/guides/intro/welcome" },
          { "label": "GitHub", "url": "https://github.com/org/repo", "external": true }
        ]
      }
    ]
  }
}
```

### Config Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Site name shown in header |
| `description` | string | No | Meta description |
| `logo` | string | No | Path to logo image (in `assets/`) |
| `favicon` | string | No | Path to favicon (in `assets/`) |
| `color` | string | No | Tailwind color name for theming (default: `"blue"`) |
| `github` | string | No | GitHub URL (shows icon in header) |
| `links` | array | No | Header links/buttons |
| `footer` | object | No | Footer with `message` and `columns` |

### Valid Colors

`slate`, `gray`, `zinc`, `neutral`, `stone`, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`

## OpenAPI Support

Place OpenAPI 3.x JSON files in `apis/`. Each file becomes a tab with:
- Tags → sidebar groups
- Endpoints → pages with method badge, path, parameters, request body, responses

```
apis/
├── internal_api.json    # Tab: "Internal Api"
└── public_api.json      # Tab: "Public Api"
```

## Code Block Enhancements

### Copy Button

All code blocks automatically get a copy-to-clipboard button on hover. No configuration needed.

### Filename Header

Add `title="filename"` to the code fence to display a filename bar above the code:

````
```ts title="config.ts"
export const name = "EchoDocs";
```
````

### Line Highlighting

Highlight specific lines with `{line-numbers}` in the code fence:

````
```js {1,3-5}
const a = 1;   // highlighted
const b = 2;
const c = 3;   // highlighted
const d = 4;   // highlighted
const e = 5;   // highlighted
```
````

### Diff View

Use `// [!code ++]` and `// [!code --]` comments to mark added and removed lines:

````
```js
const old = "before"; // [!code --]
const updated = "after"; // [!code ++]
```
````

The diff comments are removed from the displayed output and lines are visually styled with green/red backgrounds.

## Content Components

### Callouts

Use GitHub-style alert syntax inside blockquotes. Four types are available:

```markdown
> [!NOTE]
> Informational callout for general notes.

> [!TIP]
> Helpful suggestion or best practice.

> [!WARNING]
> Something to be cautious about.

> [!DANGER]
> Critical warning -- destructive or irreversible action.
```

### Accordions

Collapsible sections using native `<details>` elements:

```markdown
:::accordion{title="Click to expand"}
Hidden content goes here. Supports **markdown** formatting.
:::
```

### Cards

Linked cards with an icon, title, and description:

```markdown
:::card{title="Getting Started" href="/guides/getting_started/introduction" icon="rocket-01"}
Learn how to set up your first documentation site.
:::
```

Group cards into a responsive grid with `card-group`:

```markdown
::::card-group
:::card{title="Installation" href="/guides/getting_started/installation" icon="download-04"}
Install EchoDocs globally or use npx.
:::
:::card{title="Configuration" href="/guides/core_concepts/configuration" icon="settings-02"}
Set up your config.json file.
:::
::::
```

Cards without `href` render as non-clickable boxes. The `icon` attribute uses Hugeicons names.

## Features

- **Dark mode**: automatic (system preference) + manual toggle
- **Full-text search**: Pagefind-powered, built at build time (Cmd+K / Ctrl+K)
- **Mermaid diagrams**: use ` ```mermaid ` code blocks in markdown
- **Syntax highlighting**: Shiki with dual light/dark themes, copy button, filename headers, line highlighting, and diff view
- **Status badges**: mark pages as `new`, `beta`, `deprecated`, or `draft` via frontmatter
- **Prev/Next navigation**: bottom-of-page links to adjacent pages within the current tab
- **Scroll spy**: TOC highlights current heading while scrolling
- **Progress bar**: animated loading bar on page navigation
- **Link checker**: build fails on broken internal links (skip with `--no-link-check`)
- **llms.txt**: auto-generates `/llms.txt` and `/llms-full.txt` at build time
- **Callouts**: `> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`, `> [!DANGER]` styled admonition blocks
- **Accordions**: collapsible `:::accordion{title="..."}` sections
- **Cards**: `:::card{...}` and `::::card-group` for linked cards in a grid
- **Custom 404**: themed error page at `/404.html`
- **GitHub Actions**: see `.github/workflows/build-docs.yml` for CI example

## Writing Content Tips

- Reference images as `![alt](/image.png)` (files in `assets/` are served at root)
- Use standard markdown: headings, lists, tables, code blocks, blockquotes
- h2 and h3 headings appear in the table of contents
- Mermaid diagrams re-render on theme toggle automatically
- Internal links use absolute paths: `[Setup](/guides/getting_started/setup)`
