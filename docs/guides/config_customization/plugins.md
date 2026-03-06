---
name: Plugins
order: 3
icon: plug-02
---

## Custom Plugins

Echox supports custom remark and rehype plugins. Place them in a `plugins/` directory in your docs root.

## Plugin Naming

- **Remark plugins:** `remark-*.mjs`
- **Rehype plugins:** `rehype-*.mjs`

They are loaded automatically and run in the markdown pipeline.

## Example

Create `plugins/remark-my-plugin.mjs`:

```javascript
export default function remarkMyPlugin() {
  return (tree) => {
    // Transform the AST
    return tree;
  };
}
```

The plugin receives the markdown AST (mdast) and can modify it before rendering.

## Built-in Plugins

Echox includes:

- **remark-directive** — For `:::card`, `:::accordion`, etc.
- **remark-components** — Callouts, accordions, cards
- **remark-strip-h1-when-used-as-title** — Removes duplicate H1 when used as page title
