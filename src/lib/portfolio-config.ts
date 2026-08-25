import type { PortfolioConfigInput } from "@openportfolios/schema";
import rawConfig from "../../portfolio.config.json";

// Config types come from the official schema package; the JSON is validated
// against it at build time by scripts/validate-config.mjs (npm "prebuild").
export type {
  PortfolioConfig,
  PortfolioConfigInput,
  Meta,
  Person,
  SocialLink,
  About,
  WorkExperienceItem,
  EducationItem,
  ProjectItem,
  CertificationItem,
  Blog,
  DiscordActivity,
} from "@openportfolios/schema";

// Icons this template ships for person.social entries live in ./social-icons
// (the brand paths there are generated). They are re-exported here so the rest
// of the app keeps importing config helpers from a single module.
export { SOCIAL_ICON_KEYS, isSocialIconKey, resolveIconKey } from "./social-icons";
export type { SocialIconKey } from "./social-icons";

export type ScaleLevel = NonNullable<PortfolioConfigInput["meta"]["scale"]>;

export type Language = NonNullable<PortfolioConfigInput["meta"]["language"]>;

export type ThemeName = PortfolioConfigInput["meta"]["defaultTheme"];

// ── meta value resolution ─────────────────────────────────────────────────────
// What the site renders is the raw portfolio.config.json: nothing re-validates
// it at runtime (scripts/validate-config.mjs only guards `npm run build`, and
// the file can be edited afterwards). So every constrained `meta` value goes
// through a resolver that falls back to this template's default instead of
// letting an out-of-range value produce NaN sizes or crash the page.

function oneOf<T extends string>(allowed: readonly T[], value: unknown, fallback: T): T {
  return (allowed as readonly string[]).includes(value as string) ? (value as T) : fallback;
}

