---
name: H1 Attributes
order: 5
icon: type-cursor
---


When a page has no frontmatter `name` or `title`, Echox uses the first H1 as the page title. You can add attributes like `{label="Implemented"}` that are parsed and shown as status badges.

## Syntax

```markdown
# Page Title {label="Beta"}
# Feature Name {status="deprecated"}
# Another Page {label="In Review"}
```

- **label** – Displayed as a status badge (e.g. "Implemented", "Beta")
- **status** – Same as label, used for consistency

## Behavior

1. The attribute block is stripped from the displayed title
2. The value is normalized for CSS classes (spaces → hyphens, lowercase)
3. A badge appears next to the page title and in the sidebar
4. The first H1 is removed from the body (no duplication) when used as title

## Example

See the [H1 Attributes Demo](/guides/getting_started/h1_attributes_demo) page for a live example.
