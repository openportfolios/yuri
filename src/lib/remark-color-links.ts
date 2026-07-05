import { visit } from "unist-util-visit";
import type { Link, Parent, Root, RootContent, Text } from "mdast";

// Extends standard Markdown links with an optional trailing `{#hex}` color,
// mirroring the [label](url){#hex} syntax already supported by
// `renderRichText` for the homepage teasers:
//   [label](url){#hex}  -> a real link, colored
//   [label](){#hex}      -> no destination, so non-clickable colored text
//   [label]{#hex}        -> same as above, with no parens at all
// Colors are passed through as a `data-color` attribute so client.tsx's `a`
// and `span` component overrides can apply them as inline styles.
const HEX_COLOR = "#[0-9a-fA-F]{3,8}";
const BARE_COLOR_TEXT = new RegExp(`\\[([^\\]]+)\\]\\{(${HEX_COLOR})\\}`, "g");
const TRAILING_COLOR = new RegExp(`^\\{(${HEX_COLOR})\\}`);

export default function remarkColorLinks() {
  return (tree: Root) => {
    // [label]{#hex} with no parens at all — never becomes a link node, so it
    // has to be pulled out of plain text nodes directly.
    visit(tree, "text", (node: Text, index, parent) => {
      if (typeof index !== "number" || !parent || !node.value.includes("{#")) return;
      BARE_COLOR_TEXT.lastIndex = 0;
      if (!BARE_COLOR_TEXT.test(node.value)) return;
      BARE_COLOR_TEXT.lastIndex = 0;

      const replacement: RootContent[] = [];
      let lastEnd = 0;
      let match: RegExpExecArray | null;
      while ((match = BARE_COLOR_TEXT.exec(node.value))) {
        if (match.index > lastEnd) {
          replacement.push({ type: "text", value: node.value.slice(lastEnd, match.index) });
        }
        const [, label, color] = match;
        replacement.push({
          type: "text",
          value: label,
          data: { hName: "span", hProperties: { "data-color": color } },
        } as unknown as RootContent);
        lastEnd = match.index + match[0].length;
      }
      if (lastEnd < node.value.length) {
        replacement.push({ type: "text", value: node.value.slice(lastEnd) });
      }

      (parent as Parent).children.splice(index, 1, ...replacement);
    });

    // [label](url){#hex} and [label](){#hex} — the {#hex} lands as a text
    // node immediately after the link node once standard link syntax parses.
    visit(tree, "link", (node: Link, index, parent) => {
      if (typeof index !== "number" || !parent) return;
      const siblings = (parent as Parent).children;
      const next = siblings[index + 1];
      if (!next || next.type !== "text") return;

      const match = (next as Text).value.match(TRAILING_COLOR);
      if (!match) return;

      const color = match[1];
      const remainder = (next as Text).value.slice(match[0].length);
      if (remainder) {
        (next as Text).value = remainder;
      } else {
        siblings.splice(index + 1, 1);
      }

      node.data = node.data ?? {};
      if (node.url) {
        node.data.hProperties = { ...(node.data.hProperties as object), "data-color": color };
      } else {
        node.data.hName = "span";
        node.data.hProperties = { "data-color": color };
      }
    });
  };
}
