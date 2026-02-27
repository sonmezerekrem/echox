import { visit } from 'unist-util-visit';
import { h } from 'hastscript';

const CALLOUT_TYPES = {
  NOTE: { icon: 'information-circle', label: 'Note' },
  TIP: { icon: 'bulb', label: 'Tip' },
  WARNING: { icon: 'alert-02', label: 'Warning' },
  DANGER: { icon: 'alert-diamond', label: 'Danger' },
};

const CALLOUT_RE = /^\[!(NOTE|TIP|WARNING|DANGER)\]\s*/;

function transformCallouts(tree) {
  visit(tree, 'blockquote', (node, index, parent) => {
    const firstChild = node.children[0];
    if (!firstChild || firstChild.type !== 'paragraph') return;

    const firstInline = firstChild.children[0];
    if (!firstInline || firstInline.type !== 'text') return;

    const match = firstInline.value.match(CALLOUT_RE);
    if (!match) return;

    const type = match[1];
    const info = CALLOUT_TYPES[type];
    const typeLower = type.toLowerCase();

    firstInline.value = firstInline.value.replace(CALLOUT_RE, '');
    if (!firstInline.value && firstChild.children.length === 1) {
      node.children.shift();
    } else if (!firstInline.value) {
      firstChild.children.shift();
    }

    const contentHtml = [];
    for (const child of node.children) {
      contentHtml.push({ type: 'html', value: '' });
      contentHtml.push(child);
    }

    const replacement = {
      type: 'html',
      value: `<div class="callout callout-${typeLower}"><div class="callout-title"><i class="hgi-stroke hgi-${info.icon}" aria-hidden="true"></i><span>${info.label}</span></div><div class="callout-content">`,
    };

    const closing = { type: 'html', value: '</div></div>' };

    parent.children.splice(index, 1, replacement, ...node.children, closing);
  });
}

function transformDirectives(tree) {
  visit(tree, (node, index, parent) => {
    if (!parent) return;

    if (node.type === 'containerDirective' && node.name === 'accordion') {
      const title = node.attributes?.title || 'Details';
      const open = { type: 'html', value: `<details class="accordion"><summary>${escapeHtml(title)}</summary><div class="accordion-content">` };
      const close = { type: 'html', value: '</div></details>' };
      parent.children.splice(index, 1, open, ...node.children, close);
      return;
    }

    if (node.type === 'containerDirective' && node.name === 'card-group') {
      const open = { type: 'html', value: '<div class="card-group">' };
      const close = { type: 'html', value: '</div>' };
      parent.children.splice(index, 1, open, ...node.children, close);
      return;
    }

    if (node.type === 'containerDirective' && node.name === 'card') {
      const title = node.attributes?.title || '';
      const href = node.attributes?.href || '';
      const icon = node.attributes?.icon || 'file-01';

      const tag = href ? 'a' : 'div';
      const hrefAttr = href ? ` href="${escapeHtml(href)}"` : '';

      const contentParts = [];
      for (const child of node.children) {
        if (child.type === 'paragraph') {
          for (const inline of child.children) {
            if (inline.type === 'text') contentParts.push(inline.value);
          }
        }
      }
      const description = contentParts.join(' ');

      const html = `<${tag} class="doc-card"${hrefAttr}><div class="doc-card-icon"><i class="hgi-stroke hgi-${escapeHtml(icon)}" aria-hidden="true"></i></div><div class="doc-card-body"><strong class="doc-card-title">${escapeHtml(title)}</strong><p class="doc-card-desc">${escapeHtml(description)}</p></div></${tag}>`;

      parent.children.splice(index, 1, { type: 'html', value: html });
      return;
    }
  });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default function remarkComponents() {
  return (tree) => {
    transformCallouts(tree);
    transformDirectives(tree);
  };
}
