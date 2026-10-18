/**
 * The "what a search engine reads" block in the JSON-LD article: the same page
 * twice, once as a person sees it and once as the labelled data behind it. The
 * data is not retyped. It is read out of the article's own `minimal` sample
 * (`ts/off-the-syllabus/json-ld-samples.html`), the block the article prints
 * and tests, so the two cannot disagree.
 */
export type Article = {
  "@context": string;
  "@type": string;
  headline: string;
  datePublished: string;
  dateModified: string;
  author: { "@type": string; name: string };
};

/** The JSON inside the first `application/ld+json` script of some HTML. */
export function jsonFromScript(html: string): unknown {
  const match = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html);
  if (!match) throw new Error("No JSON-LD script in that HTML");
  return JSON.parse(match[1]);
}

/** Checks the data really is the article block this view needs, so a change to the sample fails loudly. */
export function asArticle(data: unknown): Article {
  const d = data as Partial<Article> | null;
  if (
    !d ||
    d["@context"] !== "https://schema.org" ||
    typeof d["@type"] !== "string" ||
    typeof d.headline !== "string" ||
    typeof d.datePublished !== "string" ||
    typeof d.dateModified !== "string" ||
    !d.author ||
    typeof d.author.name !== "string"
  ) {
    throw new Error("The minimal JSON-LD sample no longer has the fields the lens shows");
  }
  return d as Article;
}

/** What each label tells a program, in plain words. */
export const GLOSS: Record<string, string> = {
  "@context": "which dictionary the words come from",
  "@type": "what kind of thing this is",
  headline: "the title",
  datePublished: "when it first came out",
  dateModified: "when it was last checked or changed",
  author: "who made it",
};

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** 2026-10-18 as "18 October 2026". */
export function longDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${months[month - 1]} ${year}`;
}
