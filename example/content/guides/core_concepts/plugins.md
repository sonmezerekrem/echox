---
name: Plugins
order: 4
icon: plug-02
status: beta
---

## Plugin System

EchoDocs supports remark and rehype plugins to extend the markdown processing pipeline. Drop plugin files into the `plugins/` directory and they are loaded automatically.

## Adding a Plugin

1. Create a `plugins/` directory in your docs project root
2. Add a `.mjs` file with the appropriate prefix:
   - `remark-*.mjs` for remark plugins (process markdown AST)
   - `rehype-*.mjs` for rehype plugins (process HTML AST)

```
my-docs/
├── content/
├── plugins/
│   ├── remark-custom-alerts.mjs
│   └── rehype-image-size.mjs
└── config.json
```

## Example: Custom Alerts Plugin

Create `plugins/remark-custom-alerts.mjs`:

```javascript
export default function remarkCustomAlerts() {
  return (tree) => {
    // Transform blockquotes starting with [!NOTE] into styled alerts
    // ... plugin logic
  };
}
```

## Using npm Plugins

You can also use plugins from npm. Install them in your docs project, then create a wrapper:

```javascript
// plugins/remark-math.mjs
import remarkMath from 'remark-math';
export default remarkMath;
```

> Plugins are loaded in alphabetical order. Prefix with numbers to control order: `01-remark-first.mjs`, `02-remark-second.mjs`.
