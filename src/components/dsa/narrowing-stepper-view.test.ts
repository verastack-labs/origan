import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { narrowingSteps } from "@/lib/narrowing-steps";
import { region } from "@/lib/snippets";
import { TS_SOURCE } from "@/lib/ts-snippets";
import { NarrowingStepperView } from "./narrowing-stepper-view";

/** What the server renders: the first step, and every step listed for a reader without script. */
describe("NarrowingStepperView, as the server renders it", () => {
  const steps = narrowingSteps(region("lesson5-unions", "exhaustive", TS_SOURCE));
  const html = renderToStaticMarkup(createElement(NarrowingStepperView, { html: "<pre><code></code></pre>", steps }));

  it("starts on step one, with Back unable to move and Next ready", () => {
    expect(html).toContain("Step 1 of 6");
    expect(html).toMatch(/aria-disabled="true"[^>]*>Back/);
    expect(html).toMatch(/>Next<span class="sr-only"> step<\/span>/);
  });

  it("announces each change politely, as one message", () => {
    expect(html).toMatch(/aria-live="polite" aria-atomic="true"/);
  });

  it("lists every step in order for a reader without script", () => {
    const list = /<ol class="no-js-only[\s\S]*?<\/ol>/.exec(html)?.[0] ?? "";
    const types = [...list.matchAll(/text-survey">([^<]+)<\/span>/g)].map((m) => m[1].replaceAll("&quot;", '"'));
    expect(types).toEqual(steps.map((s) => s.type));
  });
});
