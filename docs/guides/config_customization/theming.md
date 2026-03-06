---
name: Theming
order: 2
icon: colors
---

## Light & Dark Mode

Echox supports light and dark themes. Users can toggle via the header, and the preference is stored in `localStorage` under the key `echox-theme`.

If no preference is set, the theme follows `prefers-color-scheme`.

## Color Customization

Set the primary color in `config.json`:

```json
{
  "color": "emerald"
}
```

All Tailwind color palettes are supported. This affects links, buttons, badges, and accent elements.

## CSS Variables

The theme injects CSS custom properties such as:

- `--color-primary` — Primary accent
- `--color-primary-bg` — Light background for primary
- `--color-bg`, `--color-border`, `--text-primary`, etc.

You can override these by adding custom CSS in a plugin or by extending the layout.
