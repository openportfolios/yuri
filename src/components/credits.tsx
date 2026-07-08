import { makePx, uiString, type PortfolioConfigInput } from "@/lib/portfolio-config";

export function Credits({ config }: { config: PortfolioConfigInput }) {
  if (!(config.meta.credits ?? true)) return null;

  const px = makePx(config);

  return (
    <p
      className="text-center font-mono print:hidden"
      style={{ fontSize: `${px(10)}px`, color: "hsl(var(--muted-foreground))" }}
    >
      {uiString(config, "builtWith")}{" "}
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
