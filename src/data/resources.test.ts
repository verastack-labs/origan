import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { ShelfCard } from "@/components/shelf-card";
import { buildLlmsTxt } from "@/lib/llms";
import { buildSearchIndex } from "@/lib/search-index";
import { search } from "@/lib/search";
import { liveFirst, searchWithin } from "@/lib/shelf";
import { collectionJsonLd } from "@/lib/article-jsonld";
import { getArticles } from "@/lib/articles";
import { liveResources, resources, resourcesPage, type ComingResource } from "./resources";

const coming = resources.filter((r): r is ComingResource => r.status === "coming");
const html = (resource: Parameters<typeof ShelfCard>[0]["resource"], count = 0, hidden = false) =>
  renderToStaticMarkup(createElement(ShelfCard, { resource, count, hidden }));

describe("coming soon", () => {
  it("always has at least one entry on the shelf", () => {
    expect(
      coming.length,
      "The shelf has no coming-soon entry. Rigan's standing rule: when a collection finishes, something else is always shown as coming soon. Add one to resources.ts.",
    ).toBeGreaterThanOrEqual(1);
  });

  it("is the whole roadmap, after the live cards, in order", () => {
    expect(coming.map((r) => `${r.name} · ${r.descriptor}`)).toEqual([
      "Black Screen · The terminal",
      "Cloud Kitchen · Cloud basics",
      "Context Window · AI for engineers",
      "Kernel Panic · Operating systems",
      "Table Manners · Databases in practice",
    ]);
    expect(resources.map((r) => r.status)).toEqual([...liveResources.map(() => "live"), ...coming.map(() => "coming")]);
  });

  it("has new filters of its own, each with a hint", () => {
    expect(coming.map((r) => r.filters)).toEqual([["terminal"], ["cloud"], ["ai"], ["os"], ["databases"]]);
  });

  it("needs no route: no link, no count, and nothing that promises a date or a number", () => {
    for (const r of coming) {
      expect(r, r.id).not.toHaveProperty("href");
      expect(r, r.id).not.toHaveProperty("unit");
      expect(r.summary, r.id).not.toMatch(/\d/);
      expect(r.summary, r.id).not.toMatch(/\b(soon|week|month|year|by |will launch|launching)\b/i);
      expect(JSON.stringify(r), r.id).not.toContain("—");
      expect(r.topics.length, r.id).toBeGreaterThan(3);
    }
  });

  it("turns live only when it has a route", () => {
    for (const r of liveResources) {
      expect(r.href, r.id).toMatch(/^\/learn\/[a-z-]+\/$/);
    }
  });
});

describe("a coming card", () => {
  it.each(coming.map((r) => [r.id, r] as const))("%s says Coming soon, links nowhere and has no way in", (_, r) => {
    const markup = html(r);
    expect(markup).toContain("Coming soon");
    expect(markup).not.toContain("<a ");
    expect(markup).not.toContain("href=");
    expect(markup).not.toContain("Open the lessons");
    expect(markup).not.toContain("Free ·");
    expect(markup).toContain(r.name);
    expect(markup).toContain("border-dashed");
    for (const topic of r.topics) expect(markup).toContain(topic);
  });

  it("draws a backticked summary as code", () => {
    const black = coming.find((r) => r.id === "black-screen")!;
    expect(html(black)).toMatch(/<code[^>]*>cd<\/code>/);
  });

  it("renders a made-up coming entry the same way, and hides when told to", () => {
    const made: ComingResource = {
      id: "made-up",
      status: "coming",
      name: "Made Up",
      descriptor: "A test",
      summary: "Only here to prove a coming card renders.",
      filters: ["web"],
      topics: ["One", "Two"],
    };
    const markup = html(made);
    expect(markup).toContain("Made Up");
    expect(markup).toContain("Coming soon");
    expect(markup).not.toContain("<a ");
    expect(html(made, 0, true)).toMatch(/ hidden=""/);
    expect(html(made)).not.toMatch(/ hidden=""/);
  });

  it("is quieter than a live card: a dashed border, not a solid one", () => {
    const live = html(liveResources[0], 12);
    // (A "+N more" pill is dashed too, so look at the card's own border.)
    expect(/<li class="[^"]*border-dashed/.test(live)).toBe(false);
    expect(live).toContain("<a ");
  });
});

