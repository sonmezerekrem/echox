---
name: Task Management
order: 1
icon: left-to-right-list-bullet
---


Echox includes built-in task management for tracking work items (features, bugs, chores) directly in your documentation.

## Overview

Add a `tasks.yml` file in any tab folder (e.g. `my_tab/tasks.yml`) to define tasks. Echox automatically adds **Todo**, **In progress**, and **Done** pages under that tab, filtering tasks by status.

## Task Schema

Each task supports:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `name` | string | Task title |
| `type` | string | e.g. feature, bug, chore |
| `status` | string | Todo, In progress, Done |
| `description` | string | Longer description |
| `labels` | string[] | Tags |
| `steps` | string[] | Ordered steps |
| `acceptanceCriteria` | string[] | Checklist |
| `dependencies` | string[] | Task IDs this depends on |
| `relations` | array | Links to docs or URLs |
| `createdAt` | string | ISO date |
| `updatedAt` | string | ISO date |

## Example

```yaml
# my_tab/tasks.yml
- id: TASK-001
  name: Add dark mode
  type: feature
  status: Done
  description: Implement theme toggle
  labels: [ux, theming]
  relations:
    - label: Theming guide
      url: /guides/config_customization/theming
```

## Task Cards

Tasks are rendered as cards with status badges, dependency links, and expandable sections for steps and acceptance criteria. Use the copy button to export task details.
