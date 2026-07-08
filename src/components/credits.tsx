import { portfolioConfig, px, uiString } from "@/lib/portfolio-config";

const CREDITS_ENABLED = portfolioConfig.meta.credits ?? true;

export function Credits() {
  if (!CREDITS_ENABLED) return null;

  return (
    <p
      className="text-center font-mono print:hidden"
      style={{ fontSize: `${px(10)}px`, color: "hsl(var(--muted-foreground))" }}
    >
      {uiString("builtWith")}{" "}
      <a
        href="https://github.com/openportfolios/yuri"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
      >
        OpenPortfolios
      </a>
    </p>
  );
}
