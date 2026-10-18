import { describe, expect, it } from "vitest";
import { isExternal } from "./links";

describe("isExternal", () => {
  it("is false for a relative link", () => {
    expect(isExternal("/learn/off-the-syllabus/")).toBe(false);
    expect(isExternal("../resources/")).toBe(false);
    expect(isExternal("css-notes.html")).toBe(false);
    expect(isExternal("?q=hash")).toBe(false);
  });

  it("is false for an #anchor on the same page", () => {
    expect(isExternal("#sources")).toBe(false);
    expect(isExternal("#")).toBe(false);
  });

  it("is false for mailto and tel, which are not pages", () => {
    expect(isExternal("mailto:rigan@verastack.dev?subject=Topic")).toBe(false);
    expect(isExternal("tel:+919380654730")).toBe(false);
  });

  it("is false for our own address written in full, whatever its case or a leading www", () => {
    expect(isExternal("https://origan.verastack.dev/")).toBe(false);
    expect(isExternal("https://origan.verastack.dev/learn/js-to-ts/why-switch/#hook")).toBe(false);
    expect(isExternal("http://origan.verastack.dev/resources/")).toBe(false);
    expect(isExternal("HTTPS://ORIGAN.VERASTACK.DEV/resources/")).toBe(false);
    expect(isExternal("https://www.origan.verastack.dev/")).toBe(false);
  });

  it("is true for another site", () => {
    expect(isExternal("https://developer.mozilla.org/en-US/docs/Web/CSS/clamp")).toBe(true);
    expect(isExternal("http://example.com/")).toBe(true);
    expect(isExternal("https://web.dev/articles/vitals#section")).toBe(true);
  });

  it("is true for a protocol-relative address to another site", () => {
    expect(isExternal("//example.com/x")).toBe(true);
    expect(isExternal("//origan.verastack.dev/x")).toBe(false);
  });

  it("is true for another site on a similar-looking host", () => {
    // The studio's site is a different site from this one.
    expect(isExternal("https://verastack.dev/")).toBe(true);
    expect(isExternal("https://origan.verastack.dev.evil.example/")).toBe(true);
    expect(isExternal("https://notorigan.verastack.dev/")).toBe(true);
  });

  it("is false for nothing, and for text that is not an address", () => {
    expect(isExternal(undefined)).toBe(false);
    expect(isExternal(null)).toBe(false);
    expect(isExternal("")).toBe(false);
    expect(isExternal("javascript:void(0)")).toBe(false);
    expect(isExternal("https://")).toBe(false);
  });
});
