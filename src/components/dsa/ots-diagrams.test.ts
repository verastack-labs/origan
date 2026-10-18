import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { articleComponents } from "./mdx-components";
import * as otsDiagrams from "./ots-diagrams";

/**
 * Off the Syllabus's diagrams: each is drawn twice (a wide layout and a narrow
 * one), names what it shows in words, and uses tokens for every colour. They
 * are registered for the articles.
 */
const diagrams = Object.entries(otsDiagrams).filter(([name]) => name.endsWith("Diagram")) as [string, ComponentType][];

describe("the Off the Syllabus diagrams", () => {
  it("has the four the articles use", () => {
    expect(diagrams.map(([name]) => name).sort()).toEqual(
      ["CoreVitalsDiagram", "FieldLabDiagram", "UrlJourneyDiagram", "ViewportUnitsDiagram"].sort(),
    );
  });

  it.each(diagrams)("%s renders both layouts, with a title, a text alternative and a caption", (_name, Diagram) => {
    const html = renderToStaticMarkup(createElement(Diagram));
    expect(html.match(/<svg /g)).toHaveLength(2);
    expect(html.match(/role="img"/g)).toHaveLength(2);
    expect(html.match(/<title /g)).toHaveLength(2);
    expect(html.match(/<desc /g)).toHaveLength(2);
    expect(html).toContain("<figcaption");
    // Marker and label ids must not repeat between the two drawings, or between diagrams.
    const ids = [...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(diagrams)("%s uses tokens for colour and no em dash", (_name, Diagram) => {
    const html = renderToStaticMarkup(createElement(Diagram));
    expect(html).not.toMatch(/#[0-9a-fA-F]{3,6}\b/);
    expect(html).not.toContain(String.fromCharCode(0x2014));
  });

  it("the text alternative is longer than the caption, so it says more than the caption does", () => {
    for (const [name, Diagram] of diagrams) {
      const html = renderToStaticMarkup(createElement(Diagram));
      const desc = /<desc[^>]*>([^<]*)<\/desc>/.exec(html)?.[1] ?? "";
      const caption = /<figcaption[^>]*>([^<]*)<\/figcaption>/.exec(html)?.[1] ?? "";
      expect(desc.length, name).toBeGreaterThan(caption.length);
    }
  });

  it("are all available to an article, by name", () => {
    const components = articleComponents();
    for (const [name] of diagrams) expect(components, name).toHaveProperty(name);
  });
});
