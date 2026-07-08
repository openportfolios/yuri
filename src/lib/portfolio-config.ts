import rawConfig from "../../portfolio.config.json";

export type SocialIconKey =
  | "email"
  | "resume"
  | "github"
  | "linkedin"
  | "instagram"
  | "x"
  | "youtube";

export type SocialLink = {
  label: string;
  href: string;
  icon: SocialIconKey;
};

export type PersonConfig = {
  name: string;
  title: string;
  location: string;
  avatar: string;
  social: SocialLink[];
};

export type AboutConfig = {
  // A single paragraph, or multiple strings for multiple paragraphs.
  // Supports rich text: **bold**, *italic*, ~~strike~~, `code`, and
  // [label](url){color} links (color is any CSS color; omit the url to get
  // colored, non-clickable text).
  text: string | string[];
};

export type WorkExperienceItem = {
  company: string;
  companyUrl: string;
  companyImage?: string;
  companyDescription?: string;
  role: string;
  period: string;
  tags: string[];
  bullets: string[];
};

export type ProjectItem = {
  title: string;
  description: string;
  tags: string[];
  href?: string;
};

export type EducationItem = {
  institution: string;
  degree: string;
  period: string;
};

export type CertificationItem = {
  title: string;
  issuer: string;
  certificationImage?: string;
  date: string;
  href?: string;
};

export type BlogConfig = {
  enabled: boolean;
};

export type DiscordActivityConfig = {
  enabled: boolean;
  userId: string;
};

export type CreditsConfig = {
  enabled: boolean;
};

export type AnimationsConfig = {
  enabled: boolean;
};

export type ScaleLevel = "small" | "medium" | "high";

export type Language = "en" | "pt";

export type MetaConfig = {
  siteTitle: string;
  siteDescription: string;
  ogImage: string;
  favicon?: string;
  defaultTheme: "light" | "dark" | "system";
  scale?: ScaleLevel;
  language?: Language;
};

export type PortfolioConfig = {
  meta: MetaConfig;
  person: PersonConfig;
  about: AboutConfig | null;
  workExperience: WorkExperienceItem[] | null;
  education?: EducationItem[] | null;
  projects: ProjectItem[] | null;
  skills: string[] | null;
  certifications?: CertificationItem[] | null;
  blog: BlogConfig | null;
  discordActivity: DiscordActivityConfig | null;
  credits?: CreditsConfig | null;
  animations?: AnimationsConfig | null;
};

// Sections are optional in the JSON file — omitting a key (or setting it to
// null) is how a user removes that part of the site.
export const portfolioConfig = rawConfig as unknown as PortfolioConfig;

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

// Home-page sections render in the order their keys appear in
// portfolio.config.json (JSON key order is preserved by the import). Keys
// missing from the JSON fall back to their default position, appended at
// the end.
export function sectionOrder(): OrderableSectionKey[] {
  const jsonOrder = Object.keys(rawConfig).filter((key): key is OrderableSectionKey =>
    (DEFAULT_SECTION_ORDER as string[]).includes(key)
  );
  const missing = DEFAULT_SECTION_ORDER.filter((key) => !jsonOrder.includes(key));
  return [...jsonOrder, ...missing];
}

export function hasItems<T>(value: T[] | null | undefined): value is T[] {
  return Array.isArray(value) && value.length > 0;
}

// Scroll-reveal animations are on by default; set animations.enabled to
// false (or animations to null) in portfolio.config.json to turn them off.
export function areAnimationsEnabled(): boolean {
  return portfolioConfig.animations?.enabled ?? true;
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
export function sectionTitle(key: SectionKey): string {
  const language = portfolioConfig.meta.language ?? "en";
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
export function uiString(key: UIStringKey): string {
  const language = portfolioConfig.meta.language ?? "en";
  return UI_STRINGS[language][key];
}

const SCALE_MULTIPLIERS: Record<ScaleLevel, number> = {
  small: 1,
  medium: 1.25,
  high: 1.5,
};

export const BASE_FONT_SIZE_PX = 16;

export const scaleMultiplier = SCALE_MULTIPLIERS[portfolioConfig.meta.scale ?? "small"];

// Converts a design value authored at the "small" (1x) baseline into the
// current scale level. Use for raw px values that don't ride the root
// font-size (rem-based Tailwind utilities already scale automatically).
export function px(base: number): number {
  return base * scaleMultiplier;
}
