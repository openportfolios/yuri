// Regenerates src/lib/social-icons.generated.ts, the brand icon paths used by
// person.social entries in portfolio.config.json.
//
// The icon paths come from Simple Icons (https://simpleicons.org), released
// under CC0 1.0. They are baked into a generated file so the template ships
// no runtime dependency for them.
//
// To add a brand: add `key: "simple-icons-slug"` to BRAND_ICONS below, then
//   npm install --no-save simple-icons
//   node scripts/generate-social-icons.mjs
// An unknown slug fails the script instead of silently producing no icon.
//
// Some brands (LinkedIn, Slack, Xbox, CodePen) are not part of Simple Icons.
// LinkedIn is kept as a hand-written path in src/lib/social-icons.ts.
import { writeFileSync } from "node:fs";
import * as simpleIcons from "simple-icons";

// key used in portfolio.config.json -> Simple Icons slug
const BRAND_ICONS = {
  // Code & tech
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  stackoverflow: "stackoverflow",
  replit: "replit",
  npm: "npm",
  docker: "docker",
  huggingface: "huggingface",
  kaggle: "kaggle",
  leetcode: "leetcode",
  hackerrank: "hackerrank",
  codewars: "codewars",
  vercel: "vercel",
  netlify: "netlify",

  // Social networks
  x: "x",
  instagram: "instagram",
  facebook: "facebook",
  threads: "threads",
  bluesky: "bluesky",
  mastodon: "mastodon",
  reddit: "reddit",
  tiktok: "tiktok",
  snapchat: "snapchat",
  pinterest: "pinterest",
  tumblr: "tumblr",

  // Messaging
  discord: "discord",
  telegram: "telegram",
  whatsapp: "whatsapp",
  signal: "signal",

  // Video
  youtube: "youtube",
  twitch: "twitch",
  kick: "kick",
  vimeo: "vimeo",

  // Music
  spotify: "spotify",
  soundcloud: "soundcloud",
  applemusic: "applemusic",
  bandcamp: "bandcamp",
  deezer: "deezer",
  tidal: "tidal",
  lastfm: "lastdotfm",

  // Writing
  medium: "medium",
  substack: "substack",
  hashnode: "hashnode",
  devto: "devdotto",
  wordpress: "wordpress",
  notion: "notion",

  // Design & photography
  behance: "behance",
  dribbble: "dribbble",
  figma: "figma",
  artstation: "artstation",
  deviantart: "deviantart",
  unsplash: "unsplash",
  flickr: "flickr",

  // Support & payments
  patreon: "patreon",
  kofi: "kofi",
  buymeacoffee: "buymeacoffee",
  paypal: "paypal",
  gumroad: "gumroad",

  // Games
  steam: "steam",
  itchio: "itchdotio",
  epicgames: "epicgames",
  playstation: "playstation",
  roblox: "roblox",
  chess: "chessdotcom",
  lichess: "lichess",

  // Academia & work
  orcid: "orcid",
  googlescholar: "googlescholar",
  researchgate: "researchgate",
  crunchbase: "crunchbase",
  upwork: "upwork",
  fiverr: "fiverr",
  producthunt: "producthunt",
  ycombinator: "ycombinator",

  // Culture
  goodreads: "goodreads",
  letterboxd: "letterboxd",
  imdb: "imdb",
  strava: "strava",
  duolingo: "duolingo",

  // Links
  linktree: "linktree",
  calendly: "calendly",
};

const bySlug = new Map();
for (const icon of Object.values(simpleIcons)) {
  if (icon && typeof icon === "object" && "slug" in icon) bySlug.set(icon.slug, icon);
}

const missing = [];
const entries = [];
for (const [key, slug] of Object.entries(BRAND_ICONS)) {
  const icon = bySlug.get(slug);
  if (!icon) {
    missing.push(`${key} -> ${slug}`);
    continue;
  }
  entries.push([key, icon.path, icon.title]);
}

if (missing.length) {
  console.error("Unknown Simple Icons slug(s):");
  for (const m of missing) console.error(`  ${m}`);
  process.exit(1);
}

entries.sort((a, b) => a[0].localeCompare(b[0]));

const body = entries
  .map(([key, path, title]) => `  // ${title}\n  ${key}: "${path}",`)
  .join("\n");

const out = `// GENERATED FILE - do not edit by hand.
// Run \`node scripts/generate-social-icons.mjs\` to regenerate.
//
// Brand icon paths from Simple Icons (https://simpleicons.org), CC0 1.0.
// Every path is drawn on a 24x24 viewBox with \`fill="currentColor"\`.

export const BRAND_ICON_PATHS = {
${body}
} as const;

export type BrandIconKey = keyof typeof BRAND_ICON_PATHS;
`;

writeFileSync(new URL("../src/lib/social-icons.generated.ts", import.meta.url), out);
console.log(`Wrote src/lib/social-icons.generated.ts with ${entries.length} brand icons.`);
