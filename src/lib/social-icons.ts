import { BRAND_ICON_PATHS as GENERATED_BRAND_ICON_PATHS } from "./social-icons.generated";

// LinkedIn is not distributed by Simple Icons (it was removed at the brand's
// request), so its path is kept here instead of in the generated file.
const EXTRA_BRAND_ICON_PATHS = {
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
} as const;

// Brand marks, drawn as a single 24x24 path filled with currentColor.
export const BRAND_ICON_PATHS = {
  ...GENERATED_BRAND_ICON_PATHS,
  ...EXTRA_BRAND_ICON_PATHS,
};

export type BrandIconKey = keyof typeof GENERATED_BRAND_ICON_PATHS | keyof typeof EXTRA_BRAND_ICON_PATHS;

// Generic (non-brand) icons, drawn from lucide-react by socialIcon().
export const GENERIC_ICON_KEYS = ["email", "resume", "website", "phone", "rss", "location"] as const;

export type GenericIconKey = (typeof GENERIC_ICON_KEYS)[number];

// Spellings people reasonably reach for, mapped onto the real key. Anything
// not listed here and not a known key falls back to a question-mark icon.
export const ICON_ALIASES: Record<string, SocialIconKey> = {
  twitter: "x",
  mail: "email",
  gmail: "email",
  cv: "resume",
  curriculo: "resume",
  site: "website",
  link: "website",
  portfolio: "website",
  web: "website",
  "dev.to": "devto",
  telephone: "phone",
  tel: "phone",
  blog: "rss",
  feed: "rss",
  "x-twitter": "x",
  "apple-music": "applemusic",
  "last.fm": "lastfm",
  "buy-me-a-coffee": "buymeacoffee",
  "ko-fi": "kofi",
  "itch.io": "itchio",
  "google-scholar": "googlescholar",
  "product-hunt": "producthunt",
  "stack-overflow": "stackoverflow",
  "hacker-news": "ycombinator",
  hackernews: "ycombinator",
  "chess.com": "chess",
};

export type SocialIconKey = GenericIconKey | BrandIconKey;

export const SOCIAL_ICON_KEYS: readonly SocialIconKey[] = [
  ...GENERIC_ICON_KEYS,
  ...(Object.keys(BRAND_ICON_PATHS) as BrandIconKey[]),
];

export function isSocialIconKey(icon: unknown): icon is SocialIconKey {
  return typeof icon === "string" && (SOCIAL_ICON_KEYS as readonly string[]).includes(icon);
}

// Resolves what the user wrote in `icon` to a key this template can draw:
// exact match first, then a case-insensitive alias, then undefined.
export function resolveIconKey(icon: unknown): SocialIconKey | undefined {
  if (isSocialIconKey(icon)) return icon;
  if (typeof icon !== "string") return undefined;
  const normalized = icon.trim().toLowerCase();
  if (isSocialIconKey(normalized)) return normalized;
  const alias = ICON_ALIASES[normalized];
  return alias && isSocialIconKey(alias) ? alias : undefined;
}
