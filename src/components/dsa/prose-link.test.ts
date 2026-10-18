import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { componentsFor } from "./mdx-components";
import { ProseLink } from "./prose-link";
import { rustCourse } from "@/data/courses";
import { isExternal } from "@/lib/links";

const render = (href: string, ...children: unknown[]) =>
  renderToStaticMarkup(createElement(ProseLink, { href }, ...(children as never[])));

describe("an external link", () => {
  const html = render("https://curl.se/", "Visit curl now");

  it("opens in a new tab, safely", () => {
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("has an arrow that is hidden from a screen reader, and words that say what it does", () => {
    expect(html).toMatch(/<span aria-hidden="true"[^>]*>↗<\/span>/);
    expect(html).toContain("(opens in a new tab)");
    expect(html).toContain('class="sr-only"');
  });

  it("keeps the arrow with the last word, so it never wraps alone", () => {
    expect(html).toMatch(/Visit curl <span class="whitespace-nowrap">now<span aria-hidden/);
    // The words before the last one are not in the nowrap box.
    expect(html).not.toMatch(/whitespace-nowrap">Visit/);
  });

  it("nudges the arrow on hover, but not for someone who asked for less motion", () => {
    expect(html).toContain("group-hover:-translate-y-px");
    expect(html).toContain("motion-reduce:group-hover:translate-x-0");
    expect(html).toContain("motion-reduce:transition-none");
  });

  it("thickens the underline on hover, and keeps the accent on any code in it", () => {
    expect(html).toContain("hover:decoration-2");
    expect(html).toContain("[&amp;_code]:text-survey");
  });

  it("joins the arrow to inline code at the end of the link", () => {
    const code = createElement("code", null, "curl");
    const withCode = render("https://curl.se/", code);
    expect(withCode).toMatch(/<span class="whitespace-nowrap"><code>curl<\/code><span aria-hidden/);
  });

  it("joins the arrow to the last word when the link ends in text after some code", () => {
    const withCode = render("https://example.com/", createElement("code", null, "min-height"), " docs");
    expect(withCode).toMatch(/<code>min-height<\/code> <span class="whitespace-nowrap">docs<span aria-hidden/);
  });
});

describe("an internal link", () => {
  it.each(["/learn/off-the-syllabus/", "#sources", "mailto:rigan@verastack.dev", "https://origan.verastack.dev/resources/"])(
    "%s has no arrow, no new tab and no hidden words",
    (href) => {
      const html = render(href, "Read this");
      expect(html).not.toContain("↗");
      expect(html).not.toContain("target=");
      expect(html).not.toContain("noopener");
      expect(html).not.toContain("opens in a new tab");
      expect(html).toContain("underline");
      expect(html).toContain("decoration-survey-2");
    },
  );
});

describe("the link in a lesson or an article", () => {
  it("is this one, in every course's components", () => {
    const A = componentsFor(rustCourse).a as typeof ProseLink;
    const html = renderToStaticMarkup(createElement(A, { href: "https://doc.rust-lang.org/" }, "The Rust book"));
    expect(html).toContain("↗");
    expect(html).toContain('target="_blank"');
  });
});

describe("the links in the Off the Syllabus articles", () => {
  const dir = join(process.cwd(), "src", "content", "learn", "off-the-syllabus");
  const files = readdirSync(dir).filter((f) => f.endsWith(".mdx"));

  it.each(files)("%s links its tools and specs in the text, only the first time, and always over https", (file) => {
    const body = readFileSync(join(dir, file), "utf8").replace(/^---[\s\S]*?\n---\n/, "");
    const links = [...body.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)].map((m) => ({ text: m[1], href: m[2] }));
    const external = links.filter((l) => isExternal(l.href));
    expect(external.length, "links in the text").toBeGreaterThanOrEqual(5);
    for (const l of external) {
      expect(l.href, l.text).toMatch(/^https:\/\//);
      expect(l.text.toLowerCase(), "link text should say where it goes").not.toMatch(/^(here|link|this|click here)$/);
    }
    // Only the first mention is linked: the same address is not repeated in the text.
    const hrefs = external.map((l) => l.href);
    expect(new Set(hrefs).size, `a link is repeated in ${file}`).toBe(hrefs.length);
  });
});
