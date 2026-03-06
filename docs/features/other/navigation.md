---
name: Navigation
order: 3
icon: menu-03
---

# Navigation

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
