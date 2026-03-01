---
name: Overview
order: 1
icon: checklist
---

## What are tasks?

Task Management lets you maintain a list of tasks (e.g. tickets, chores, features) per tab and display them as **Todo**, **In progress**, and **Done** list pages. Each task can have steps, acceptance criteria, dependencies, and links to docs.

## Where to put tasks

Add a `tasks.yml` file **inside a tab folder** under `content/`:

```
content/
├── guides/
│   └── ...
└── task_management/
    ├── tasks.yml          ← Tasks for this tab
    └── usage/
        └── overview.md
```

If `content/task_management/tasks.yml` exists, Echox will generate three list pages for that tab:

- **Todo** — tasks with `status: todo`
- **In progress** — tasks with `status: in-progress`
- **Done** — tasks with `status: done`

You can open them from the sidebar under the Task Management tab, or by visiting `/task_management/tasks/todo`, `/task_management/tasks/in-progress`, and `/task_management/tasks/done`.

## Writing tasks.yml

Each task is an object with required and optional fields.

### Required

| Field     | Type   | Description                    |
|----------|--------|--------------------------------|
| `id`     | string | Unique ID (e.g. `ECX-1`, `TASK-42`) |
| `name`   | string | Short title                    |
| `status` | string | One of: `todo`, `in-progress`, `done` |

### Optional

| Field                | Type     | Description                                      |
|---------------------|----------|--------------------------------------------------|
| `description`       | string   | Longer description                               |
| `type`              | string   | e.g. `feature`, `chore`, `docs`, `improvement`   |
| `labels`            | string[] | Tags for filtering or display                    |
| `steps`             | string[] | Ordered list of steps                            |
| `acceptance_criteria` | string[] | Checklist for “done”                             |
| `relations`         | array    | Links to doc paths or `{ label, url }` (internal or external) |
| `dependencies`      | string[] | Task IDs this task depends on                    |
| `created_at`       | string   | ISO date (e.g. `2025-12-01T10:00:00Z`)           |
| `updated_at`       | string   | ISO date                                        |

### Relations

Link tasks to docs or external URLs:

```yaml
relations:
  - guides/getting_started/installation    # Internal doc path
  - label: GitHub
    url: https://github.com/example/repo
    external: true
```

Internal paths are relative to the site root (no leading slash). External URLs open in a new tab when `external: true`.

### Dependencies

List task IDs that must be completed first. Dependency pills on the task card link to the corresponding task on the same tab’s task pages (e.g. Todo / In progress / Done).

```yaml
dependencies:
  - ECX-1
  - ECX-2
```

## Example tasks.yml

Below is a full example. This tab’s **Todo**, **In progress**, and **Done** pages are generated from the `tasks.yml` file in this tab’s folder.

```yaml
tasks:
  - id: ECX-1
    name: Set up local development
    description: Configure the project and run the dev server with the example content.
    type: chore
    labels:
      - onboarding
      - dev
    status: done
    steps:
      - Install dependencies with npm install.
      - Run npm run dev and verify the docs load.
    acceptance_criteria:
      - Dev server starts without errors.
      - Example docs are reachable at the local URL.
    created_at: 2025-12-01T10:00:00Z
    updated_at: 2025-12-02T09:30:00Z
    relations:
      - guides/getting_started/installation
      - guides/getting_started/project_structure

  - id: ECX-2
    name: Add custom theme colors
    description: Extend the theming system to support a custom primary color in config.json.
    type: feature
    labels:
      - theming
    status: in-progress
    steps:
      - Add a new color option to config validation.
      - Wire the color into getColorVars.
      - Add an example color to example/config.json.
    acceptance_criteria:
      - Changing color in config.json updates the site primary color.
      - Build passes with no type or lint errors.
    created_at: 2025-12-03T11:15:00Z
    updated_at: 2025-12-04T08:45:00Z
    dependencies:
      - ECX-1
    relations:
      - guides/core_concepts/theming
      - ECX-1

  - id: ECX-3
    name: Document the Tasks feature
    description: Add a short section in the docs explaining how to use tasks.yml per tab.
    type: docs
    labels:
      - docs
    status: todo
    steps:
      - Create a new page under task_management explaining tasks.yml.
      - Add examples for todo, in-progress and done tasks.
    acceptance_criteria:
      - Tasks feature is documented in the example docs.
    created_at: 2025-12-04T09:00:00Z
    updated_at: 2025-12-04T09:00:00Z
    relations:
      - label: GitHub
        url: https://github.com/sonmezerekrem/echox
        external: true
```

Place this file at `content/<your_tab>/tasks.yml` (e.g. `content/task_management/tasks.yml`) and the tab will get the three task list pages automatically.
