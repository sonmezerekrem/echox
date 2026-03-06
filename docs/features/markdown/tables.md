---
name: Tables & GFM
order: 9
icon: table-01
---

Echox uses [GitHub Flavored Markdown (GFM)](https://github.github.com/gfm/) via remark-gfm. You get tables, strikethrough, task lists, and autolinks without extra config.

## Tables

```markdown
| Column A | Column B | Column C |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

Alignment is optional. Use `:---` for left, `:---:` for center, `---:` for right.

## Strikethrough

```markdown
~~deleted text~~
```

## Task Lists

```markdown
- [x] Completed task
- [ ] Pending task
```

## Autolinks

URLs like `https://example.com` and `user@example.com` are automatically linked.
