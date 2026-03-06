---
name: Cards
order: 3
icon: layout-01
---

# Cards

Cards display content in a grid layout. Use `:::card` for individual cards and `:::card-group` to group them.

## Syntax

```markdown
::::card-group
:::card{title="Card Title" href="/path" icon="file-01"}
Description text for the card.
:::
:::card{title="Another Card" icon="bulb"}
Card without a link.
:::
::::
```

## Attributes

- **title** – Card heading
- **href** – Optional link URL (makes the card clickable)
- **icon** – HugeIcons icon name (e.g. `file-01`, `bulb`, `route-01`)

## Example

::::card-group
:::card{title="Getting Started" href="/guides/getting_started/introduction" icon="home-04"}
Start here to learn the basics.
:::
:::card{title="Configuration" href="/guides/config_customization/configuration" icon="settings-01"}
Customize your docs site.
:::
:::card{title="Theming" href="/guides/config_customization/theming" icon="palette"}
Change colors and appearance.
:::
::::
