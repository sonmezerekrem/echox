---
name: Icons
order: 10
icon: paint-brush-01
---

Echox uses [HugeIcons](https://hugeicons.com/) (stroke-rounded style) for sidebar page icons, card icons, and callout icons. Icon names are passed as strings and rendered via the `hgi-{name}` CSS class.

## Where Icons Appear

| Location | How to set |
|----------|------------|
| **Sidebar** | `icon` in page frontmatter |
| **Cards** | `icon` attribute in `:::card{icon="..."}` |
| **Callouts** | Built-in per type (Note, Tip, Warning, Danger) — not configurable |

## Frontmatter

```yaml
---
name: My Page
icon: file-01
---
```

The icon appears next to the page title in the sidebar. Omit `icon` to use the default (`file-01`).

## Cards

```markdown
:::card{title="Get Started" href="/intro" icon="home-04"}
Start here.
:::
```

See [Cards](/features/markdown/cards) for full syntax.

## Finding Valid Icon Names

Echox uses the **stroke-rounded** set from HugeIcons. Not every icon name exists in this set.

1. Go to [hugeicons.com](https://hugeicons.com/icons/stroke-rounded)
2. Browse or search for an icon
3. Use the **stroke-rounded** variant
4. The class name is `hgi-{name}` — in Echox you use just the `{name}` part (e.g. `file-01`, `information-circle`, `chart-relationship`)

### Naming Conventions

- **Kebab-case**: `information-circle`, `arrow-down-01`
- **Numbered variants**: Many icons have `-01`, `-02` suffixes (e.g. `file-01`, `menu-03`)
- **No `hgi-` prefix**: Omit the `hgi-` prefix; Echox adds it automatically

### Examples of Valid Icons

| Use case | Icon name |
|----------|-----------|
| File / doc | `file-01`, `document-code` |
| Home / start | `home-04` |
| Code | `code` |
| Search | `search-01` |
| Menu / nav | `menu-03` |
| Info / note | `information-circle` |
| Chart / diagram | `chart-relationship` |
| Badge / status | `checkmark-badge-01` |
| Colors / theme | `colors` |
| Table | `table-01` |
| List | `left-to-right-list-bullet` |

If an icon does not appear, the name may not exist in stroke-rounded. Try a similar icon from the HugeIcons library.
