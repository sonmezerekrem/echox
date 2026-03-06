---
name: Frontmatter & Parsing
order: 6
icon: document-code
---

Echox uses YAML frontmatter at the top of each markdown file to control page metadata. Content is validated with a Zod schema and parsed at build time.

## Frontmatter Fields

Each `.md` file can include these optional fields between `---` delimiters:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Page title (sidebar, breadcrumb, `<title>`) |
| `title` | string | Alias for `name` — both are merged; `name` takes precedence |
| `order` | number | Sort order within the group (lower = first) |
| `icon` | string | HugeIcons icon name (e.g. `file-01`, `home-04`) for sidebar |
| `status` | enum | `draft`, `beta`, `deprecated`, `new` — shown as badge |

### Example

```yaml
---
name: Getting Started
order: 1
icon: home-04
status: beta
---
```

## Parsing Behavior

1. **YAML parsing** — Frontmatter is parsed as YAML. Invalid YAML can cause build errors.

2. **Schema validation** — Astro's content collection validates with Zod:
   - `name` and `title` are optional strings
   - `order` is optional number
   - `icon` is optional string
   - `status` must be one of: `draft`, `beta`, `deprecated`, `new`

3. **Transform** — `name` is set from `title` when missing: `name: data.name ?? data.title`

4. **Fallback to H1** — When neither `name` nor `title` is set, the first H1 is used as the page title. See [H1 Attributes](/features/markdown/h1_attributes) for `{label="..."}` and `{status="..."}` parsing.

5. **Folder metadata** — Tab and group names/order come from `_meta.json` in each folder. See [Navigation](/features/other/navigation#_metajson).

## Content Collection

Echox uses Astro's glob loader to discover markdown files under your project root. Files in `assets/`, `apis/`, `dist/`, `node_modules/`, and `.git/` are ignored. Each file becomes a content entry with `id` = path without `.md` (e.g. `guides/getting_started/introduction`).

## Custom Status from H1

When using H1 as the page title, `{label="Implemented"}` or `{status="Experimental"}` adds a custom status badge. Values are normalized for CSS (e.g. "In Review" → `in-review`). These are not limited to the schema enum — any string works and gets a generic badge style.
