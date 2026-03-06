---
name: Navigation
order: 3
icon: menu-03
---


Echox builds navigation from your folder structure and `_meta.json` files.

## Structure

- **Tabs**: Top-level folders (e.g. `guides/`, `features/`)
- **Groups**: Subfolders (e.g. `getting_started/`, `config_customization/`)
- **Pages**: Markdown files (e.g. `introduction.md`)

Path `guides/getting_started/introduction.md` becomes tab **Guides** → group **Getting Started** → page **Introduction**.

## _meta.json

Use `_meta.json` in any folder to control display:

```json
{ "name": "Getting Started", "order": 1 }
```

- `name`: Display name (default: humanized folder name)
- `order`: Sort order (lower first)

## Sidebar

The sidebar shows the current tab's groups and pages. Nested groups are supported (e.g. `guides/getting_started/advanced/`). Active page is highlighted.

## Breadcrumbs

Breadcrumbs show the path from tab → group(s) → current page. They appear above the page title.

## Table of Contents

Each page gets an auto-generated table of contents from H2 and H3 headings. It appears in the right sidebar (or below the content on narrow screens). Click a heading to jump to that section. The current section is highlighted as you scroll.

## Prev/Next

At the bottom of each page, links to the previous and next pages (within the same tab) appear. They help users move through the docs in reading order.
