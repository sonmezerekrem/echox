---
name: SDK Documentation
order: 2
icon: source-code
---

## SDK Docs Example

A documentation site for a JavaScript SDK with installation, usage, and API reference.

### Folder Structure

```
sdk-docs/
├── content/
│   ├── getting_started/
│   │   └── quickstart/
│   │       ├── installation.md
│   │       └── first_request.md
│   ├── usage/
│   │   ├── client/
│   │   │   ├── initialization.md
│   │   │   ├── error_handling.md
│   │   │   └── retries.md
│   │   └── advanced/
│   │       ├── streaming.md
│   │       └── batch_requests.md
│   └── reference/
│       └── methods/
│           ├── create.md
│           ├── get.md
│           ├── list.md
│           └── delete.md
└── config.json
```

### config.json

```json
{
  "name": "Acme SDK",
  "color": "violet",
  "github": "https://github.com/example/acme-sdk",
  "links": [
    { "label": "npm", "url": "https://npmjs.com/package/acme-sdk", "external": true },
    { "label": "Playground", "url": "https://play.example.com", "type": "button" }
  ]
}
```

This creates three tabs (Getting Started, Usage, Reference) with a violet theme and header links to npm and a playground.