// Non-booleans (a "false" string, a number, a typo) fall back to the default
// rather than being read for truthiness.
function flag(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export const SCALE_LEVELS = ["small", "medium", "high"] as const;
export const LANGUAGES = ["pt", "en"] as const;
export const THEMES = ["light", "dark", "system"] as const;

export const DEFAULT_SCALE: ScaleLevel = "small";
export const DEFAULT_LANGUAGE: Language = "pt";
export const DEFAULT_THEME: ThemeName = "system";

export function resolveScale(config: PortfolioConfigInput): ScaleLevel {
  return oneOf(SCALE_LEVELS, config.meta?.scale, DEFAULT_SCALE);
}

export function resolveLanguage(config: PortfolioConfigInput): Language {
  return oneOf(LANGUAGES, config.meta?.language, DEFAULT_LANGUAGE);
}

export function resolveTheme(config: PortfolioConfigInput): ThemeName {
  return oneOf(THEMES, config.meta?.defaultTheme, DEFAULT_THEME);
}

// Sections are optional in the JSON file — omitting a key (or setting it to
// null) is how a user removes that part of the site.
export const portfolioConfig = rawConfig as unknown as PortfolioConfigInput;

// Sections the user can reorder by moving their keys around in
// portfolio.config.json. Only the header ("person") is pinned to the top.
export type OrderableSectionKey =
  | "about"
  | "workExperience"
  | "education"
  | "projects"
  | "skills"
  | "certifications"
  | "blog"
  | "discordActivity";

const DEFAULT_SECTION_ORDER: OrderableSectionKey[] = [
  "about",
  "workExperience",
  "education",
  "projects",
  "skills",
  "certifications",
  "blog",
  "discordActivity",
];

// Home-page sections render in the order their keys appear in the config
// object (JSON key order is preserved by the import and by postMessage's
// structured clone). Keys missing from the config fall back to their default
// position, appended at the end.
export function sectionOrder(config: PortfolioConfigInput): OrderableSectionKey[] {
  const jsonOrder = Object.keys(config).filter((key): key is OrderableSectionKey =>
    (DEFAULT_SECTION_ORDER as string[]).includes(key)
  );
  const missing = DEFAULT_SECTION_ORDER.filter((key) => !jsonOrder.includes(key));
  return [...jsonOrder, ...missing];
}

export function hasItems<T>(value: T[] | null | undefined): value is T[] {
  return Array.isArray(value) && value.length > 0;
}

// Scroll-reveal animations are on by default; set meta.animations to false
// in portfolio.config.json to turn them off.
export function areAnimationsEnabled(config: PortfolioConfigInput): boolean {
  return flag(config.meta?.animations, true);
}

// The header reads its person fields through these resolvers. Nothing
// re-validates the config at runtime, so a field left empty (or holding a
// non-string) resolves to undefined and the header drops the whole element —
// otherwise an empty value would still render its icon with no text beside it.
function trimmedText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function personName(config: PortfolioConfigInput): string | undefined {
  return trimmedText(config.person?.name);
}

export function personTitle(config: PortfolioConfigInput): string | undefined {
  return trimmedText(config.person?.title);
}

export function personLocation(config: PortfolioConfigInput): string | undefined {
  return trimmedText(config.person?.location);
}

export function personAvatar(config: PortfolioConfigInput): string | undefined {
  return trimmedText(config.person?.avatar);
}

// `person.email` isn't part of @openportfolios/schema 1.0.0 — the schema
// strips unknown keys instead of rejecting them, so the JSON stays valid and
// the field is read from the raw config here.
export function personEmail(config: PortfolioConfigInput): string | undefined {
  return trimmedText((config.person as { email?: unknown } | undefined)?.email);
}

// The "Built with OpenPortfolios" footer; on by default, same rules.
export function areCreditsEnabled(config: PortfolioConfigInput): boolean {
  return flag(config.meta?.credits, true);
}

type SectionKey = "about" | "workExperience" | "education" | "projects" | "skills" | "certifications" | "blog" | "activity";

const SECTION_TITLES: Record<Language, Record<SectionKey, string>> = {
  en: {
    about: "About",
    workExperience: "Work Experience",
    education: "Education",
    projects: "Projects",
    skills: "Skills",
    certifications: "Certifications",
    blog: "Blog",
    activity: "Activity",
  },
  pt: {
    about: "Sobre",
    workExperience: "Experiência Profissional",
    education: "Formação Acadêmica",
    projects: "Projetos",
    skills: "Habilidades",
    certifications: "Certificações",
    blog: "Blog",
    activity: "Atividade",
  },
};

// Section headings are translated based on `meta.language` ("pt" or "en").
export function sectionTitle(config: PortfolioConfigInput, key: SectionKey): string {
  return SECTION_TITLES[resolveLanguage(config)][key];
}

type UIStringKey = "builtWith" | "backHome" | "notFoundTitle" | "notFoundDescription" | "footnotesLabel";

const UI_STRINGS: Record<Language, Record<UIStringKey, string>> = {
  en: {
    builtWith: "Built with",
    backHome: "go back home",
    notFoundTitle: "Page not found",
    notFoundDescription: "The page you're looking for doesn't exist or has been moved.",
    footnotesLabel: "Footnotes",
  },
  pt: {
    builtWith: "Feito com",
    backHome: "voltar",
    notFoundTitle: "Página não encontrada",
    notFoundDescription: "A página que você está procurando não existe ou foi movida.",
    footnotesLabel: "Notas de rodapé",
  },
};

// Small bits of chrome UI text (not section headings) translated the same
// way as `sectionTitle`, based on `meta.language`.
export function uiString(config: PortfolioConfigInput, key: UIStringKey): string {
  return UI_STRINGS[resolveLanguage(config)][key];
}

const SCALE_MULTIPLIERS: Record<ScaleLevel, number> = {
  small: 1,
  medium: 1.25,
  high: 1.5,
};

export const BASE_FONT_SIZE_PX = 16;

export function scaleMultiplierFor(config: PortfolioConfigInput): number {
  return SCALE_MULTIPLIERS[resolveScale(config)];
}

// Converts a design value authored at the "small" (1x) baseline into the
// scale level of the given config. Use for raw px values that don't ride the
// root font-size (rem-based Tailwind utilities already scale automatically).
export function makePx(config: PortfolioConfigInput): (base: number) => number {
  const multiplier = scaleMultiplierFor(config);
  return (base) => base * multiplier;
}

// Singleton-bound versions for chrome outside the <Portfolio /> tree
// (layout, not-found, blog pages, theme toggle defaults) — always reflect
// the repo's own portfolio.config.json.
export const scaleMultiplier = scaleMultiplierFor(portfolioConfig);

export function px(base: number): number {
  return base * scaleMultiplier;
}
