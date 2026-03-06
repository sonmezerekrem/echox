---
name: Migration Guide
order: 2
icon: arrow-right-01
---

## Migrating to Echox

This guide helps you migrate from other documentation tools to Echox.

### From Docusaurus / MkDocs

1. Export your markdown content into a flat or nested folder structure.
2. Run `echox init` in an empty directory to get the default layout.
3. Copy your content into `content/{tab}/{group}/` (and subfolders as needed).
4. Add `_meta.json` in each folder for display names and order.
5. Run `echox build` and fix any broken links.

### From GitBook

GitBook content is often in a `SUMMARY.md` that defines the structure. Map each entry to a path under `content/` and create the corresponding `_meta.json` files.

### From custom static site

If you already have markdown files:

- Place them under `content/` with the desired URL structure.
- Use frontmatter `name` and `order` on pages.
- Use `_meta.json` in folders for `name` and `order`.

Then run `echox build` to generate the site.
