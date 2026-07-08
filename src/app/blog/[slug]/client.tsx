"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkEmoji from "remark-emoji";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import Link from "next/link";
import { Credits } from "@/components/credits";
import { PersonHeader } from "@/components/person-header";
import { Reveal } from "@/components/reveal";
import type { BlogPost } from "@/lib/blog";
import { areAnimationsEnabled, portfolioConfig, px, uiString } from "@/lib/portfolio-config";
import remarkColorLinks from "@/lib/remark-color-links";

const MAX_BLOG_TAGS = 3;

export default function BlogPostClient({ post }: { post: BlogPost }) {
  const animations = areAnimationsEnabled(portfolioConfig);
  return (
    <main
      style={{ maxWidth: px(1400) }}
      className="relative mx-auto scroll-my-12 overflow-auto p-4 md:p-16 print:p-11"
    >
      <div className="mx-auto w-full max-w-2xl space-y-8" style={{ backgroundColor: "hsl(var(--background))" }}>

        {/* Back link */}
        <Reveal enabled={animations}>
          <Link
            href="/"
            className="inline-flex items-center gap-x-1.5 font-mono text-sm hover:underline print:hidden"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={px(14)}
              height={px(14)}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            {uiString(portfolioConfig, "backHome")}
          </Link>
        </Reveal>

        {/* Post metadata */}
        <Reveal enabled={animations}>
          <div className="flex flex-col gap-y-2">
            <p className="font-mono text-xs tabular-nums" style={{ color: "hsl(var(--muted-foreground))" }}>
              {post.date}
            </p>
            <ul className="flex list-none flex-wrap gap-1 p-0">
              {post.tags.slice(0, MAX_BLOG_TAGS).map((tag) => (
                <li key={tag} className="min-w-0 max-w-full">
                  <span
                    style={{
                      display: "inline-block",
                      borderRadius: `${px(6)}px`,
                      border: "1px solid transparent",
                      padding: `${px(2)}px ${px(8)}px`,
                      fontWeight: 600,
                      fontFamily: "ui-monospace, monospace",
                      fontSize: `${px(12)}px`,
                      backgroundColor: "hsl(var(--secondary))",
                      color: "hsl(var(--secondary-foreground))",
                      maxWidth: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      verticalAlign: "middle",
                    }}
                  >
                    {tag}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Markdown content */}
        <Reveal enabled={animations}>
        <article className="prose-blog break-words">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkEmoji, remarkColorLinks]}
            rehypePlugins={[rehypeRaw, rehypeSlug]}
            remarkRehypeOptions={{ footnoteLabel: uiString(portfolioConfig, "footnotesLabel") }}
            components={{
              h1: ({ children, id }) => (
                <h1 id={id} className="text-2xl font-bold mb-4 scroll-mt-8">{children}</h1>
              ),
              h2: ({ children, id }) => (
                <h2 id={id} className="text-xl font-bold mt-8 mb-3 scroll-mt-8">{children}</h2>
              ),
              h3: ({ children, id }) => (
                <h3 id={id} className="text-base font-semibold mt-6 mb-2 scroll-mt-8">{children}</h3>
              ),
              h4: ({ children, id }) => (
                <h4 id={id} className="text-base font-semibold mt-4 mb-2 scroll-mt-8">{children}</h4>
              ),
              h5: ({ children, id }) => (
                <h5 id={id} className="text-sm font-semibold mt-4 mb-2 scroll-mt-8">{children}</h5>
              ),
              h6: ({ children, id }) => (
                <h6
                  id={id}
                  className="text-sm font-semibold mt-4 mb-2 scroll-mt-8"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {children}
                </h6>
              ),
              p: ({ children }) => (
                <p className="font-mono text-sm mb-4 text-pretty leading-relaxed" style={{ color: "hsl(var(--foreground) / 0.8)" }}>
                  {children}
                </p>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold" style={{ color: "hsl(var(--foreground))" }}>
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className="italic">{children}</em>
              ),
              ul: ({ children, className }) => {
                const isTaskList = className?.includes("contains-task-list");
                return (
                  <ul
                    className={`font-mono text-sm mb-4 space-y-1 ${isTaskList ? "list-none pl-0" : "list-disc list-inside"}`}
                    style={{ color: "hsl(var(--foreground) / 0.8)" }}
                  >
                    {children}
                  </ul>
                );
              },
              ol: ({ children }) => (
                <ol className="list-decimal list-inside font-mono text-sm mb-4 space-y-1" style={{ color: "hsl(var(--foreground) / 0.8)" }}>
                  {children}
                </ol>
              ),
              li: ({ children, ...rest }) => <li {...rest}>{children}</li>,
              code: ({ className, children, node, ...props }) => {
                // A fenced code block (```) always spans multiple source
                // lines, even without a language tag (which is the only case
                // `className` alone can't distinguish from inline code).
                const isBlock = node?.position
                  ? node.position.start.line !== node.position.end.line
                  : String(children).includes("\n");
                if (isBlock) {
                  return (
                    <pre
                      style={{
                        backgroundColor: "hsl(var(--muted))",
                        borderRadius: `${px(8)}px`,
                        padding: `${px(16)}px`,
                        overflowX: "auto",
                        marginBottom: `${px(16)}px`,
                        border: "1px solid hsl(var(--border))",
                      }}
                    >
                      <code
                        className={className}
                        style={{
                          fontFamily: "ui-monospace, monospace",
                          fontSize: `${px(13)}px`,
                          color: "hsl(var(--foreground))",
                        }}
                        {...props}
                      >
                        {children}
                      </code>
                    </pre>
                  );
                }
                return (
                  <code
                    style={{
                      fontFamily: "ui-monospace, monospace",
                      fontSize: `${px(13)}px`,
                      backgroundColor: "hsl(var(--muted))",
                      borderRadius: `${px(4)}px`,
                      padding: `${px(2)}px ${px(6)}px`,
                      color: "hsl(var(--foreground))",
                    }}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              img: ({ src, alt, width, height, style, ...props }) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt={alt ?? ""}
                  width={width}
                  height={height}
                  style={{
                    borderRadius: `${px(8)}px`,
                    maxWidth: "100%",
                    marginBottom: `${px(16)}px`,
                    ...(typeof style === "object" ? style : {}),
                  }}
                  {...props}
                />
              ),
              a: ({ href, children, ...rest }) => {
                const { ["data-color"]: color, ...anchorProps } = rest as Record<string, string>;
                // In-page anchors (footnotes, heading links) must navigate in
                // the same tab so the browser can scroll to them; only real
                // external links should open in a new tab.
                const isSamePageAnchor = href?.startsWith("#");
                return (
                  <a
                    href={href}
                    {...anchorProps}
                    {...(isSamePageAnchor ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                    className="hover:underline"
                    style={{ color: color ?? "hsl(var(--foreground))", fontWeight: 500 }}
                  >
                    {children}
                  </a>
                );
              },
              span: ({ children, ...rest }) => {
                const color = (rest as Record<string, string>)["data-color"];
                return color ? <span style={{ color }}>{children}</span> : <span>{children}</span>;
              },
              blockquote: ({ children }) => (
                <blockquote
                  style={{
                    borderLeft: "3px solid hsl(var(--border))",
                    paddingLeft: `${px(16)}px`,
                    marginBottom: `${px(16)}px`,
                    color: "hsl(var(--muted-foreground))",
                    fontStyle: "italic",
                  }}
                >
                  {children}
                </blockquote>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>
        </Reveal>

        <hr style={{ borderColor: "hsl(var(--border))" }} />

        <Reveal enabled={animations}>
          <PersonHeader config={portfolioConfig} />
        </Reveal>
      </div>

      <Reveal className="mt-8" atPageEnd enabled={animations}>
        <Credits config={portfolioConfig} />
      </Reveal>
    </main>
  );
}
