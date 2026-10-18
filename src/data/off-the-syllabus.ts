import { site } from "./site";

/**
 * "Off the Syllabus": its name, its routes and the whole of the plan
 * (`origan-internal/docs/off-the-syllabus-plan.md`).
 *
 * It is a collection of stand-alone articles, not a course. Articles are read
 * in any order, small series group related ones, and each article links to
 * the next in its series.
 *
 * This is the plan, not the list of what is live. An article is live when its
 * MDX file exists in `src/content/learn/off-the-syllabus/`, and
 * `ots-articles.test.ts` fails if a file and an entry here disagree. The rest
 * show on the index as "Coming next", without links.
 */
export const offTheSyllabus = {
  name: "Off the Syllabus",
  descriptor: "Web and tools",
  /** The index heading, with one accented word. */
  heading: "Off the [Syllabus]",
  path: "/learn/off-the-syllabus/",
  tagline: "The things college doesn't teach you but the job uses every day.",
  // Said plainly, because it is also the search term.
  description:
    "Off the Syllabus is a growing set of free, stand-alone articles about the web and the tools you build it with: Core Web Vitals, structured data, API clients and how a browser loads a page. Every claim links to its source.",
  /** What the share card and the Resources card say. */
  summary: "The things college doesn't teach you but the job uses every day.",
  provider: {
    name: site.studio,
    url: site.labsUrl,
  },
} as const;

export type SeriesId = "fast-pages" | "being-found" | "tools" | "how-things-work" | "found-here";

export type Series = {
  id: SeriesId;
  /** The plain name, as shown in the sidebar and the article header. */
  name: string;
  /** The heading above the series on the index, with one accented word. */
  heading: string;
  /** The line under that heading. */
  sub: string;
};

export const otsSeries: readonly Series[] = [
  { id: "fast-pages", name: "Fast pages", heading: "Fast [pages]", sub: "The numbers Google watches, and how to read them." },
  { id: "being-found", name: "Being found", heading: "Being [found]", sub: "How search engines and AI tools learn what your page is." },
  { id: "tools", name: "Tools worth knowing", heading: "Tools worth [knowing]", sub: "Compared fairly, with a plain \"use this when\" for each." },
  { id: "how-things-work", name: "How things actually work", heading: "How things actually [work]", sub: "What the browser and the network do while you wait." },
  { id: "found-here", name: "Found while building this site", heading: "Found while building this [site]", sub: "Short, honest notes from real problems on Origan." },
];

export type PlanEntry = {
  /** The number in the plan. It is also the number shown beside the title. */
  order: number;
  slug: string;
  series: SeriesId;
  title: string;
  /** One line on what it covers. Shown on the index, for written and unwritten articles alike. */
  angle: string;
};

/** Fifteen articles. Slugs are the URL, so they do not change once published. */
export const otsPlan: readonly PlanEntry[] = [
  { order: 1, slug: "core-web-vitals", series: "fast-pages", title: "LCP, CLS and INP in plain words", angle: "What each Core Web Vital measures, and why it matters" },
  { order: 2, slug: "reading-pagespeed", series: "fast-pages", title: "Reading a PageSpeed Insights report without panicking", angle: "Field data, lab data, and which numbers to trust" },
  { order: 3, slug: "images-done-right", series: "fast-pages", title: "Images done right", angle: "AVIF, WebP, sizes, and lazy loading" },
  { order: 4, slug: "fonts-without-the-flash", series: "fast-pages", title: "Fonts without the flash", angle: "Why text jumps when a page loads, and how to stop it" },
  { order: 5, slug: "json-ld", series: "being-found", title: "JSON-LD: the hidden data that describes your page", angle: "Origan's own site as the worked example" },
  { order: 6, slug: "sitemaps-robots-indexnow", series: "being-found", title: "Sitemaps, robots.txt and IndexNow", angle: "Telling search engines what is new" },
  { order: 7, slug: "share-cards", series: "being-found", title: "Share cards", angle: "Why some links get a nice preview on WhatsApp and LinkedIn" },
  { order: 8, slug: "api-clients", series: "tools", title: "API clients compared", angle: "Postman, Bruno, Insomnia, Hoppscotch and curl, with a fair \"use this when\"" },
  { order: 9, slug: "tauri-vs-electron", series: "tools", title: "Tauri vs Electron", angle: "Desktop apps from web skills, and what each costs" },
  { order: 10, slug: "git-rescue-kit", series: "tools", title: "Git's rescue kit", angle: "reflog, bisect and stash" },
  { order: 11, slug: "typing-a-url", series: "how-things-work", title: "What happens when you type a URL", angle: "From DNS to the first painted pixel" },
  { order: 12, slug: "cors-explained", series: "how-things-work", title: "CORS, finally explained", angle: "Why your fetch gets blocked, and what the error says" },
  { order: 13, slug: "browser-and-javascript-engines", series: "how-things-work", title: "Browser engines and JavaScript engines", angle: "WebKit, Blink and Gecko; V8, JavaScriptCore and SpiderMonkey" },
  { order: 14, slug: "svh-on-phones", series: "found-here", title: "Why 100vh breaks on phones, and the svh fix", angle: "A real fix from this site" },
  { order: 15, slug: "permission-denied-in-ci", series: "found-here", title: "\"Permission denied\" in CI", angle: "File permissions that came from Windows" },
];

/**
 * The topic pills on the Resources card: what is inside, before you open it.
 * Only topics of articles that are live. `ots-articles.test.ts` holds this to
 * the topics the live articles declare, so a pill never promises a page that
 * does not exist.
 */
export const otsTopics: readonly string[] = ["Core Web Vitals", "LCP", "CLS", "INP"];

export const seriesOf = (id: SeriesId): Series => {
  const series = otsSeries.find((s) => s.id === id);
  if (!series) throw new Error(`Unknown series "${id}"`);
  return series;
};

export const articlePath = (slug: string) => `${offTheSyllabus.path}${slug}/`;
export const articleUrl = (slug: string) => `${site.url}${articlePath(slug)}`;
export const indexUrl = () => `${site.url}${offTheSyllabus.path}`;
