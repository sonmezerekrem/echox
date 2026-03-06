---
name: Search
order: 2
icon: search-lg
---


Echox uses [Pagefind](https://pagefind.app/) for full-text search. It runs automatically after each build.

## How It Works

1. **Build**: `echox build` generates static HTML
2. **Index**: Pagefind scans the `dist/` folder and builds a search index
3. **UI**: The search bar in the header uses Pagefind's modular UI

## Indexed Content

Only pages with a `data-pagefind-body` element are indexed. Echox adds this to the main article content, so your documentation body is searchable. The sidebar, header, and footer are excluded.

## Customization

Pagefind outputs to `dist/pagefind/`. The search bar component loads the Pagefind UI from this path. For custom styling, override the Pagefind CSS variables or use your own search implementation.
