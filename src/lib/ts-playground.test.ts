import { decompressFromEncodedURIComponent } from "lz-string";
import { describe, expect, it } from "vitest";
import { PLAYGROUND, tsPlaygroundUrl } from "./ts-playground";

const decode = (url: string) => decompressFromEncodedURIComponent(url.slice(PLAYGROUND.length));

describe("tsPlaygroundUrl", () => {
  it("points at the official Playground, with the code in the fragment", () => {
    const url = new URL(tsPlaygroundUrl("const a = 1;"));
    expect(url.origin + url.pathname).toBe("https://www.typescriptlang.org/play");
    expect(url.hash.startsWith("#code/")).toBe(true);
  });

  it("decodes back to the snippet, exactly", () => {
    const code = [
      "type User = { name: string; age?: number };",
      "",
      "function greet(user: User): string {",
      '  return `Hello, ${user.name}! ✓ & <tag> "quotes" \ backslash`;',
      "}",
      "",
      'console.log(greet({ name: "Asha" }));',
      "",
    ].join("\n");
    expect(decode(tsPlaygroundUrl(code))).toBe(code);
  });

  it("keeps the whole link free of characters that break a URL", () => {
    const url = tsPlaygroundUrl('const s = "a b & c ? d # e";\n');
    expect(url.slice(PLAYGROUND.length)).toMatch(/^[A-Za-z0-9+\-$]+$/);
  });
});