describe("a live card", () => {
  it("shows its count and a link in", () => {
    const markup = html(liveResources[0], 20);
    expect(markup).toContain("Free · ");
    expect(markup).toContain("20");
    expect(markup).toContain("lessons");
    expect(markup).toMatch(new RegExp(`href="${liveResources[0].href.replace(/\/$/, "")}/?"`));
    expect(markup).toContain("Open the lessons");
  });

  it("counts one article as an article", () => {
    const ots = liveResources.find((r) => r.id === "off-the-syllabus")!;
    const markup = html(ots, 1).replace(/<!-- -->/g, "");
    expect(markup).toContain("Free · 1 article");
    expect(markup).not.toContain("Free · 1 articles");
  });
});

describe("the order on the shelf", () => {
  it("puts live cards first, then coming, each in the shelf's own order", () => {
    expect(liveFirst(resources).map((r) => r.id)).toEqual(resources.map((r) => r.id));
    const shuffled = [...resources].reverse();
    const sorted = liveFirst(shuffled).map((r) => r.status);
    expect(sorted).toEqual([...sorted].sort((a, b) => (a === b ? 0 : a === "live" ? -1 : 1)));
  });
});

describe("search finds coming collections, but they have no page", () => {
  const index = buildSearchIndex();

  it("finds them by name and by pill, marked coming and not published", () => {
    const byName = search(index, "kernel panic");
    expect(byName[0].entry.title).toBe("Kernel Panic");
    expect(byName[0].entry.comingSoon).toBe(true);
    expect(byName[0].entry.published).toBe(false);
    expect(byName[0].entry.href).toBe("");
    const byPill = search(index, "ssh").map((r) => r.entry.title);
    expect(byPill).toContain("Black Screen");
    expect(search(index, "indexes").map((r) => r.entry.title)).toContain("Table Manners");
  });

  it("finds them inside their filter, and not outside it", () => {
    expect(searchWithin(index, "kernel", "os").map((r) => r.entry.title)).toContain("Kernel Panic");
    expect(searchWithin(index, "kernel", "web").map((r) => r.entry.title)).not.toContain("Kernel Panic");
  });

  it("has one entry per coming item and gives each its filters", () => {
    for (const r of coming) {
      const entry = index.find((e) => e.id === `coming:${r.id}`);
      expect(entry?.filters).toEqual(r.filters);
      expect(entry?.topics).toEqual(r.topics);
    }
  });
});

describe("what a coming collection stays out of", () => {
  const names = coming.flatMap((r) => [r.name, r.id]);

  it("is not in llms.txt", () => {
    const text = buildLlmsTxt();
    for (const r of coming) {
      expect(text, r.name).not.toContain(r.name);
      expect(text, r.id).not.toContain(r.id);
    }
  });

  it("is not in the sitemap, which is what IndexNow submits", () => {
    const urls = sitemap().map((entry) => entry.url);
    for (const name of names) {
      const slug = name.toLowerCase().replace(/\s+/g, "-");
      for (const url of urls) expect(url, name).not.toContain(slug);
    }
    // And the live ones are all there.
    for (const r of liveResources) expect(urls).toContain(`https://origan.verastack.dev${r.href}`);
  });

  it("is not in the structured data", () => {
    const text = JSON.stringify(collectionJsonLd(getArticles()));
    for (const r of coming) expect(text, r.name).not.toContain(r.name);
  });
});

describe("the note at the foot of the shelf", () => {
  const { more } = resourcesPage;

  it("is warm, short and makes no promise about dates or numbers", () => {
    expect(more.heading).toBe("More on the way");
    expect(more.before).toBe("The VeraStack Labs team is building new courses and collections right now. Want a topic covered?");
    expect(more.link).toBe("Tell us");
    expect(JSON.stringify(more)).not.toContain("—");
    expect(JSON.stringify(more)).not.toMatch(/\d/);
  });

  it("asks for a topic by email, with the subject in the link", () => {
    expect(more.subject).toBe("Topic for The Open Shelf");
    expect(encodeURIComponent(more.subject)).toBe("Topic%20for%20The%20Open%20Shelf");
  });
});
