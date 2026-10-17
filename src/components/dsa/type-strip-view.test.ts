import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TypeStripView } from "./type-strip-view";

/** What a reader gets before the script runs, and what a screen reader is told. */
describe("TypeStripView, as the server renders it", () => {
  const html = renderToStaticMarkup(
    createElement(TypeStripView, {
      html: '<pre><code><span class="line">let n<span class="ts-strip" style="--w:8">: number</span> = 1;</span></code></pre>',
      ts: "let n: number = 1;",
      js: "let n = 1;",
    }),
  );

  it("starts with the types showing, and the switch unpressed", () => {
    expect(html).toContain('aria-pressed="false"');
    expect(html).toContain("Strip the types");
    expect(html).not.toContain("is-stripped");
    expect(html).toContain("TypeScript: what you write");
  });

  it("hides the animated code from assistive technology and offers a plain copy instead", () => {
    expect(html).toContain('aria-hidden="true"');
    expect(html).toMatch(/<pre class="sr-only">let n: number = 1;<\/pre>/);
  });

  it("announces which version is showing, politely", () => {
    expect(html).toMatch(/aria-live="polite"[^>]*>TypeScript: what you write/);
  });

  it("keeps the stripped JavaScript on the page for a reader without script", () => {
    expect(html).toMatch(/<noscript>[\s\S]*let n = 1;[\s\S]*<\/noscript>/);
  });
});
