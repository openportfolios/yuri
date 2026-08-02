// Paths under github.com that are never a repository.
const RESERVED_OWNERS = new Set([
  "orgs", "features", "topics", "collections", "sponsors", "marketplace",
  "explore", "settings", "notifications", "pulls", "issues", "about",
  "pricing", "login", "join", "search", "apps", "enterprise",
]);

// Extracts "owner/repo" from a GitHub repository URL, or null when the href
// points anywhere else (personal sites, gists, profiles, non-GitHub links).
// Lives outside github-stars.tsx so server components can call it too.
export function parseGitHubRepo(href: string | undefined | null): string | null {
  if (!href) return null;
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, "");
  if (host !== "github.com") return null;

  const [owner, repo] = url.pathname.split("/").filter(Boolean);
  if (!owner || !repo) return null;
  if (RESERVED_OWNERS.has(owner.toLowerCase())) return null;

  return `${owner}/${repo.replace(/\.git$/, "")}`;
}
