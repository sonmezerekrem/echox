---
name: Project Structure
order: 3
icon: folder-01
---

## Directory Layout

Your Echox project uses a simple folder structure:

```
my-docs/
├── config.json       # Site configuration
├── assets/           # Static files (images, favicon, logo)
├── guides/           # Tab: content organized by tab/group/page
│   ├── _meta.json    # Tab metadata (name, order)
│   └── getting_started/
│       ├── _meta.json
│       └── introduction.md
├── features/
│   └── ...
└── apis/             # Optional: OpenAPI specs
```

## Content Organization

Content follows the pattern: **tab / group / page.md**

- **Tab** — Top-level navigation (e.g. Guides, Features)
- **Group** — Sidebar section (e.g. Getting Started, Config & Customization)
- **Page** — Individual markdown file

Use `_meta.json` in folders to customize names and order:

```json
{ "name": "Getting Started", "order": 1 }
```

## Required Files

- **config.json** — Site name, logo, colors, footer, etc.
- **assets/** — Place `logo.svg`, `favicon.svg`, and other static assets here
