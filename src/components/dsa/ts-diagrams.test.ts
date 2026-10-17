import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { javaCourse, rustCourse, switchCourse } from "@/data/courses";
import { componentsFor } from "./mdx-components";
import * as tsDiagrams from "./ts-diagrams";

/**
 * The Switch's diagrams: each is drawn twice (a wide layout and a narrow one),
 * names what it shows in words, and uses tokens for every colour. They are
 * registered for The Switch only.
 */
const diagrams = Object.entries(tsDiagrams).filter(([name]) => name.endsWith("Diagram")) as [string, ComponentType][];

describe("the Switch diagrams", () => {
  it("has one diagram for each lesson that has a picture to teach with", () => {
    expect(diagrams.map(([name]) => name).sort()).toEqual(
      [
        "CourierDiagram",
        "DoorDiagram",
        "LabelsDiagram",
        "LadderDiagram",
        "NarrowingDiagram",
        "PassesDiagram",
        "ShapesDiagram",
        "StencilDiagram",
        "TiffinDiagram",
        "ToolchainDiagram",
        "TypesErasedDiagram",
        "UtilityDiagram",
      ].sort(),
    );
  });

  it.each(diagrams)("%s renders both layouts, with a title, a text alternative and a caption", (_name, Diagram) => {
    const html = renderToStaticMarkup(createElement(Diagram));
    expect(html.match(/<svg /g)).toHaveLength(2);
    expect(html.match(/role="img"/g)).toHaveLength(2);
    expect(html.match(/<title /g)).toHaveLength(2);
    expect(html.match(/<desc /g)).toHaveLength(2);
    expect(html).toContain("<figcaption");
    // Marker and label ids must not repeat between the two drawings.
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
});

describe("registration", () => {
  it("The Switch gets its diagrams", () => {
    const own = componentsFor(switchCourse);
    for (const [name] of diagrams) expect(own[name], name).toBeTypeOf("function");
  });

  it("the Rust and Java courses do not", () => {
    for (const course of [rustCourse, javaCourse]) {
      const theirs = componentsFor(course);
      for (const [name] of diagrams) expect(theirs[name], `${course.id} ${name}`).toBeUndefined();
    }
  });
});
