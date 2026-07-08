import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { portfolioConfig } from "@/lib/portfolio-config";
import { PreviewClient } from "./client";

// Live-preview surface for external editors: renders the portfolio from
// configs posted via window.postMessage (see ./client.tsx). Not meant to be
// discovered organically.
export const metadata: Metadata = {
  robots: { index: false },
};

export default function PreviewPage() {
  // Unlike the home page, posts are loaded even when the repo config has the
  // blog disabled, so a posted config that enables it previews correctly.
  const posts = getAllPosts().map(({ slug, title, description, tags, date }) => ({
    slug,
    title,
    description,
    tags,
    date,
  }));

  return <PreviewClient defaultConfig={portfolioConfig} posts={posts} />;
}
