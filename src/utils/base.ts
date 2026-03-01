/**
 * Prefix an internal path with the site base (e.g. /echox/ on GitHub Pages).
 * Skips external URLs (http, https, //) and hash-only links.
 */
export function withBase(href: string, base: string = '/'): string {
  if (!href || href.startsWith('http') || href.startsWith('//') || href.startsWith('#')) {
    return href;
  }
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  return b + (href.startsWith('/') ? href : '/' + href);
}
