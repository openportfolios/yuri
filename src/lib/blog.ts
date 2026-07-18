import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  content: string;
};

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

const PT_MONTHS: Record<string, number> = {
  janeiro: 0, fevereiro: 1, "março": 2, marco: 2, abril: 3, maio: 4, junho: 5,
  julho: 6, agosto: 7, setembro: 8, outubro: 9, novembro: 10, dezembro: 11,
};

// Post dates may be written as ISO ("2026-03-31"), pt-BR long form
// ("31 de março de 2026"), or English long form ("March 31, 2026").
function parsePostDate(date: string): number {
  const isoMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return Date.UTC(Number(year), Number(month) - 1, Number(day));
  }

  const ptMatch = date.match(/^(\d{1,2})\s+de\s+([a-zàâãéêíóôõúç]+)\s+de\s+(\d{4})$/i);
  if (ptMatch) {
    const [, day, monthName, year] = ptMatch;
    const month = PT_MONTHS[monthName.toLowerCase()];
    if (month !== undefined) {
      return Date.UTC(Number(year), month, Number(day));
    }
  }

  const parsed = Date.parse(date);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title as string,
        description: data.description as string,
        tags: (data.tags as string[]) ?? [],
        date: data.date as string,
        content,
      };
    })
    .sort((a, b) => parsePostDate(b.date) - parsePostDate(a.date));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const filepath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filepath)) return undefined;
  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title as string,
    description: data.description as string,
    tags: (data.tags as string[]) ?? [],
    date: data.date as string,
    content,
  };
}
