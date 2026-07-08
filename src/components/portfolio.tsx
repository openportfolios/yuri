import { Fragment } from "react";
import Link from "next/link";
import { Credits } from "@/components/credits";
import { DiscordActivitySection } from "@/components/discord-activity";
import { PersonHeader } from "@/components/person-header";
import { Reveal } from "@/components/reveal";
import {
  areAnimationsEnabled,
  hasItems,
  makePx,
  sectionOrder,
  sectionTitle,
  type OrderableSectionKey,
  type PortfolioConfigInput,
} from "@/lib/portfolio-config";
import { renderRichText } from "@/lib/rich-text";

// Blog post metadata as consumed by the blog cards. Mirrors BlogPost from
// "@/lib/blog" minus `content`, redeclared here so this file never imports
// the fs-backed blog module (it must stay renderable on the client, e.g.
// under /preview).
export type PortfolioBlogPost = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
};

const MAX_PROJECT_TAGS = 3;
const MAX_WORK_EXPERIENCE_TAGS = 5;
const MAX_BLOG_TAGS = 3;

type SectionProps = { config: PortfolioConfigInput };

type PxFn = (base: number) => number;

// ── Sub-components ────────────────────────────────────────────────────────────

function SecondaryBadge({ children, truncate, px }: { children: React.ReactNode; truncate?: boolean; px: PxFn }) {
  return (
    <span style={{
      display: truncate ? "inline-block" : "inline-flex", alignItems: "center", borderRadius: px(6),
      border: "1px solid transparent", padding: `${px(2)}px ${px(8)}px`,
      fontWeight: 600, fontFamily: "ui-monospace, monospace", fontSize: px(12),
      backgroundColor: "hsl(var(--secondary))", color: "hsl(var(--secondary-foreground))",
      whiteSpace: "nowrap", verticalAlign: "middle",
      // text-overflow:ellipsis doesn't reliably apply inside inline-flex, so
      // truncated badges render as inline-block instead.
      ...(truncate ? { maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis" } : {}),
    }}>
      {children}
    </span>
  );
}

function DarkBadge({ children, px }: { children: React.ReactNode; px: PxFn }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", borderRadius: px(6),
      border: "1px solid transparent", padding: `${px(2)}px ${px(8)}px`,
      fontWeight: 600, fontFamily: "ui-monospace, monospace", fontSize: px(12),
      backgroundColor: "hsl(var(--primary) / 0.8)", color: "hsl(var(--primary-foreground))",
    }}>
      {children}
    </span>
  );
}

// ── Sections ──────────────────────────────────────────────────────────────────

function AboutSection({ config }: SectionProps) {
  const about = config.about;
  if (!about) return null;
  return (
    <Reveal enabled={areAnimationsEnabled(config)}>
      <section className="flex min-h-0 flex-col gap-y-3 print:gap-y-1">
        <h2 className="text-xl font-bold">{sectionTitle(config, "about")}</h2>
        {(Array.isArray(about.text) ? about.text : [about.text]).map((paragraph, i) => (
          <p key={i} className="font-mono text-sm text-pretty break-words" style={{ color: "hsl(var(--foreground) / 0.8)" }}>
            {renderRichText(paragraph)}
          </p>
        ))}
      </section>
    </Reveal>
  );
}

