import { describe, expect, it } from "vitest";
import { sampleCode } from "../ots-snippets";
import { asArticle, GLOSS, jsonFromScript, longDate } from "./json-ld-lens";

describe("the JSON-LD lens", () => {
  const data = asArticle(jsonFromScript(sampleCode("json-ld-samples.html", "minimal")));

  it("reads the article's own minimal sample", () => {
    expect(data["@type"]).toBe("TechArticle");
    expect(data.headline).toBe("What happens when you type a URL");
    expect(data.author.name).toBe("VeraStack Labs");
  });

  it("has a plain-words gloss for every label the sample uses", () => {
    for (const key of Object.keys(data)) expect(GLOSS[key], key).toBeTruthy();
  });

  it("writes a date the way the rest of the site does", () => {
    expect(longDate("2026-10-18")).toBe("18 October 2026");
    expect(longDate(data.datePublished)).toBe("18 October 2026");
  });

  it("refuses data that is not the block it shows", () => {
    expect(() => asArticle({ "@context": "https://schema.org", "@type": "Thing" })).toThrow();
    expect(() => jsonFromScript("<p>nothing here</p>")).toThrow();
  });

  it("uses no em dash in its words", () => {
    expect(JSON.stringify(GLOSS)).not.toContain(String.fromCharCode(0x2014));
  });
});
