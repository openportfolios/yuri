"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { px } from "@/lib/portfolio-config";

// Sizes default to the repo config's scale; the <Portfolio /> tree passes
// them explicitly so a live preview with a different scale stays correct.
export function ThemeToggle({ buttonSize = px(32), iconSize = px(16) }: { buttonSize?: number; iconSize?: number }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="inline-flex cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-accent"
      style={{
        width: buttonSize, height: buttonSize, flexShrink: 0,
        border: "1px solid hsl(var(--input))",
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
      }}
    >
      {mounted && resolvedTheme === "dark" ? <Sun size={iconSize} /> : <Moon size={iconSize} />}
    </button>
  );
}
