import type { ReactNode } from "react";

// Markdown-style inline formatting: `code`, **bold**/__bold__, *italic*/_italic_,
// ~~strike~~/~strike~, <sub>, <sup>, <ins> (underline), and combined
// bold+italic via any of ***x***, ___x___, **_x_**, __*x*__, _**x**_, *__x__*.
// Also supports [label](url){#hex} links — the color always lives in the
// `{}` suffix; omit the url (or the parens entirely, e.g. [label]{#hex}) to
// get non-clickable colored text instead of a link. All wrappers recurse so
// formatting can nest and combine with links, e.g. ***[label](url){#hex}***.
const TOKEN_PATTERN =
  /(`[^`]+`|<sub>[^<]+<\/sub>|<sup>[^<]+<\/sup>|<ins>[^<]+<\/ins>|\*\*\*[^*]+\*\*\*|___[^_]+___|\*\*_[^_]+_\*\*|__\*[^*]+\*__|_\*\*[^*]+\*\*_|\*__[^_]+__\*|\*\*[^*]+\*\*|__[^_]+__|~~[^~]+~~|~[^~]+~|\*[^*]+\*|_[^_]+_|\[[^\]]+\](?:\([^)]*\))?(?:\{[^}]+\})?)/g;

function renderToken(token: string, key: number): ReactNode {
  const linkMatch = token.match(/^\[([^\]]+)\](?:\(([^)]*)\))?(?:\{([^}]+)\})?$/);
  if (linkMatch) {
    const [, label, url, color] = linkMatch;
    const style = color ? { color } : undefined;
    if (!url) {
      return (
        <span key={key} style={style}>
          {renderRichText(label)}
        </span>
      );
    }
    return (
      <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="hover:underline" style={style}>
        {renderRichText(label)}
      </a>
    );
  }

  if (/^`[^`]+`$/.test(token)) {
    return (
      <code
        key={key}
        className="font-mono"
        style={{ backgroundColor: "hsl(var(--muted))", borderRadius: 4, padding: "0 4px" }}
      >
        {token.slice(1, -1)}
      </code>
    );
  }

  let m: RegExpMatchArray | null;

  if ((m = token.match(/^<sub>([^<]+)<\/sub>$/))) {
    return <sub key={key}>{renderRichText(m[1])}</sub>;
  }
  if ((m = token.match(/^<sup>([^<]+)<\/sup>$/))) {
    return <sup key={key}>{renderRichText(m[1])}</sup>;
  }
  if ((m = token.match(/^<ins>([^<]+)<\/ins>$/))) {
    return <ins key={key}>{renderRichText(m[1])}</ins>;
  }
  if (
    (m = token.match(/^\*\*\*([^*]+)\*\*\*$/)) ||
    (m = token.match(/^___([^_]+)___$/)) ||
    (m = token.match(/^\*\*_([^_]+)_\*\*$/)) ||
    (m = token.match(/^__\*([^*]+)\*__$/)) ||
    (m = token.match(/^_\*\*([^*]+)\*\*_$/)) ||
    (m = token.match(/^\*__([^_]+)__\*$/))
  ) {
    return (
      <strong key={key}>
        <em>{renderRichText(m[1])}</em>
      </strong>
    );
  }

  if ((m = token.match(/^\*\*([^*]+)\*\*$/)) || (m = token.match(/^__([^_]+)__$/))) {
    return <strong key={key}>{renderRichText(m[1])}</strong>;
  }

  if ((m = token.match(/^~~([^~]+)~~$/)) || (m = token.match(/^~([^~]+)~$/))) {
    return <s key={key}>{renderRichText(m[1])}</s>;
  }

  if ((m = token.match(/^\*([^*]+)\*$/)) || (m = token.match(/^_([^_]+)_$/))) {
    return <em key={key}>{renderRichText(m[1])}</em>;
  }

  return token;
}

export function renderRichText(text: string): ReactNode[] {
  return text.split(TOKEN_PATTERN).map((token, i) => renderToken(token, i));
}
