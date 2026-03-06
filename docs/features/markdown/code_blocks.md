---
name: Code Blocks
order: 8
icon: code-02
---

Echox uses [Shiki](https://shiki.style/) for syntax highlighting. Code blocks support line highlighting, diff notation, a copy button, and automatic light/dark theme matching.

## Basic Usage

Use fenced code blocks with a language identifier:

````markdown
```javascript
const x = 42;
console.log(x);
```
````

Themes: `github-light` (light mode) and `github-dark` (dark mode), matching your site theme.

## Line Highlighting

Highlight specific lines using the meta string after the language:

````markdown
```js {2,4-5}
function greet() {
  console.log('Hello');  // highlighted
  return true;
  return false;          // highlighted
}
```
````

Use `{N}` for a single line, `{N-M}` for a range, or `{1,3,5-7}` for multiple.

## Diff View

Mark added and removed lines with inline comments:

````markdown
```ts
const old = 'hewwo';  // [!code --]
const new = 'hello';  // [!code ++]
```
````

- `// [!code --]` — marks the line as removed (red background)
- `// [!code ++]` — marks the line as added (green background)

## Copy Button

Every code block (except Mermaid) has a copy button in the top-right corner. Click to copy the raw code to the clipboard.

## Mermaid

For diagrams, use `mermaid` as the language. See [Mermaid](/features/markdown/mermaid) for details.
