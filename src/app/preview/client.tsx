"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { validateConfig } from "@openportfolios/schema";
import { Portfolio, type PortfolioBlogPost } from "@/components/portfolio";
import {
  BASE_FONT_SIZE_PX,
  scaleMultiplierFor,
  type PortfolioConfigInput,
} from "@/lib/portfolio-config";

const CONFIG_MESSAGE_TYPE = "openportfolios:config";

// Renders the portfolio from configs sent by a parent window (typically an
// editor embedding this route in an iframe):
//
//   iframe.contentWindow.postMessage({ type: "openportfolios:config", config }, "*")
//
// Messages are accepted from any origin — the editor host is unknown at
// build time — but only applied when the payload passes the official
// @openportfolios/schema validation; everything else is ignored. The raw
// input object is stored (not Zod's parsed output) because Zod normalizes
// key order to schema order, which would break the key-order-driven section
// reordering in sectionOrder().
export function PreviewClient({ defaultConfig, posts }: { defaultConfig: PortfolioConfigInput; posts: PortfolioBlogPost[] }) {
  const [config, setConfig] = useState<PortfolioConfigInput>(defaultConfig);
  const { setTheme } = useTheme();

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data: unknown = event.data;
      if (typeof data !== "object" || data === null) return;
      if ((data as { type?: unknown }).type !== CONFIG_MESSAGE_TYPE) return;

      const candidate = (data as { config?: unknown }).config;
      const result = validateConfig(candidate);
      if (!result.success) {
        console.debug("[preview] ignoring invalid config:", result.errors);
        return;
      }
      setConfig(candidate as PortfolioConfigInput);
    }

    window.addEventListener("message", onMessage);
    // Tell the embedding editor the preview is ready to receive configs.
    if (window.parent !== window) {
      window.parent.postMessage({ type: "openportfolios:ready" }, "*");
    }
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // The root font size lives on <html> (set by the layout from the repo
  // config), outside this tree — keep it in sync with the previewed scale.
  const rootFontSize = scaleMultiplierFor(config) * BASE_FONT_SIZE_PX;
  useEffect(() => {
    document.documentElement.style.fontSize = `${rootFontSize}px`;
    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [rootFontSize]);

  const defaultTheme = config.meta.defaultTheme;
  useEffect(() => {
    if (defaultTheme) setTheme(defaultTheme);
  }, [defaultTheme, setTheme]);

  return <Portfolio config={config} posts={posts} />;
}
