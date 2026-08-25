import { CircleQuestionMark, FileText, Globe, Mail, MapPin, Phone, Rss } from "lucide-react";
import Link from "next/link";
import { DiscordStatusDot } from "@/components/discord-activity";
import { hasItems, makePx, personAvatar, personEmail, personLocation, personName, personTitle, type PortfolioConfigInput } from "@/lib/portfolio-config";
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
  const name = personName(config);
  const title = personTitle(config);
  const email = personEmail(config);
  const location = personLocation(config);
  const avatar = personAvatar(config);
  const px = makePx(config);
  // Whatever is filled in first has to sit flush with the top of the header,
  // so the social row only gets its extra top padding when a text line
  // actually precedes it. The same flag drives the avatar: with no text beside
  // it there is no row height to match, so it falls back to its own size.
  const hasIdentityText = Boolean(name || title || email || location);

  return (
    <header className="space-y-1.5">
      {/* The avatar is taken out of flow and pinned to the top and bottom of
          this row — which spans the name through the location, not the social
          row below — so its height is the height of that block and the square
          ratio derives its width from it. In flow it would instead be sized
          from the space left over, which is a different number entirely. The
          row reserves that space with padding, keeping the text column exactly
          as wide as it was when the avatar had a fixed size. */}
      <div className="relative" style={avatar ? { paddingRight: px(112 + 16), minHeight: hasIdentityText ? undefined : px(112) } : undefined}>
        <div className="min-w-0 space-y-1.5">
          {/* No name means no heading at all — the status dot would otherwise
              float on an empty line. */}
          {name && (
            <h1 className="flex items-center gap-x-3 text-2xl font-bold">
              <span className="min-w-0 break-words">{name}</span>
              <span className="shrink-0 print:hidden">
                <DiscordStatusDot config={config.discordActivity} />
              </span>
            </h1>
          )}
          {title && (
            <p className="max-w-md text-pretty break-words font-mono text-sm" style={{ color: "hsl(var(--foreground) / 0.8)" }}>
              {title}
            </p>
          )}
          {email && (
            <p className="max-w-md items-center text-pretty font-mono text-xs" style={{ color: "hsl(var(--foreground))" }}>
              <a
                href={`mailto:${email}`}
                className="inline-flex max-w-full gap-x-1.5 align-baseline leading-none hover:underline"
                style={{ color: "inherit", textDecorationColor: "currentColor" }}
              >
                <Mail size={px(12)} className="shrink-0" />
                <span className="min-w-0 break-all">{email}</span>
              </a>
            </p>
          )}
          {location && (
            <p className="max-w-md items-center text-pretty font-mono text-xs" style={{ color: "hsl(var(--foreground))" }}>
              <span className="inline-flex max-w-full gap-x-1.5 align-baseline leading-none">
                <Globe size={px(12)} className="shrink-0" />
                <span className="min-w-0 break-words">{location}</span>
              </span>
            </p>
          )}
        </div>
        {/* Without an avatar the link itself is dropped too — an empty `src`
            leaves the browser's broken-image box inside the rounded frame. */}
        {avatar && (
          <Link
            href="/"
            style={{
              position: "absolute", top: 0, bottom: 0, right: 0,
              width: "auto", aspectRatio: "1 / 1",
              // Never wider than the space the row reserved: an unusually tall
              // text block would otherwise push the square over the text.
              maxHeight: px(112), maxWidth: px(112),
              display: "flex", overflow: "hidden", borderRadius: px(12), padding: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img style={{ display: "block", height: "100%", width: "100%", objectFit: "cover" }} src={avatar} alt={name ?? ""} />
          </Link>
        )}
      </div>
      {/* The list is unbounded, so it wraps instead of overflowing. */}
      {hasItems(person.social) && (
        <div className={`flex flex-wrap gap-1 font-mono text-sm print:hidden${hasIdentityText ? " pt-1" : ""}`}>
          {person.social.map((s) => (
            <SocialButton key={s.label} href={s.href} label={s.label} size={px(32)}>
              {socialIcon(s.icon, px(16))}
            </SocialButton>
          ))}
        </div>
      )}
    </header>
  );
}
