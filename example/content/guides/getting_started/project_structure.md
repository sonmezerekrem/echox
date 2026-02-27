---
name: Project Structure
order: 3
icon: folder-02
---

## Directory Layout

A EchoDocs project follows a simple convention:

```
my-docs/
├── content/           # Your markdown files
│   ├── guides/        # Tab: "Guides"
│   │   ├── getting_started/  # Group: "Getting Started"
│   │   │   ├── introduction.md
│   │   │   └── installation.md
│   │   └── core_concepts/    # Group: "Core Concepts"
│   │       ├── routing.md
│   │       └── theming.md
│   └── api_reference/ # Tab: "Api Reference"
│       └── endpoints/
│           └── users.md
├── assets/            # Static files (images, fonts, etc.)
│   └── logo.png
├── plugins/           # Custom remark/rehype plugins
└── config.json        # Site configuration
```

## How Routing Works

The folder structure maps directly to navigation:

| Level | Maps to | Example |
|-------|---------|---------|
| 1st level folder | Tab | `guides/` → "Guides" tab |
| 2nd level folder | Sidebar group | `getting_started/` → "Getting Started" group |
| Markdown file | Page | `installation.md` → "Installation" page |

Underscores in folder names are converted to spaces and title-cased automatically.

## Assets

Place images and other static files in the `assets/` directory. Reference them in markdown as:

```markdown
![My diagram](/diagram.png)
```

Files in `assets/` are served from the site root.
