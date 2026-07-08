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

// Icons this template ships for person.social entries (the schema allows any
// string for `icon`; unknown values simply render no icon).
export type SocialIconKey =
  | "email"
  | "resume"
  | "github"
  | "linkedin"
  | "instagram"
  | "x"
  | "youtube";

export type ScaleLevel = NonNullable<PortfolioConfigInput["meta"]["scale"]>;

export type Language = NonNullable<PortfolioConfigInput["meta"]["language"]>;

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
  return config.meta.animations ?? true;
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

// Section headings are translated based on `meta.language` ("en" or "pt").
export function sectionTitle(config: PortfolioConfigInput, key: SectionKey): string {
  const language = config.meta.language ?? "en";
  return SECTION_TITLES[language][key];
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
  const language = config.meta.language ?? "en";
  return UI_STRINGS[language][key];
}

const SCALE_MULTIPLIERS: Record<ScaleLevel, number> = {
  small: 1,
  medium: 1.25,
  high: 1.5,
};

export const BASE_FONT_SIZE_PX = 16;

export function scaleMultiplierFor(config: PortfolioConfigInput): number {
  return SCALE_MULTIPLIERS[config.meta.scale ?? "small"];
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
