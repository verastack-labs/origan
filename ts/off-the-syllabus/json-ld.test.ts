import { describe, expect, it } from "vitest";
import { hasContextAndType, jsonLdTag, readJsonLd } from "./json-ld";

describe("jsonLdTag", () => {
  const data = { "@context": "https://schema.org", "@type": "Article", headline: "Hello" };

  it("wraps the JSON in a script tag of the right type", () => {
    const tag = jsonLdTag(data);
    expect(tag.startsWith('<script type="application/ld+json">')).toBe(true);
    expect(tag.endsWith("</script>")).toBe(true);
  });

  it("reads back as the same data", () => {
    expect(readJsonLd(jsonLdTag(data))).toEqual(data);
  });

  it("cannot be closed early by text that looks like a closing script tag", () => {
    const sneaky = { "@context": "https://schema.org", "@type": "Thing", name: "</script><script>alert(1)</script>" };
    const tag = jsonLdTag(sneaky);
    // The only closing tag is the last thing in the string.
    expect(tag.indexOf("</script>")).toBe(tag.length - "</script>".length);
    expect(tag).not.toContain("<script>alert");
    expect(readJsonLd(tag)).toEqual(sneaky);
  });

  it("escapes every less-than sign, and leaves other text alone", () => {
    const tag = jsonLdTag({ name: "a < b & c > d" });
    expect(tag).toContain("a \\u003c b & c > d");
  });
});

describe("hasContextAndType", () => {
  it("wants an @context and an @type", () => {
    expect(hasContextAndType({ "@context": "https://schema.org", "@type": "Thing" })).toBe(true);
    expect(hasContextAndType({ "@type": "Thing" })).toBe(false);
    expect(hasContextAndType({ "@context": "https://schema.org" })).toBe(false);
  });

  it("accepts a @graph whose every node has a type", () => {
    const graph = [{ "@type": "Organization" }, { "@type": "WebSite" }];
    expect(hasContextAndType({ "@context": "https://schema.org", "@graph": graph })).toBe(true);
    expect(hasContextAndType({ "@context": "https://schema.org", "@graph": [...graph, { name: "x" }] })).toBe(false);
    expect(hasContextAndType({ "@context": "https://schema.org", "@graph": [] })).toBe(false);
  });

  it("rejects anything that is not an object", () => {
    expect(hasContextAndType(null)).toBe(false);
    expect(hasContextAndType("text")).toBe(false);
    expect(hasContextAndType([{ "@context": "https://schema.org", "@type": "Thing" }])).toBe(false);
  });
});

describe("readJsonLd", () => {
  it("refuses something that is not a JSON-LD script tag", () => {
    expect(() => readJsonLd("<script>1</script>")).toThrow();
  });
});
