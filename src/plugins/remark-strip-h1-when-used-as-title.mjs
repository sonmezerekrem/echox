/**
 * When a page has no frontmatter name/title but starts with an H1,
 * we use that H1 as the page title. This plugin removes the first H1
 * from the rendered content so it doesn't appear twice (once as page
 * title, once in the body).
 *
 * Only removes when frontmatter has neither name nor title.
 */
import { visit } from 'unist-util-visit';
import { parse as parseYaml } from 'yaml';

function getTextFromNode(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value || '';
  if (node.children) {
    return node.children.map(getTextFromNode).join('');
  }
  return '';
}

function hasNameOrTitle(tree, file) {
  const fm = file?.data?.frontmatter ?? file?.data?.astro?.frontmatter ?? file?.data?.matter;
  if (fm && (fm.name || fm.title)) return true;

  const yamlNode = tree.children?.find((n) => n.type === 'yaml');
  if (!yamlNode?.value) return false;
  try {
    const parsed = parseYaml(yamlNode.value);
    return !!(parsed?.name || parsed?.title);
  } catch {
    return false;
  }
}

export default function remarkStripH1WhenUsedAsTitle() {
  return (tree, file) => {
    if (hasNameOrTitle(tree, file)) return;

    let indexToRemove = -1;
    let parentToRemoveFrom = null;
    visit(tree, 'heading', (node, index, parent) => {
      if (indexToRemove >= 0) return;
      if (node.depth !== 1) return;
      const text = getTextFromNode(node).trim();
      if (!text) return;
      indexToRemove = index;
      parentToRemoveFrom = parent;
    });
    if (indexToRemove >= 0 && parentToRemoveFrom) {
      parentToRemoveFrom.children.splice(indexToRemove, 1);
    }
  };
}
