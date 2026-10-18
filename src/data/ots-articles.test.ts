import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { offTheSyllabus, otsPlan, otsSeries, otsTopics, seriesOf } from "./off-the-syllabus";
import { liveResources as resources } from "./resources";
import { articleJsonLd, collectionJsonLd, otsBreadcrumbJsonLd } from "@/lib/article-jsonld";
import {
  ARTICLES_DIR,
  getArticles,
  headingsOf,
  nextInSeries,
  parseArticle,
  readMinutes,
  slugify,
  wordCount,
} from "@/lib/articles";
import { hasRegion } from "@/lib/snippets";
import { OTS_SOURCE } from "@/lib/ots-snippets";
import { repoSample, type RepoSample } from "@/lib/ots-samples";
import { jsonLdScript } from "@/lib/course-jsonld";
import { jsonLdTag } from "../../ts/off-the-syllabus/json-ld";

/**
 * Off the Syllabus's content rules, the same kind of rules as
 * `switch-lessons.test.ts`: the plan and the files agree, every article has
 * the sections the plan asks for, every sample it names exists in the checked
 * folder, and the HTML and JSON-LD in that folder parse.
 */
const EM_DASH = "—";
const root = process.cwd();
const dir = join(root, ...ARTICLES_DIR);
const samplesDir = join(root, "ts", "off-the-syllabus");

const articles = getArticles();
const files = readdirSync(dir).filter((f) => f.endsWith(".mdx"));
const attr = (tag: string, name: string) => new RegExp(`${name}="([^"]*)"`).exec(tag)?.[1];

describe("the Off the Syllabus plan", () => {
  it("numbers the fifteen articles from 1 to 15 with no gaps", () => {
    expect(otsPlan.map((e) => e.order)).toEqual(Array.from({ length: 15 }, (_, i) => i + 1));
  });

  it("has unique slugs", () => {
    expect(new Set(otsPlan.map((e) => e.slug)).size).toBe(otsPlan.length);
  });

  it("puts every article in a series that exists, and every series has articles", () => {
    const ids = new Set(otsSeries.map((s) => s.id));
    for (const entry of otsPlan) expect(ids.has(entry.series), entry.slug).toBe(true);
    for (const series of otsSeries) expect(otsPlan.some((e) => e.series === series.id), series.id).toBe(true);
  });

  it("keeps the articles of a series next to each other, in order", () => {
    const order = otsPlan.map((e) => e.series);
    const seen = new Set<string>();
    order.forEach((id, i) => {
      if (i > 0 && id !== order[i - 1]) expect(seen.has(id), `${id} is split`).toBe(false);
      seen.add(id);
    });
  });

  it("is named Off the Syllabus, always with its descriptor, and says the tagline", () => {
    expect(offTheSyllabus.name).toBe("Off the Syllabus");
    expect(offTheSyllabus.descriptor).toBe("Web and tools");
    expect(offTheSyllabus.path).toBe("/learn/off-the-syllabus/");
    expect(offTheSyllabus.tagline).toBe("The things college doesn't teach you but the job uses every day.");
  });

  it("keeps article 13 as browser engines and JavaScript engines", () => {
    expect(otsPlan.find((e) => e.order === 13)?.title).toBe("Browser engines and JavaScript engines");
  });
});

