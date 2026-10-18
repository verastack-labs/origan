import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { otsPlan, seriesOf, type PlanEntry, type Series, type SeriesId } from "@/data/off-the-syllabus";

/**
 * The articles of Off the Syllabus, read from `src/content/learn/off-the-syllabus/`
 * at build time. The same idea as `lessons.ts`, but an article is not a
 * lesson: it has a series, a "last checked" date, a short version and a list of
 * sources, all in its front matter.
 *
 * Node-only. Every route that uses this is prerendered, so the files are read
 * once during `next build` and nothing is fetched in the browser.
 */
export const ARTICLES_DIR = ["src", "content", "learn", "off-the-syllabus"] as const;

export type Source = { readonly title: string; readonly url: string };

export type Article = {
  slug: string;
  /** The page heading. */
  title: string;
  /** The one-line summary under the heading. */
  sub: string;
  /** For search results and link previews. */
  description: string;
  /** The number in the plan, shown beside the title in the sidebar. */
  order: number;
  series: SeriesId;
  /** ISO date, YYYY-MM-DD: when the article first went up. */
  published: string;
  /** ISO date, YYYY-MM-DD: when every fact in it was last checked against its source. */
  checked: string;
  /** What the article is about, for the topic pills and the structured data. */
  topics: readonly string[];
  /** Three or four lines for skimmers. */
  short: readonly string[];
  sources: readonly Source[];
  /** The MDX body, front matter removed. */
  body: string;
};

const asDate = (value: unknown, key: string, file: string) => {
  const text = value instanceof Date ? value.toISOString().slice(0, 10) : value;
  if (typeof text !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    throw new Error(`${file}: front matter "${key}" must be a date like 2026-10-18`);
  }
  return text;
};

export function parseArticle(raw: string, file: string): Article {
  const { data, content } = matter(raw);
  const str = (key: string) => {
    const value = data[key];
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(`${file}: front matter "${key}" must be a non-empty string`);
    }
    return value;
  };
  const strings = (key: string) => {
    const value = data[key];
    if (!Array.isArray(value) || value.length === 0 || value.some((v) => typeof v !== "string" || v.trim() === "")) {
      throw new Error(`${file}: front matter "${key}" must be a list of non-empty strings`);
    }
    return value as string[];
  };
  const order = data.order;
  if (typeof order !== "number" || !Number.isInteger(order)) {
    throw new Error(`${file}: front matter "order" must be a whole number`);
  }
  const series = str("series");
  seriesOf(series as SeriesId);

  const sources = data.sources;
  if (
    !Array.isArray(sources) ||
    sources.length === 0 ||
    sources.some((s) => typeof s?.title !== "string" || typeof s?.url !== "string")
  ) {
    throw new Error(`${file}: front matter "sources" must be a list of { title, url }`);
  }

  return {
    slug: str("slug"),
    title: str("title"),
    sub: str("sub"),
    description: str("description"),
    order,
    series: series as SeriesId,
    published: asDate(data.published, "published", file),
    checked: asDate(data.checked, "checked", file),
    topics: strings("topics"),
    short: strings("short"),
    sources: sources as Source[],
    body: content,
  };
}

let cached: Article[] | undefined;

/** Every published article, in the order of the plan. */
export function getArticles(): Article[] {
  // In development the files are read each time, so an edit to an article shows on reload.
  if (!cached || process.env.NODE_ENV === "development") {
    const dir = join(process.cwd(), ...ARTICLES_DIR);
    cached = readdirSync(dir)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => parseArticle(readFileSync(join(dir, f), "utf8"), f))
      .sort((a, b) => a.order - b.order);
  }
  return cached;
}

export function getArticle(slug: string): Article | undefined {
  return getArticles().find((a) => a.slug === slug);
}

// --- reading time and headings ----------------------------------------------------

/** Words per minute used for the read time. A plain, common figure for reading prose on screen. */
export const WORDS_PER_MINUTE = 200;

/** The body with fenced code and JSX tags taken out, so only prose is counted. */
export function proseOf(body: string): string {
  return body
    .replace(/^```[\s\S]*?^```/gm, " ")
    .replace(/<[A-Za-z][^>]*\/>/g, " ")
    .replace(/<\/?[A-Za-z][^>]*>/g, " ")
    .replace(/[#*_`>|]/g, " ");
}

export const wordCount = (body: string) => proseOf(body).split(/\s+/).filter(Boolean).length;

/** Whole minutes, never less than one. Counts the short version too, because it is read too. */
export function readMinutes(article: Pick<Article, "body" | "short">): number {
  const words = wordCount(article.body) + wordCount(article.short.join(" "));
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/** An anchor for a heading: lower case, letters and digits, joined by hyphens. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    // "Origan's" is one word, not "origan" and "s".
    .replace(/['’]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type Heading = { readonly id: string; readonly label: string };

/** The `##` headings of an article, outside code fences, with the anchors the page gives them. */
export function headingsOf(body: string): Heading[] {
  const out: Heading[] = [];
  let fenced = false;
  for (const line of body.split(/\r?\n/)) {
    if (/^```/.test(line)) fenced = !fenced;
    if (fenced) continue;
    const match = /^## (.+?)\s*$/.exec(line);
    if (match) out.push({ id: slugify(match[1]), label: match[1] });
  }
  return out;
}

// --- the series -----------------------------------------------------------------------

/** What "Next in this series" shows: the following article of the same series, written or not. */
export type NextInSeries =
  | { kind: "article"; entry: PlanEntry }
  | { kind: "coming"; entry: PlanEntry }
  | { kind: "last"; series: Series };

export function nextInSeries(slug: string, published: ReadonlySet<string>): NextInSeries {
  const here = otsPlan.find((e) => e.slug === slug);
  if (!here) throw new Error(`"${slug}" is not in the plan`);
  const later = otsPlan.find((e) => e.series === here.series && e.order > here.order);
  if (!later) return { kind: "last", series: seriesOf(here.series) };
  return { kind: published.has(later.slug) ? "article" : "coming", entry: later };
}
