import { CircleQuestionMark, FileText, Globe, Mail, MapPin, Phone, Rss } from "lucide-react";
import Link from "next/link";
import { DiscordStatusDot } from "@/components/discord-activity";
import { makePx, type PortfolioConfigInput } from "@/lib/portfolio-config";
import { BRAND_ICON_PATHS, resolveIconKey, type BrandIconKey, type SocialIconKey } from "@/lib/social-icons";

// ── Icons ─────────────────────────────────────────────────────────────────────
function BrandIcon({ path, size }: { path: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

// `icon` is an unconstrained string in the schema, so anything the template
// doesn't ship renders as a question mark rather than an empty button.
function socialIcon(icon: unknown, size: number): React.ReactNode {
  const key = resolveIconKey(icon);
  if (!key) return <CircleQuestionMark size={size} />;

  const generic: Partial<Record<SocialIconKey, React.ReactNode>> = {
    email: <Mail size={size} />,
    resume: <FileText size={size} />,
    website: <Globe size={size} />,
    phone: <Phone size={size} />,
    rss: <Rss size={size} />,
    location: <MapPin size={size} />,
  };
  if (generic[key]) return generic[key];

  const path = BRAND_ICON_PATHS[key as BrandIconKey];
  return path ? <BrandIcon path={path} size={size} /> : <CircleQuestionMark size={size} />;
}

function SocialButton({ href, label, size, children }: { href: string; label: string; size: number; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex items-center justify-center rounded-md transition-colors hover:bg-accent"
      style={{
        width: size, height: size, flexShrink: 0,
        border: "1px solid hsl(var(--input))",
        color: "hsl(var(--foreground))",
        textDecoration: "none",
      }}
    >
      {children}
    </a>
  );
}

export function PersonHeader({ config }: { config: PortfolioConfigInput }) {
  const person = config.person;
  const px = makePx(config);

  return (
    <header className="flex items-center justify-between">
      <div className="min-w-0 flex-1 space-y-1.5">
        <h1 className="flex items-center gap-x-2 text-2xl font-bold">
          <span className="min-w-0 break-words">{person.name}</span>
          <span className="shrink-0 print:hidden">
            <DiscordStatusDot config={config.discordActivity} />
          </span>
        </h1>
        <p className="max-w-md text-pretty break-words font-mono text-sm" style={{ color: "hsl(var(--foreground) / 0.8)" }}>
          {person.title}
        </p>
        <p className="max-w-md items-center text-pretty font-mono text-xs" style={{ color: "hsl(var(--foreground))" }}>
          <span className="inline-flex max-w-full gap-x-1.5 align-baseline leading-none">
            <Globe size={px(12)} className="shrink-0" />
            <span className="min-w-0 break-words">{person.location}</span>
          </span>
        </p>
        {/* The list is unbounded, so it wraps instead of overflowing. */}
        <div className="flex flex-wrap gap-1 pt-1 font-mono text-sm print:hidden">
          {person.social.map((s) => (
            <SocialButton key={s.label} href={s.href} label={s.label} size={px(32)}>
              {socialIcon(s.icon, px(16))}
            </SocialButton>
          ))}
        </div>
      </div>
      <Link href="/" style={{ position: "relative", display: "flex", flexShrink: 0, overflow: "hidden", borderRadius: px(12), width: px(112), height: px(112) }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img style={{ aspectRatio: "1/1", height: "100%", width: "100%", objectFit: "cover" }} src={person.avatar} alt={person.name} />
      </Link>
    </header>
  );
}
