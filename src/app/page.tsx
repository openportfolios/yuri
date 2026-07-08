import { getAllPosts } from "@/lib/blog";
import { Portfolio } from "@/components/portfolio";
import { portfolioConfig } from "@/lib/portfolio-config";

export default function Home() {
  const posts = portfolioConfig.blog?.enabled ? getAllPosts() : [];
  return <Portfolio config={portfolioConfig} posts={posts} />;
}
