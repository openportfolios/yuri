"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { px } from "@/lib/portfolio-config";

export function ThemeToggle() {
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
        width: px(32), height: px(32), flexShrink: 0,
        border: "1px solid hsl(var(--input))",
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
      }}
    >
      {mounted && resolvedTheme === "dark" ? <Sun size={px(16)} /> : <Moon size={px(16)} />}
    </button>
  );
}
