---
name: Table of Contents
order: 5
icon: left-to-right-list-bullet
---

Each doc page shows a **table of contents** (TOC) in the right sidebar, built from the page’s headings. By default only **h2** and **h3** are included.

## Customize with frontmatter

Use the optional `toc` field to choose which heading levels appear in the TOC:

| Depth | Heading |
|-------|---------|
| 1 | h1 |
| 2 | h2 |
| 3 | h3 |
| 4 | h4 |
| 5 | h5 |
| 6 | h6 |

`toc` is an array of depths (1–6). It overrides the default.

### Examples

**Default (no `toc`):** TOC shows h2 and h3 only.

**Include h1, h2, h3:**

```yaml
---
name: My Page
toc: [1, 2, 3]
---
```

**Only h2:**

```yaml
---
toc: [2]
---
```

**h2, h3, h4:**

```yaml
---
toc: [2, 3, 4]
---
```

## See also

- [Frontmatter](/features/markdown/frontmatter) — all frontmatter fields including `toc`
- [Navigation](/features/other/navigation) — sidebar and folder structure
