// Article 5: JSON-LD. The page text is
// src/content/learn/off-the-syllabus/json-ld.mdx.
//
// The same idea as the function Origan's own pages use to put structured data
// in a script tag. src/data/ots-articles.test.ts checks that this one and the
// site's give the same answer.

// region: tag
// Turn some data into the script tag a page carries. JSON.stringify writes the
// JSON. Every "<" is written as <, which is the same character to JSON
// and cannot end the script block early by spelling out a closing script tag.
export function jsonLdTag(data: object): string {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}
// endregion

// region: read
// Read the data back out of a script tag, the way a crawler would.
export function readJsonLd(tag: string): unknown {
  const match = /^<script type="application\/ld\+json">([\s\S]*)<\/script>$/.exec(tag);
  if (!match) throw new Error("Not a JSON-LD script tag");
  return JSON.parse(match[1]);
}
// endregion

// region: check
// The two keys every block needs to mean anything: which vocabulary
// (@context), and what kind of thing (@type, or a @graph of things that each have one).
export function hasContextAndType(value: unknown): boolean {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const block = value as Record<string, unknown>;
  if (typeof block["@context"] !== "string") return false;
  if (typeof block["@type"] === "string") return true;
  const graph = block["@graph"];
  return Array.isArray(graph) && graph.length > 0 && graph.every((node) => typeof node?.["@type"] === "string");
}
// endregion
