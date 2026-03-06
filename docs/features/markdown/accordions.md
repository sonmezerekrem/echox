---
name: Accordions
order: 2
icon: arrow-down-01
---

Accordions let you show collapsible content sections. They use the `:::accordion` directive with a `title` attribute.

## Syntax

```markdown
:::accordion{title="Click to expand"}
Content goes here. Can include **markdown** and multiple paragraphs.
:::
```

## Example

:::accordion{title="How does routing work?"}
Your folder structure becomes your URL structure. A file at `guides/getting_started/introduction.md` is served at `/guides/getting_started/introduction`.
:::

:::accordion{title="Can I nest accordions?"}
Yes, you can nest accordions inside other content. Each accordion is independent.
:::
