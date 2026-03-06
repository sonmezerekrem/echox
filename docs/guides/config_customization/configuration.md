---
name: Configuration
order: 1
icon: settings-01
---

## config.json

Echox reads `config.json` from your project root. All paths are relative to the docs directory.

## Basic Options

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Site name (required) |
| `description` | string | Meta description |
| `logo` | string | Logo URL (e.g. `/logo.svg`) |
| `favicon` | string | Favicon URL |
| `color` | string | Theme color (Tailwind palette: lime, emerald, blue, etc.) |
| `theme` | string | Theme variant (`default`) |
| `github` | string | GitHub repo URL |
| `links` | array | Header links |
| `footer` | object | Footer message and columns |

## Example

```json
{
  "name": "My Docs",
  "description": "Documentation for My Project",
  "logo": "/logo.svg",
  "favicon": "/favicon.svg",
  "color": "emerald",
  "github": "https://github.com/user/repo",
  "links": [
    { "label": "Get Started", "url": "/guides/getting_started/introduction", "type": "button" }
  ],
  "footer": {
    "message": "Built with Echox",
    "columns": [
      {
        "title": "Resources",
        "links": [
          { "label": "Docs", "url": "/guides/getting_started/introduction" }
        ]
      }
    ]
  }
}
```

## Color Palettes

Supported `color` values: `slate`, `gray`, `zinc`, `neutral`, `stone`, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`.
