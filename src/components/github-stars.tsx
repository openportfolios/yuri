"use client";

import { useEffect, useState } from "react";

function formatStars(count: number): string {
  if (count < 1000) return String(count);
  const thousands = count / 1000;
  return `${thousands >= 10 ? Math.round(thousands) : thousands.toFixed(1).replace(/\.0$/, "")}k`;
}

// Star counts are fetched once per repo per page load and shared by every
// card pointing at it (the preview route re-renders on each config message).
const cache = new Map<string, Promise<number | null>>();

function fetchStars(repo: string): Promise<number | null> {
  const cached = cache.get(repo);
  if (cached) return cached;

  const request = fetch(`https://api.github.com/repos/${repo}`, {
    headers: { Accept: "application/vnd.github+json" },
  })
    .then((response) => (response.ok ? response.json() : null))
    .then((data: { stargazers_count?: number } | null) =>
      typeof data?.stargazers_count === "number" ? data.stargazers_count : null
    )
    .catch(() => null);

  cache.set(repo, request);
  return request;
}

function StarIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
    </svg>
  );
}

// Renders nothing until the count is known — and stays silent when the repo
// is private, missing, or the (unauthenticated) API rate limit is reached.
// Takes the raw scale multiplier (not a px function) because functions can't
// cross the server/client component boundary.
export function GitHubStars({ repo, scale }: { repo: string; scale: number }) {
  const [stars, setStars] = useState<number | null>(null);
  const px = (base: number) => base * scale;

  useEffect(() => {
    let active = true;
    fetchStars(repo).then((count) => {
      if (active) setStars(count);
    });
    return () => {
      active = false;
    };
  }, [repo]);

  if (stars === null) return null;

  return (
    <span
      title={`${stars.toLocaleString()} stars on GitHub`}
      style={{
        display: "inline-flex", alignItems: "center", gap: px(4),
        fontFamily: "ui-monospace, monospace", fontSize: px(12), fontWeight: 600,
        color: "hsl(var(--foreground) / 0.6)",
      }}
    >
      <StarIcon size={px(12)} />
      {formatStars(stars)}
    </span>
  );
}
