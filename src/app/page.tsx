import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { Credits } from "@/components/credits";
import { DiscordActivitySection } from "@/components/discord-activity";
import { PersonHeader } from "@/components/person-header";
import { Reveal } from "@/components/reveal";
import { hasItems, portfolioConfig, px, sectionTitle } from "@/lib/portfolio-config";
import { renderRichText } from "@/lib/rich-text";

// ── Data ──────────────────────────────────────────────────────────────────────

const { about: ABOUT, workExperience: WORK_EXPERIENCE, education: EDUCATION, projects: PROJECTS, skills: SKILLS, certifications: CERTIFICATIONS, blog: BLOG } = portfolioConfig;

const MAX_PROJECT_TAGS = 3;
const MAX_WORK_EXPERIENCE_TAGS = 5;
const MAX_BLOG_TAGS = 3;

// ── Sub-components ────────────────────────────────────────────────────────────

function SecondaryBadge({ children, truncate }: { children: React.ReactNode; truncate?: boolean }) {
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

function DarkBadge({ children }: { children: React.ReactNode }) {
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const blogPosts = BLOG?.enabled ? getAllPosts() : [];

  return (
    <>
      <main
        style={{ maxWidth: px(1400) }}
        className="relative mx-auto scroll-my-12 overflow-auto p-4 md:p-16 print:p-11"
      >
        <div className="mx-auto w-full max-w-2xl space-y-8 print:space-y-4" style={{ backgroundColor: "hsl(var(--background))" }}>

          {/* ── Header ── */}
          <Reveal>
            <PersonHeader />
          </Reveal>

          {/* ── About ── */}
          {ABOUT && (
            <Reveal>
              <section className="flex min-h-0 flex-col gap-y-3 print:gap-y-1">
                <h2 className="text-xl font-bold">{sectionTitle("about")}</h2>
                {(Array.isArray(ABOUT.text) ? ABOUT.text : [ABOUT.text]).map((paragraph, i) => (
                  <p key={i} className="font-mono text-sm text-pretty break-words" style={{ color: "hsl(var(--foreground) / 0.8)" }}>
                    {renderRichText(paragraph)}
                  </p>
                ))}
              </section>
            </Reveal>
          )}

          {/* ── Work Experience ── */}
          {hasItems(WORK_EXPERIENCE) && (
            <Reveal>
            <section className="flex min-h-0 flex-col gap-y-3 print:gap-y-1">
              <h2 className="text-xl font-bold">{sectionTitle("workExperience")}</h2>
              <div className="flex flex-col gap-y-4">
                {WORK_EXPERIENCE.map((job) => (
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
                            {job.tags.slice(0, MAX_WORK_EXPERIENCE_TAGS).map((tag) => <li key={tag}><SecondaryBadge>{tag}</SecondaryBadge></li>)}
                          </ul>
                        </h3>
                        <div className="text-sm tabular-nums shrink-0" style={{ color: "#6b7280" }}>{job.period}</div>
                      </div>
                      <h4 className="break-words font-mono text-sm font-semibold leading-none print:text-[12px]">{job.role}</h4>
                      <ul className="flex list-none flex-wrap gap-1 p-0 lg:hidden">
                        {job.tags.slice(0, MAX_WORK_EXPERIENCE_TAGS).map((tag) => <li key={tag}><SecondaryBadge>{tag}</SecondaryBadge></li>)}
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
          )}

          {/* ── Education ── */}
          {hasItems(EDUCATION) && (
            <Reveal>
            <section className="flex min-h-0 flex-col gap-y-3 print:gap-y-1">
              <h2 className="text-xl font-bold">{sectionTitle("education")}</h2>
              <div className="flex flex-col gap-y-4">
                {EDUCATION.map((edu) => (
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
          )}

          {/* ── Projects ── */}
          {hasItems(PROJECTS) && (
            <Reveal>
            <section className="flex min-h-0 flex-col gap-y-3 print:gap-y-1">
              <h2 className="text-xl font-bold">{sectionTitle("projects")}</h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {PROJECTS.map((project) => {
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
                              <SecondaryBadge truncate>{tag}</SecondaryBadge>
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
          )}

          {/* ── Skills ── */}
          {hasItems(SKILLS) && (
            <Reveal>
            <section className="flex min-h-0 flex-col gap-y-3 print:gap-y-1">
              <h2 className="text-xl font-bold">{sectionTitle("skills")}</h2>
              <ul className="flex list-none flex-wrap gap-1 p-0">
                {SKILLS.map((skill) => <li key={skill}><DarkBadge>{skill}</DarkBadge></li>)}
              </ul>
            </section>
            </Reveal>
          )}

          {/* ── Certifications ── */}
          {hasItems(CERTIFICATIONS) && (
            <Reveal>
            <section className="flex min-h-0 flex-col gap-y-3 print:gap-y-1">
              <h2 className="text-xl font-bold">{sectionTitle("certifications")}</h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {CERTIFICATIONS.map((cert) => {
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
          )}

          {/* ── Blog ── */}
          {BLOG?.enabled && (
            <Reveal>
            <section className="flex min-h-0 flex-col gap-y-3 print:gap-y-1">
              <h2 className="text-xl font-bold">{sectionTitle("blog")}</h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {blogPosts.map((post) => (
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
                              <SecondaryBadge truncate>{tag}</SecondaryBadge>
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
          )}

          {/* ── Activity ── */}
          <Reveal>
            <DiscordActivitySection />
          </Reveal>
        </div>

        <Reveal className="mt-8" atPageEnd>
          <Credits />
        </Reveal>
      </main>
    </>
  );
}
