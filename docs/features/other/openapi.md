---
name: OpenAPI
order: 4
icon: code-02
---

# OpenAPI Integration

Echox can merge OpenAPI specs into your navigation as API tabs.

## Setup

Place OpenAPI JSON or YAML files in the `apis/` folder:

```
my-docs/
├── apis/
│   ├── v1.json
│   └── v2.yaml
├── guides/
└── config.json
```

## Behavior

- Each spec becomes a tab (e.g. **API v1**)
- Endpoints are grouped and linked
- API docs are rendered from the spec structure
- Merged with your regular docs in the tab navigation

## Spec Format

Standard OpenAPI 3.x (JSON or YAML) is supported. Paths, operations, and schemas are parsed for documentation generation.
