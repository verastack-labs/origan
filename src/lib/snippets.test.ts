import { describe, expect, it } from "vitest";
import { parseRegions, playgroundCode, playgroundUrl, region } from "./snippets";

describe("parseRegions", () => {
  it("cuts the lines between the markers and removes shared indentation", () => {
    const source = [
      "fn outside() {}",
      "mod tests {",
      "    // region: demo",
      "    let a = 1;",
      "",
      "    if a > 0 {",
      "        println!(\"hi\");",
      "    }",
      "    // endregion",
      "}",
    ].join("\n");

    expect(parseRegions(source).get("demo")).toBe(
      ['let a = 1;', "", "if a > 0 {", '    println!("hi");', "}"].join("\n"),
    );
  });

  it("refuses a region that never closes, is nested, or repeats", () => {
    expect(() => parseRegions("// region: a\nfn x() {}")).toThrow(/never closed/);
    expect(() => parseRegions("// region: a\n// region: b\n// endregion")).toThrow(/starts inside/);
    expect(() => parseRegions("// region: a\n// endregion\n// region: a\n// endregion")).toThrow(/twice/);
    expect(() => parseRegions("// endregion")).toThrow(/no region/);
  });
});

describe("region", () => {
  it("reads a snippet from the crate, without its markers", () => {
    const code = region("lesson0_setup", "add");
    expect(code).toBe("pub fn add(a: i32, b: i32) -> i32 {\n    a + b\n}");
    expect(code).not.toContain("region");
  });

  it("fails loudly for a region that does not exist", () => {
    expect(() => region("lesson0_setup", "nope")).toThrow(/No region/);
  });
});

describe("playgroundCode", () => {
  it("leaves a whole program alone", () => {
    expect(playgroundCode('fn main() {\n    println!("x");\n}')).toBe('fn main() {\n    println!("x");\n}\n');
  });

  it("wraps bare statements in main", () => {
    expect(playgroundCode("let a = 1;\nprintln!(\"{a}\");")).toBe(
      'fn main() {\n    let a = 1;\n    println!("{a}");\n}\n',
    );
  });

  it("gives items the demo as main", () => {
    const out = playgroundCode("pub fn two() -> i32 {\n    2\n}", "println!(\"{}\", two());");
    expect(out).toBe('pub fn two() -> i32 {\n    2\n}\n\nfn main() {\n    println!("{}", two());\n}\n');
  });

  it("gives items with no demo an empty main so they still compile", () => {
    expect(playgroundCode("pub fn two() -> i32 {\n    2\n}")).toContain("fn main() {}");
  });
});

describe("playgroundUrl", () => {
  it("carries the code, encoded, with the stable channel and 2021 edition", () => {
    const code = 'fn main() { println!("a b&c"); }';
    const url = new URL(playgroundUrl(code));
    expect(url.origin + url.pathname).toBe("https://play.rust-lang.org/");
    expect(url.searchParams.get("version")).toBe("stable");
    expect(url.searchParams.get("mode")).toBe("debug");
    expect(url.searchParams.get("edition")).toBe("2021");
    expect(url.searchParams.get("code")).toBe(code);
  });
});
