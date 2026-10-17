import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import ts from "typescript";
import { afterEach, describe, expect, it, vi } from "vitest";
import { parseRegions } from "../../src/lib/snippets";
import {
  demoAnyFixed,
  demoAnyPass,
  demoAsConst,
  demoAsPass,
  demoBangPass,
  demoBraces,
  demoDoubleCast,
  demoEnum,
  demoEnumLoose,
  demoPlainObject,
  demoSatisfies,
  demoUnion,
  lengthOf,
  menuPrices,
  sizePrice,
} from "./lesson11-traps";

afterEach(() => vi.restoreAllMocks());

/** What a demo printed before it finished or threw, one entry per console.log. */
function printed(run: () => unknown): string[] {
  const log = vi.spyOn(console, "log").mockImplementation(() => {});
  try {
    run();
  } catch {
    // The demos that end in a crash are checked separately.
  }
  return log.mock.calls.map((call) => call.join(" "));
}

describe("lesson 11: the escape hatches that let a crash through", () => {
  it("any compiles a call that crashes when it runs", () => {
    expect(printed(demoAnyPass)).toEqual(["CHAI"]);
    expect(() => demoAnyPass()).toThrow(TypeError);
  });

  it("as claims a shape the data never had", () => {
    expect(printed(demoAsPass)).toEqual(["Asha"]);
    expect(() => demoAsPass()).toThrow(TypeError);
  });

  it("! promises a value is there when it is not", () => {
    expect(() => demoBangPass()).toThrow(TypeError);
  });

  it("a double cast gives a number that is really text", () => {
    expect(printed(demoDoubleCast)).toEqual(["string"]);
  });

  it("the honest version just types the parameter", () => {
    expect(printed(demoAnyFixed)).toEqual(["CHAI"]);
  });
});

describe("lesson 11: the fair uses", () => {
  it("as const keeps the exact word", () => {
    expect(printed(demoAsConst)).toEqual(["chai"]);
    expect(demoAsConst()).toBe(true);
  });

  it("satisfies checks the shape and keeps the exact keys", () => {
    expect(printed(demoSatisfies)).toEqual(["10"]);
    expect(demoSatisfies()).toBe(true);
  });

  it("Record<string, unknown> is the type for a plain bag of keys", () => {
    expect(printed(demoPlainObject)).toEqual(["2"]);
  });

  it("{} accepts every value that exists, and object only accepts objects", () => {
    expect(demoBraces()).toEqual([42, "chai", { kind: "chai" }]);
  });
});

describe("lesson 11: enums and unions", () => {
  it("both give the same answer", () => {
    expect(printed(demoEnum)).toEqual(["20"]);
    expect(printed(demoUnion)).toEqual(["20"]);
  });

  it("a numeric enum accepts any number at all", () => {
    expect(printed(demoEnumLoose)).toEqual(["7"]);
  });

  it("an enum becomes real JavaScript, exactly as the page shows it", () => {
    const shown = parseRegions(readFileSync(join(__dirname, "js", "lesson11-traps.js"), "utf8")).get("enum-output")!;
    const made = ts.transpileModule("enum Drink { Chai, Coffee, Lassi }", {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    }).outputText;
    const squash = (text: string) => text.replace(/\s+/g, " ").trim();
    expect(squash(made)).toBe(squash(shown));
  });

  it("Node's type stripping refuses an enum, because there is nothing to strip", () => {
    const folder = mkdtempSync(join(tmpdir(), "switch-enum-"));
    const file = join(folder, "enum.ts");
    writeFileSync(file, "enum Drink { Chai }\nconsole.log(Drink.Chai);\n");
    const run = spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", file], {
      encoding: "utf8",
      cwd: folder,
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/enum is not supported/i);
  });
});

describe("lesson 11: the practice solutions", () => {
  it("lengthOf measures only what has a length", () => {
    expect(lengthOf("chai")).toBe(4);
    expect(lengthOf([1, 2, 3])).toBe(3);
    expect(lengthOf(42)).toBe(0);
    expect(lengthOf(null)).toBe(0);
  });

  it("sizePrice reads the table", () => {
    expect(sizePrice("small")).toBe(10);
    expect(sizePrice("large")).toBe(20);
  });

  it("menuPrices keeps its known keys", () => {
    expect(menuPrices.chai).toBe(10);
  });
});
