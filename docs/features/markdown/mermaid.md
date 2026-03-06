---
name: Mermaid Diagrams
order: 7
icon: diagram-01
---

Echox renders [Mermaid](https://mermaid.js.org/) diagrams from fenced code blocks. Use the `mermaid` language identifier and write your diagram definition inside.

## Usage

````markdown
```mermaid
flowchart LR
  A[Start] --> B{Decision}
  B -->|Yes| C[OK]
  B -->|No| D[Retry]
```
````

## Supported Diagram Types

Mermaid supports many diagram types. Common ones:

- **flowchart** / **graph** — Flowcharts and graphs
- **sequenceDiagram** — Sequence diagrams
- **classDiagram** — Class diagrams
- **stateDiagram** — State diagrams
- **erDiagram** — Entity-relationship diagrams
- **pie** — Pie charts
- **gantt** — Gantt charts

## Example

```mermaid
flowchart TD
  subgraph Docs
    A[Markdown] --> B[Astro]
    B --> C[Static HTML]
  end
  C --> D[Pagefind Search]
```

## Theme

Diagrams automatically follow your site theme (light/dark). When you toggle dark mode, Mermaid re-renders with the matching theme.

## Notes

- Diagrams are rendered client-side using Mermaid v11 from a CDN
- The copy button is not shown on Mermaid blocks (the diagram SVG is rendered instead of raw code)
- Diagrams are centered and scroll horizontally on small screens if needed
