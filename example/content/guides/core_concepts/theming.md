---
name: Theming
order: 2
icon: paint-board
---

## Color Configuration

Set your site's accent color in `config.json` using any Tailwind CSS color name:

```json
{
  "name": "My Project",
  "color": "blue"
}
```

The color applies to active tabs, sidebar highlights, links, blockquote borders, and buttons throughout the site.

## Available Colors

All 22 Tailwind color palettes are supported:

| Neutrals | Warm | Cool | Vibrant |
|----------|------|------|---------|
| slate | red | sky | violet |
| gray | orange | blue | purple |
| zinc | amber | indigo | fuchsia |
| neutral | yellow | cyan | pink |
| stone | lime | teal | rose |
|  | green | emerald |  |

Each color uses the full shade range (50–950) for light and dark mode variants.

## Dark Mode

Dark mode is built-in and automatic. Users can toggle it with the theme button in the header. The preference is saved to `localStorage` and persists across visits.

The initial theme respects the user's system preference via `prefers-color-scheme`.

## CSS Variables

The following CSS variables are available for custom components:

```css
var(--color-primary)        /* Main accent color */
var(--color-primary-bg)     /* Light background tint */
var(--color-primary-hover)  /* Hover state */
var(--color-primary-50)     /* Shade 50 */
var(--color-primary-100)    /* Shade 100 */
/* ... through ... */
var(--color-primary-950)    /* Shade 950 */
```
