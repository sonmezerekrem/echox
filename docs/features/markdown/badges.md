---
name: Status Badges
order: 4
icon: badge-01
---

Status badges show the state of a page (draft, beta, deprecated, new). They appear next to the page title and in the sidebar.

## Frontmatter

Set `status` in your frontmatter:

```yaml
---
name: My Page
status: beta
---
```

Supported values: `draft`, `beta`, `deprecated`, `new`.

## H1 Attributes

When you don't use frontmatter `name`, you can add a label in the first heading:

```markdown
# My Feature {label="Implemented"}
```

The `{label="..."}` or `{status="..."}` is stripped from the display and shown as a badge. Values are normalized for CSS (e.g. "In Review" → `in-review`).

## Example

This page uses `status: beta` in frontmatter. The badge appears in the header and sidebar.
