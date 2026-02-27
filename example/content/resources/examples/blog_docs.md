---
name: Blog Documentation
order: 1
icon: notebook
---

## Blog Docs Example

A simple blog documentation setup with guides and an API section.

### Folder Structure

```
blog-docs/
├── content/
│   ├── guides/
│   │   ├── writing/
│   │   │   ├── creating_posts.md
│   │   │   ├── markdown_syntax.md
│   │   │   └── media_uploads.md
│   │   └── managing/
│   │       ├── categories.md
│   │       └── tags.md
│   └── api_reference/
│       └── posts/
│           ├── list_posts.md
│           └── create_post.md
├── assets/
│   └── screenshots/
│       └── editor.png
└── config.json
```

### config.json

```json
{
  "name": "Blog Platform",
  "description": "Documentation for the Blog Platform",
  "color": "emerald",
  "github": "https://github.com/example/blog-platform"
}
```

### Sample Page

```markdown
---
name: Creating Posts
order: 1
icon: edit-02
---

## Creating a New Post

Navigate to the dashboard and click "New Post"...
```

This produces a site with two tabs (Guides, Api Reference), organized sidebar groups, and an emerald color theme.
