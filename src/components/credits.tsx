import { portfolioConfig, px, uiString } from "@/lib/portfolio-config";

const CREDITS = portfolioConfig.credits;

export function Credits() {
  if (!CREDITS?.enabled) return null;

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