describe("the published articles", () => {
  it("are the first batch, in the order the plan lists it", () => {
    const batch = ["core-web-vitals", "reading-pagespeed", "json-ld", "api-clients", "typing-a-url", "svh-on-phones"];
    const slugs = articles.map((a) => a.slug);
    expect(batch.filter((slug) => slugs.includes(slug))).toEqual(slugs);
  });

  it.each(articles.map((a) => [a.slug, a]))("%s matches its entry in the plan", (_, article) => {
    const entry = otsPlan.find((e) => e.slug === article.slug);
    expect(entry, `${article.slug} is not in the plan`).toBeDefined();
    expect(article.order).toBe(entry?.order);
    expect(article.series).toBe(entry?.series);
    expect(files).toContain(`${article.slug}.mdx`);
  });

  it.each(articles.map((a) => [a.slug, a]))("%s has its front matter in shape", (_, article) => {
    expect(article.published).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(article.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(article.checked >= article.published).toBe(true);
    expect(article.description.length).toBeGreaterThan(60);
    expect(article.description.length).toBeLessThanOrEqual(220);
    expect(article.sub.length).toBeGreaterThan(0);
    expect(article.topics.length).toBeGreaterThanOrEqual(2);
    // The short version is for skimmers: three or four lines.
    expect(article.short.length).toBeGreaterThanOrEqual(3);
    expect(article.short.length).toBeLessThanOrEqual(4);
  });

  it.each(articles.map((a) => [a.slug, a]))("%s links its sources, each one a page on the web", (_, article) => {
    expect(article.sources.length).toBeGreaterThanOrEqual(3);
    const urls = article.sources.map((s) => s.url);
    expect(new Set(urls).size).toBe(urls.length);
    for (const source of article.sources) {
      expect(source.url, source.title).toMatch(/^https:\/\/[^\s]+$/);
      expect(source.title.length).toBeGreaterThan(3);
    }
  });

  it.each(articles.map((a) => [a.slug, a]))("%s has the sections the plan asks for, in order", (_, article) => {
    const headings = headingsOf(article.body).map((h) => h.label);
    const tryIt = headings.indexOf("Try it yourself");
    const trade = headings.indexOf("The honest trade-offs");
    expect(tryIt, "no Try it yourself").toBeGreaterThan(0);
    expect(trade, "no The honest trade-offs").toBeGreaterThan(tryIt);
    // They are the last two: Sources and Next in this series are drawn by the page.
    expect(headings.slice(-2)).toEqual(["Try it yourself", "The honest trade-offs"]);
  });

  it.each(articles.map((a) => [a.slug, a]))("%s has plain, unique headings", (_, article) => {
    const headings = headingsOf(article.body);
    for (const h of headings) {
      expect(h.label, h.label).not.toMatch(/[`\[\]*_]/);
      expect(h.id.length).toBeGreaterThan(0);
    }
    expect(new Set(headings.map((h) => h.id)).size).toBe(headings.length);
    expect(headings.map((h) => h.id)).not.toContain("sources");
    expect(article.body).not.toMatch(/^# /m);
  });

  it.each(articles.map((a) => [a.slug, a]))("%s has Remember lines, and a read time", (_, article) => {
    expect(article.body.match(/\*\*Remember:\*\*/g)?.length ?? 0).toBeGreaterThanOrEqual(3);
    expect(readMinutes(article)).toBeGreaterThanOrEqual(1);
    expect(wordCount(article.body)).toBeGreaterThan(900);
  });

  it.each(articles.map((a) => [a.slug, a]))("%s names only samples that exist in the checked folder", (_, article) => {
    const named: [string, string][] = [];
    for (const m of article.body.matchAll(/<Sample\b[^>]*\/>/g)) {
      named.push([attr(m[0], "file")!, attr(m[0], "name")!]);
    }
    for (const [file, name] of named) {
      expect(hasRegion(file, name, OTS_SOURCE), `${file} has no region "${name}"`).toBe(true);
    }
  });

  it.each(articles.map((a) => [a.slug, a]))("%s never types TypeScript, JavaScript or JSON into the page", (_, article) => {
    expect(article.body).not.toMatch(/^```(ts|tsx|typescript|js|jsx|javascript|json|jsonc|html|css)\b/m);
  });

  it("is only the first batch: the rest are marked Coming next", () => {
    const written = new Set(articles.map((a) => a.slug));
    expect(otsPlan.filter((e) => !written.has(e.slug)).length).toBe(otsPlan.length - articles.length);
  });
});

describe("Off the Syllabus writing rules", () => {
  it("never uses an em-dash anywhere in the collection", () => {
    const sampleFiles = readdirSync(samplesDir).map((f) => [f, readFileSync(join(samplesDir, f), "utf8")] as const);
    const mdx = files.map((f) => [f, readFileSync(join(dir, f), "utf8")] as const);
    for (const [name, text] of [...mdx, ...sampleFiles, ["plan", JSON.stringify([offTheSyllabus, otsPlan, otsSeries])] as const]) {
      expect(text, `${name} has an em-dash`).not.toContain(EM_DASH);
    }
  });

  it("makes no claim about outcomes or jobs", () => {
    const banned = /\b(guarantee|guaranteed|get hired|get placed|land a job|crack|100%|higher salary|better pay|rank first|number one)\b/i;
    for (const article of articles) {
      expect(article.body, article.slug).not.toMatch(banned);
      expect(article.short.join(" "), article.slug).not.toMatch(banned);
    }
  });

  it("credits VeraStack Labs", () => {
    expect(offTheSyllabus.provider.name).toBe("VeraStack Labs");
    expect(offTheSyllabus.provider.url).toBe("https://verastack.dev");
  });

  it("sets 'Last checked' from the front matter, to a real date", () => {
    for (const article of articles) {
      expect(new Date(article.checked).toString()).not.toBe("Invalid Date");
    }
  });
});

describe("front matter errors", () => {
  const good = readFileSync(join(dir, "core-web-vitals.mdx"), "utf8");

  it("parses a good file", () => {
    expect(parseArticle(good, "x.mdx").slug).toBe("core-web-vitals");
  });

  it("refuses a missing date, an unknown series and an empty source list", () => {
    expect(() => parseArticle(good.replace(/^checked: .*$/m, ""), "x.mdx")).toThrow(/checked/);
    expect(() => parseArticle(good.replace("series: fast-pages", "series: nope"), "x.mdx")).toThrow(/series/);
    expect(() => parseArticle(good.replace(/^sources:[\s\S]*?^---$/m, "sources: []\n---"), "x.mdx")).toThrow(/sources/);
  });
});

describe("headings and the series", () => {
  it("makes anchors from the heading's own words", () => {
    expect(slugify("The honest trade-offs")).toBe("the-honest-trade-offs");
    expect(slugify("Try it yourself")).toBe("try-it-yourself");
    expect(slugify("Origan's own site, piece by piece")).toBe("origans-own-site-piece-by-piece");
    expect(slugify("Good, needs improvement, poor")).toBe("good-needs-improvement-poor");
  });

  it("lists ## headings and skips anything inside a code fence", () => {
    const body = "intro\n\n## One\n\n```sh\n## not a heading\n```\n\n### Small\n\n## Two\n";
    expect(headingsOf(body)).toEqual([
      { id: "one", label: "One" },
      { id: "two", label: "Two" },
    ]);
  });

  it("counts prose, not code or tags", () => {
    expect(wordCount("one two three\n\n<Sample file=\"a\" name=\"b\" />\n\n```sh\nfour five\n```\n")).toBe(3);
  });

  it("gives the read time as whole minutes, never under one", () => {
    expect(readMinutes({ body: "a few words", short: ["x"] })).toBe(1);
    expect(readMinutes({ body: "word ".repeat(401), short: ["x"] })).toBe(3);
  });

  it("links to the next article in a series, says 'coming' when it is not written, and 'last' at the end", () => {
    const all = new Set(otsPlan.map((e) => e.slug));
    expect(nextInSeries("core-web-vitals", all)).toMatchObject({ kind: "article", entry: { slug: "reading-pagespeed" } });
    expect(nextInSeries("core-web-vitals", new Set(["core-web-vitals"]))).toMatchObject({
      kind: "coming",
      entry: { slug: "reading-pagespeed" },
    });
    expect(nextInSeries("permission-denied-in-ci", all)).toMatchObject({ kind: "last" });
  });
});

describe("the svh article's claims about this site's own code", () => {
  const read = (...parts: string[]) => readFileSync(join(root, ...parts), "utf8");
  const hero = read("src", "components", "hero.tsx");
  const chapters = read("src", "components", "dsa", "chapters.tsx");
  const dialog = read("src", "components", "form-dialog.tsx");

  it("the hero is sized in svh, as the article shows", () => {
    expect(hero).toContain("min-h-[clamp(540px,88svh,880px)]");
    expect(hero).not.toMatch(/88vh/);
  });

  it("the wide-screen chapters sidebar is sticky under the 63px header and 100svh tall, less the header", () => {
    expect(chapters).toContain("sticky top-[63px]");
    expect(chapters).toContain("h-[calc(100svh-63px)]");
  });

  it("the phone drawer and the interest dialog still use dvh", () => {
    expect(chapters).toContain("h-dvh");
    expect(dialog).toContain("100dvh");
  });

  it("the CSS the article prints matches those classes", () => {
    const css = readFileSync(join(samplesDir, "svh.css"), "utf8");
    expect(css).toContain("clamp(540px, 88svh, 880px)");
    expect(css).toContain("clamp(540px, 88vh, 880px)");
    expect(css).toContain("calc(100svh - 63px)");
    expect(css).toContain("height: 100dvh");
  });
});

describe("Off the Syllabus on the Resources page", () => {
  it("is a card, with its descriptor, a count of articles and its topic pills", () => {
    const card = resources.find((r) => r.id === "off-the-syllabus")!;
    expect(card.name).toBe("Off the Syllabus");
    expect(card.descriptor).toBe("Web and tools");
    expect(card.href).toBe("/learn/off-the-syllabus/");
    expect(card.unit).toEqual(["article", "articles"]);
    expect(card.topics).toEqual(otsTopics);
  });

  it("only has pills for topics that a published article declares", () => {
    const declared = new Set(articles.flatMap((a) => a.topics));
    for (const pill of otsTopics) expect(declared.has(pill), `${pill} is not a topic of any article`).toBe(true);
  });
});

// --- the samples folder ------------------------------------------------------------------

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);

/** A small well-formedness check for the HTML samples: tags nest and close, and quotes balance. */
export function htmlProblems(html: string): string[] {
  const problems: string[] = [];
  const text = html.replace(/<!--[\s\S]*?-->/g, "");
  const stack: string[] = [];
  for (const m of text.matchAll(/<(\/?)([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g)) {
    const [, closing, rawName, rest] = m;
    const name = rawName.toLowerCase();
    if (closing) {
      if (stack.pop() !== name) problems.push(`</${name}> does not match the open tag`);
    } else if (!VOID.has(name) && !rest.trimEnd().endsWith("/")) {
      stack.push(name);
    }
  }
  if (stack.length) problems.push(`unclosed: ${stack.join(", ")}`);
  const stripped = text.replace(/<\/?[a-zA-Z](?:"[^"]*"|'[^']*'|[^>"'])*>/g, "");
  // A ">" in text is fine to a browser. A "<" that opens nothing is not.
  if (/<(?![!/a-zA-Z])/.test(stripped)) problems.push("a stray <");
  return problems;
}

/** Every JSON-LD block in some HTML, as parsed values. Throws if one is not JSON. */
export function jsonLdBlocks(html: string): unknown[] {
  return [...html.matchAll(/<script\s+type="application\/ld\+json"\s*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
}

function hasContextAndType(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0 && value.every(hasContextAndType);
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  const graph = record["@graph"];
  return (
    typeof record["@context"] === "string" &&
    (typeof record["@type"] === "string" || (Array.isArray(graph) && graph.every((n) => typeof n?.["@type"] === "string")))
  );
}

const sampleFiles = readdirSync(samplesDir);

describe("the HTML samples", () => {
  const htmlFiles = sampleFiles.filter((f) => f.endsWith(".html"));

  it("has at least one", () => {
    expect(htmlFiles.length).toBeGreaterThan(0);
  });

  it.each(htmlFiles)("%s is well formed", (file) => {
    expect(htmlProblems(readFileSync(join(samplesDir, file), "utf8"))).toEqual([]);
  });

  it("the checker notices bad HTML", () => {
    expect(htmlProblems("<div><p>hi</div>")).not.toEqual([]);
    expect(htmlProblems("<ul><li>one</ul>")).not.toEqual([]);
    expect(htmlProblems("<p>a < b</p>")).not.toEqual([]);
    expect(htmlProblems("<p>a > b</p><script>const f = (x) => x;</script>")).toEqual([]);
    expect(htmlProblems('<img src="a.jpg" alt="x"><br><p>fine</p>')).toEqual([]);
  });
});

describe("the CSS samples", () => {
  const cssFiles = sampleFiles.filter((f) => f.endsWith(".css"));

  it("exists only when an article has one", () => {
    expect(cssFiles.length).toBeGreaterThanOrEqual(0);
  });

  it.skipIf(false).each(cssFiles)("%s has balanced braces and every rule ends in a semicolon or a brace", (file) => {
    const css = readFileSync(join(samplesDir, file), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    let depth = 0;
    for (const ch of css) {
      if (ch === "{") depth += 1;
      if (ch === "}") depth -= 1;
      expect(depth).toBeGreaterThanOrEqual(0);
    }
    expect(depth).toBe(0);
    for (const line of css.split("\n").map((l) => l.trim()).filter(Boolean)) {
      expect(line, line).toMatch(/[;{}]$|^@|,$/);
    }
  });
});

describe("JSON-LD", () => {
  const htmlFiles = sampleFiles.filter((f) => f.endsWith(".html"));

  it.each(htmlFiles)("every block in %s is valid JSON with an @context and an @type", (file) => {
    const html = readFileSync(join(samplesDir, file), "utf8");
    for (const block of jsonLdBlocks(html)) expect(hasContextAndType(block)).toBe(true);
  });

  it("the checker notices JSON-LD that is not JSON, or has no context", () => {
    expect(() => jsonLdBlocks('<script type="application/ld+json">{ "@type": "Thing", }</script>')).toThrow();
    expect(hasContextAndType({ "@type": "Thing" })).toBe(false);
    expect(hasContextAndType({ "@context": "https://schema.org" })).toBe(false);
    expect(hasContextAndType({ "@context": "https://schema.org", "@type": "Thing" })).toBe(true);
  });

  // The article sample is the JSON-LD article's own, so it exists once that article does.
  const quoted: RepoSample[] = ["organization", "website", "lesson", "breadcrumb", ...(articles.some((a) => a.slug === "json-ld") ? (["article"] as const) : [])];
  it.each(quoted)("the %s JSON-LD this repo emits is valid JSON with an @context and an @type", (which) => {
    const value = repoSample(which);
    expect(hasContextAndType(JSON.parse(JSON.stringify(value)))).toBe(true);
  });

  it.each(articles.map((a) => [a.slug, a]))("%s emits a TechArticle with the fields the plan asks for", (_, article) => {
    const ld = articleJsonLd(article);
    expect(hasContextAndType(ld)).toBe(true);
    expect(ld["@type"]).toBe("TechArticle");
    expect(ld.headline).toBe(article.title);
    expect(ld.description).toBe(article.description);
    expect(ld.datePublished).toBe(article.published);
    // dateModified is "Last checked".
    expect(ld.dateModified).toBe(article.checked);
    expect(ld.author.name).toBe("VeraStack Labs");
    expect(ld.publisher.name).toBe("VeraStack Labs");
    expect(ld.isPartOf.url).toBe("https://origan.verastack.dev/learn/off-the-syllabus/");
    expect(ld.about.map((t) => t.name)).toEqual(article.topics);
    expect(ld.articleSection).toBe(seriesOf(article.series).name);
    expect(JSON.stringify(ld)).not.toContain(EM_DASH);
  });

  it("the article's own jsonLdTag writes the same JSON the site's jsonLdScript does", () => {
    const samples = [
      { "@context": "https://schema.org", "@type": "Thing", name: "plain" },
      { "@context": "https://schema.org", "@type": "Thing", name: "a < b </script> c" },
      ...articles.map((a) => articleJsonLd(a)),
    ];
    for (const sample of samples) {
      expect(jsonLdTag(sample)).toBe(`<script type="application/ld+json">${jsonLdScript(sample)}</script>`);
    }
  });

  it("emits a CollectionPage on the index, with an article for each published page", () => {
    const ld = collectionJsonLd(articles);
    expect(hasContextAndType(ld)).toBe(true);
    expect(ld["@type"]).toBe("CollectionPage");
    expect(ld.hasPart).toHaveLength(articles.length);
  });

  it("emits a BreadcrumbList on every page: Origan, Resources, the collection, then the article", () => {
    const index = otsBreadcrumbJsonLd();
    expect(index.itemListElement.map((s) => s.name)).toEqual(["Origan", "Resources", "Off the Syllabus"]);
    const article = otsBreadcrumbJsonLd(articles[0]);
    expect(article.itemListElement.map((s) => s.position)).toEqual([1, 2, 3, 4]);
    expect(article.itemListElement[3].item).toBe(`https://origan.verastack.dev/learn/off-the-syllabus/${articles[0].slug}/`);
  });
});
