---
name: Introduction
order: 1
icon: home-04
---

## What is Echox?

Echox is a static documentation site builder powered by Astro. It turns your markdown files into a beautiful, fast documentation website with zero configuration overhead.

Write your content in markdown, organize it into folders, and Echox handles the rest — navigation, theming, syntax highlighting, and static rendering.

## Key Features

::::card-group
:::card{title="Folder-based Routing" href="/guides/config_customization/configuration" icon="route-01"}
Your directory structure becomes your site navigation automatically.
:::
:::card{title="Static Rendering" href="/guides/config_customization/theming" icon="zap"}
No JavaScript in the browser, just fast HTML and CSS.
:::
:::card{title="Dark Mode" icon="moon-02"}
Built-in light and dark theme support with system preference detection.
:::
:::card{title="Plugin System" href="/guides/config_customization/plugins" icon="plug-02"}
Extend the markdown pipeline with remark and rehype plugins.
:::
::::

> [!TIP]
> Echox supports all Tailwind color palettes. Set `"color": "emerald"` in your `config.json` to change the entire theme.

## Quick Start

A minimal docs project looks like this:

```
my-docs/
├── guides/
│   └── getting_started/
│       └── introduction.md
├── assets/
└── config.json
```

Your `config.json` only needs a name:

```json
{
  "name": "My Project"
}
```

Then run:

```bash
echox dev
```

That's it. Your documentation site is live.