function WorkExperienceSection({ config }: SectionProps) {
  const workExperience = config.workExperience;
  const px = makePx(config);
  if (!hasItems(workExperience)) return null;
  return (
    <Reveal enabled={areAnimationsEnabled(config)}>
    <section className="flex min-h-0 flex-col gap-y-3 print:gap-y-1">
      <h2 className="text-xl font-bold">{sectionTitle(config, "workExperience")}</h2>
      <div className="flex flex-col gap-y-4">
        {workExperience.map((job) => (
          <div key={job.company} className="rounded-lg py-1 print:py-0" style={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--card-foreground))" }}>
            <div className="flex flex-col space-y-1.5 print:space-y-1">
              <div className="flex items-start justify-between gap-x-2 text-base">
                <h3 className="inline-flex min-w-0 flex-1 flex-wrap items-center gap-x-1 gap-y-1 break-words font-semibold leading-none">
                  <span className="group relative inline-block min-w-0 max-w-full break-words print:contents">
                    <a href={job.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{job.company}</a>
                    {job.companyImage && (
                      <span
                        className="pointer-events-none absolute right-full top-1/2 z-10 hidden w-52 -translate-y-1/2 pr-3 opacity-0 transition-opacity duration-150 lg:block group-hover:opacity-100 print:hidden"
                      >
                        <span
                          className="block overflow-hidden rounded-lg border p-1 shadow-lg"
                          style={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={job.companyImage}
                            alt={job.company}
                            className="w-full rounded-md"
                            style={{ aspectRatio: "16/9", objectFit: "contain" }}
                          />
                          <span
                            className="mt-0.5 block text-center font-mono text-[11px]"
                            style={{ color: "hsl(var(--muted-foreground))" }}
                          >
                            {job.companyUrl.replace(/^https?:\/\/(www\.)?/, "")}
                          </span>
                        </span>
                      </span>
                    )}
                  </span>
                  <ul className="hidden list-none flex-wrap gap-1 p-0 lg:inline-flex">
                    {job.tags.slice(0, MAX_WORK_EXPERIENCE_TAGS).map((tag) => <li key={tag}><SecondaryBadge px={px}>{tag}</SecondaryBadge></li>)}
                  </ul>
                </h3>
                <div className="text-sm tabular-nums shrink-0" style={{ color: "#6b7280" }}>{job.period}</div>
              </div>
              <h4 className="break-words font-mono text-sm font-semibold leading-none print:text-[12px]">{job.role}</h4>
              <ul className="flex list-none flex-wrap gap-1 p-0 lg:hidden">
                {job.tags.slice(0, MAX_WORK_EXPERIENCE_TAGS).map((tag) => <li key={tag}><SecondaryBadge px={px}>{tag}</SecondaryBadge></li>)}
              </ul>
              {job.companyDescription && (
                <p className="font-mono text-xs text-pretty break-words" style={{ color: "hsl(var(--muted-foreground))" }}>{renderRichText(job.companyDescription)}</p>
              )}
            </div>
            <div className="mt-2 text-xs print:mt-1 print:text-[10px] text-pretty break-words" style={{ color: "hsl(var(--foreground) / 0.8)" }}>
              <ul className="list-inside list-disc space-y-1">
                {job.bullets.map((bullet, i) => <li key={i}>{renderRichText(bullet)}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
    </Reveal>
  );
}

function EducationSection({ config }: SectionProps) {
  const education = config.education;
  if (!hasItems(education)) return null;
  return (
    <Reveal enabled={areAnimationsEnabled(config)}>
    <section className="flex min-h-0 flex-col gap-y-3 print:gap-y-1">
      <h2 className="text-xl font-bold">{sectionTitle(config, "education")}</h2>
      <div className="flex flex-col gap-y-4">
        {education.map((edu) => (
          <div key={edu.institution} className="rounded-lg py-1 print:py-0" style={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--card-foreground))" }}>
            <div className="flex flex-col space-y-1.5 print:space-y-1">
              <div className="flex items-start justify-between gap-x-2 text-base">
                <h3 className="min-w-0 flex-1 break-words font-semibold leading-none">{edu.institution}</h3>
                <div className="text-sm tabular-nums shrink-0" style={{ color: "#6b7280" }}>{edu.period}</div>
              </div>
              <h4 className="break-words font-mono text-sm font-semibold leading-none print:text-[12px]">{edu.degree}</h4>
            </div>
          </div>
        ))}
      </div>
    </section>
    </Reveal>
  );
}

function ProjectsSection({ config }: SectionProps) {
  const projects = config.projects;
  const px = makePx(config);
  if (!hasItems(projects)) return null;
  return (
    <Reveal enabled={areAnimationsEnabled(config)}>
    <section className="flex min-h-0 flex-col gap-y-3 print:gap-y-1">
      <h2 className="text-xl font-bold">{sectionTitle(config, "projects")}</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {projects.map((project) => {
          const card = (
            <div
              className="rounded-lg border flex h-full flex-col overflow-hidden p-3 transition-colors hover:bg-accent"
              style={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
              role="article"
            >
              <div className="flex flex-col space-y-1">
                <h3 className="break-words font-semibold tracking-tight text-base">{project.title}</h3>
                <p className="font-mono text-xs text-pretty break-words" style={{ color: "hsl(var(--foreground) / 0.8)" }}>{renderRichText(project.description)}</p>
              </div>
              <div className="mt-auto pt-3">
                <ul className="flex list-none flex-wrap gap-1 p-0">
                  {project.tags.slice(0, MAX_PROJECT_TAGS).map((tag) => (
                    <li key={tag} className="min-w-0 max-w-full">
                      <SecondaryBadge truncate px={px}>{tag}</SecondaryBadge>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
          return project.href ? (
            <a key={project.title} href={project.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
              {card}
            </a>
          ) : (
            <div key={project.title}>{card}</div>
          );
        })}
      </div>
    </section>
    </Reveal>
  );
}

function SkillsSection({ config }: SectionProps) {
  const skills = config.skills;
  const px = makePx(config);
  if (!hasItems(skills)) return null;
  return (
    <Reveal enabled={areAnimationsEnabled(config)}>
    <section className="flex min-h-0 flex-col gap-y-3 print:gap-y-1">
      <h2 className="text-xl font-bold">{sectionTitle(config, "skills")}</h2>
      <ul className="flex list-none flex-wrap gap-1 p-0">
        {skills.map((skill) => <li key={skill}><DarkBadge px={px}>{skill}</DarkBadge></li>)}
      </ul>
    </section>
    </Reveal>
  );
}

function CertificationsSection({ config }: SectionProps) {
  const certifications = config.certifications;
  const px = makePx(config);
  if (!hasItems(certifications)) return null;
  return (
    <Reveal enabled={areAnimationsEnabled(config)}>
    <section className="flex min-h-0 flex-col gap-y-3 print:gap-y-1">
      <h2 className="text-xl font-bold">{sectionTitle(config, "certifications")}</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {certifications.map((cert) => {
          const card = (
            <div
              className="rounded-lg border flex h-full items-center gap-x-3 overflow-hidden p-3 transition-colors hover:bg-accent"
              style={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
              role="article"
            >
              {cert.certificationImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cert.certificationImage}
                  alt={cert.title}
                  className="shrink-0 rounded-md"
                  style={{ width: px(48), height: px(48), objectFit: "contain" }}
                />
              )}
              <div className="flex min-w-0 flex-col space-y-1">
                <h3 className="break-words font-semibold tracking-tight text-sm leading-tight">{cert.title}</h3>
                <p className="font-mono text-xs break-words" style={{ color: "hsl(var(--foreground) / 0.8)" }}>{cert.issuer}</p>
                <p className="font-mono text-xs tabular-nums" style={{ color: "hsl(var(--muted-foreground))" }}>{cert.date}</p>
              </div>
            </div>
          );
          return cert.href ? (
            <a key={cert.title} href={cert.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
              {card}
            </a>
          ) : (
            <div key={cert.title}>{card}</div>
          );
        })}
      </div>
    </section>
    </Reveal>
  );
}

function BlogSection({ config, posts }: SectionProps & { posts: PortfolioBlogPost[] }) {
  const px = makePx(config);
  if (!config.blog?.enabled) return null;
  return (
    <Reveal enabled={areAnimationsEnabled(config)}>
    <section className="flex min-h-0 flex-col gap-y-3 print:gap-y-1">
      <h2 className="text-xl font-bold">{sectionTitle(config, "blog")}</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="hover:no-underline" style={{ textDecoration: "none", color: "inherit" }}>
            <div
              className="rounded-lg border flex h-full flex-col overflow-hidden p-3 transition-colors hover:bg-accent"
              style={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
              role="article"
            >
              <div className="flex flex-col space-y-1">
                <h3 className="break-words font-semibold tracking-tight text-base">{post.title}</h3>
                <p className="font-mono text-xs text-pretty break-words" style={{ color: "hsl(var(--foreground) / 0.8)" }}>{renderRichText(post.description)}</p>
              </div>
              <div className="mt-auto pt-3 flex items-end justify-between gap-2">
                <ul className="flex min-w-0 list-none flex-wrap gap-1 p-0">
                  {post.tags.slice(0, MAX_BLOG_TAGS).map((tag) => (
                    <li key={tag} className="min-w-0 max-w-full">
                      <SecondaryBadge truncate px={px}>{tag}</SecondaryBadge>
                    </li>
                  ))}
                </ul>
                <span className="font-mono text-xs tabular-nums shrink-0" style={{ color: "hsl(var(--muted-foreground))" }}>{post.date}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
    </Reveal>
  );
}

// ── Portfolio ─────────────────────────────────────────────────────────────────

// The full portfolio render tree, driven entirely by the config prop. The
// home page feeds it the repo's portfolio.config.json; /preview feeds it live
// configs posted by an editor.
export function Portfolio({ config, posts = [] }: { config: PortfolioConfigInput; posts?: PortfolioBlogPost[] }) {
  const px = makePx(config);
  const animations = areAnimationsEnabled(config);

  // Sections render in the order their keys appear in the config object.
  // Only the header ("person") is pinned to the top.
  const sections: Record<OrderableSectionKey, React.ReactNode> = {
    about: <AboutSection config={config} />,
    workExperience: <WorkExperienceSection config={config} />,
    education: <EducationSection config={config} />,
    projects: <ProjectsSection config={config} />,
    skills: <SkillsSection config={config} />,
    certifications: <CertificationsSection config={config} />,
    blog: <BlogSection config={config} posts={posts} />,
    discordActivity: (
      <Reveal enabled={animations}>
        <DiscordActivitySection config={config.discordActivity} title={sectionTitle(config, "activity")} />
      </Reveal>
    ),
  };

  return (
    <>
      <main
        style={{ maxWidth: px(1400) }}
        className="relative mx-auto scroll-my-12 overflow-auto p-4 md:p-16 print:p-11"
      >
        <div className="mx-auto w-full max-w-2xl space-y-8 print:space-y-4" style={{ backgroundColor: "hsl(var(--background))" }}>

          {/* ── Header ── */}
          <Reveal enabled={animations}>
            <PersonHeader config={config} />
          </Reveal>

          {/* ── Orderable sections ── */}
          {sectionOrder(config).map((key) => (
            <Fragment key={key}>{sections[key]}</Fragment>
          ))}
        </div>

        <Reveal className="mt-8" atPageEnd enabled={animations}>
          <Credits config={config} />
        </Reveal>
      </main>
    </>
  );
}
