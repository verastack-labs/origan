import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { region } from "./snippets";
import { TS_SOURCE } from "./ts-snippets";
import { stripTypes } from "./ts-strip";

const demo = region("lesson0-why", "strip-demo", TS_SOURCE);
const hello = region("lesson1-setup", "hello", TS_SOURCE);

/** The program with every space and line break taken out, to compare two spellings of the same code. */
const squash = (text: string) => text.replace(/\s+/g, "");

describe("stripTypes", () => {
  it("leaves the JavaScript of the lesson 0 demo, with the type alias line closed up", () => {
    expect(stripTypes(demo).js).toBe(
      [
        "function total(order, quantity) {",
        "  return order.price * quantity;",
        "}",
        "",
        'const chai = { item: "chai", price: 15 };',
        "console.log(total(chai, 2));",
      ].join("\n"),
    );
  });

  it("leaves the JavaScript of the lesson 1 hello program", () => {
    expect(stripTypes(hello).js).toBe(
      ["function shout(message) {", '  return message.toUpperCase() + "!";', "}", "", 'console.log(shout("hello, typescript"));'].join("\n"),
    );
  });

  it("marks the types in a line, and a line that is only a type as gone", () => {
    const { lines } = stripTypes(demo);
    expect(lines[0].gone).toBe(true); // type Order = ...
    expect(lines[1].gone).toBe(true); // the blank line that would be left at the top
    const fn = lines.find((l) => l.text.startsWith("function total"))!;
    expect(fn.ranges.map(([a, b]) => fn.text.slice(a, b))).toEqual([": Order", ": number", ": number"]);
  });

  it.each([
    ["the lesson 0 demo", demo],
    ["the lesson 1 hello program", hello],
  ])("agrees with Node's own stripper on %s", (_name, code) => {
    // Same program, ignoring only the spaces Node leaves where a type was.
    expect(squash(stripTypes(code).js)).toBe(squash(stripTypeScriptTypes(code, { mode: "strip" })));
  });

  it.each([
    ["the lesson 0 demo", demo, "30\n"],
    ["the lesson 1 hello program", hello, "HELLO, TYPESCRIPT!\n"],
  ])("the stripped %s runs, and prints what the TypeScript prints", (_name, code, printed) => {
    const dir = mkdtempSync(join(tmpdir(), "strip-"));
    const tsFile = join(dir, "program.ts");
    const jsFile = join(dir, "program.js");
    writeFileSync(tsFile, code);
    writeFileSync(jsFile, stripTypes(code).js);
    const viaNode = spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", tsFile], { encoding: "utf8" });
    const viaJs = spawnSync(process.execPath, [jsFile], { encoding: "utf8" });
    expect(viaNode.stdout).toBe(printed);
    expect(viaJs.stdout).toBe(printed);
  });

  it("takes the space before a trailing type with it", () => {
    expect(stripTypes("const a = b as number;").js).toBe("const a = b;");
  });

  it("closes a blank line left beside another", () => {
    const { js } = stripTypes("const a = 1;\n\ntype T = string;\n\nconst b = 2;");
    expect(js).toBe("const a = 1;\n\nconst b = 2;");
  });
});
