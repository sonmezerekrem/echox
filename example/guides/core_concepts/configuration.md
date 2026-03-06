---
name: Configuration
order: 3
icon: settings-02
---

## config.json

All site configuration lives in a single `config.json` file at the root of your docs project.

### Minimal Config

```json title="config.json"
{
  "name": "My Project"
}
```

### Full Config

```json title="config.json" {3-4}
{
  "name": "My Project",
  "description": "Documentation for My Project",
  "color": "blue",
  "github": "https://github.com/example/my-project",
  "links": [
    { "label": "Examples", "url": "https://example.com", "external": true },
    { "label": "Feedback", "url": "https://feedback.example.com", "type": "button" }
  ]
}
```

Lines 3-4 are highlighted to show the optional fields that enable theming and SEO.

### Updating Your Config

When adding a footer to an existing config:

```json
{
  "name": "My Project",
  "color": "blue",
  "footer": { // [!code ++]
    "message": "Built with Echox" // [!code ++]
  } // [!code ++]
}
```

## Fields Reference

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | string | Yes | — | Site name shown in header |
| `description` | string | No | — | Meta description for SEO |
| `color` | string | No | `"blue"` | Tailwind color name for accent |
| `github` | string | No | — | GitHub repo URL (shows icon in header) |
| `links` | array | No | `[]` | Header navigation links |

## Link Objects

Each entry in the `links` array supports:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `label` | string | — | Link text |
| `url` | string | — | URL to navigate to |
| `external` | boolean | `false` | Opens in new tab with external icon |
| `type` | string | `"link"` | Set to `"button"` for a styled button |
