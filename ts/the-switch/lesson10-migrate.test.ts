import { readFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  demoConverted,
  demoTemporaryAny,
  discount,
  label,
  legacyTotal,
  priceOfItem,
} from "./lesson10-migrate";

afterEach(() => vi.restoreAllMocks());

/** The arguments of every console.log a demo made, one entry per call. */
function logged(run: () => unknown): unknown[] {
  const log = vi.spyOn(console, "log").mockImplementation(() => {});
  run();
  return log.mock.calls.map((args) => (args.length === 1 ? args[0] : args));
}

/** A strict-family flag: set on its own, or switched on by `strict`. */
const strictly = (o: ts.CompilerOptions, key: "noImplicitAny" | "strictNullChecks") => o[key] ?? o.strict ?? false;

const migrate = join(__dirname, "migrate");

/** The options of one rung of the ladder, read the way tsc reads a tsconfig. */
function rung(step: number): ts.CompilerOptions {
  const text = readFileSync(join(migrate, `tsconfig.step${step}.json`), "utf8");
  const parsed = ts.parseConfigFileTextToJson(`tsconfig.step${step}.json`, text);
  expect(parsed.error, `step ${step} is not valid JSON`).toBeUndefined();
  const converted = ts.convertCompilerOptionsFromJson(parsed.config.compilerOptions, migrate);
  expect(converted.errors.map((d) => ts.flattenDiagnosticMessageText(d.messageText, " "))).toEqual([]);
  return { ...converted.options, skipLibCheck: true };
}

/** What a rung finds in the sample file, as "TS2339" style codes in order. */
function findings(step: number): string[] {
  const file = join(migrate, "sample", "cart.js");
  const found = ts.getPreEmitDiagnostics(ts.createProgram([file], rung(step)));
  return found.map((d) => `TS${d.code}`);
}

describe("lesson 10: the demos", () => {
  it("the converted file does what the JavaScript did", () => {
    expect(logged(demoConverted)).toEqual([30, { name: "chai", price: 10 }]);
  });

  it("a temporary any still runs", () => {
    expect(logged(demoTemporaryAny)).toEqual([30]);
  });
});

describe("lesson 10: the strictness ladder", () => {
  it("every step is a valid tsconfig, and the page's progression only ever adds strictness", () => {
    const options = [1, 2, 3, 4, 5].map(rung);
    expect(options.map((o) => o.allowJs)).toEqual([true, true, true, true, true]);
    expect(options.map((o) => o.checkJs ?? false)).toEqual([false, true, true, true, true]);
    expect(options.map((o) => strictly(o, "noImplicitAny"))).toEqual([false, false, true, true, true]);
    expect(options.map((o) => strictly(o, "strictNullChecks"))).toEqual([false, false, false, true, true]);
    expect(options[4].strict).toBe(true);
  });

  it("step 1 checks no JavaScript, so a wrong call passes", () => {
    expect(findings(1)).toEqual([]);
  });

  it("step 2 finds a wrong call to a built-in method", () => {
    expect(findings(2)).toEqual(["TS2345"]);
  });

  it("step 3 also asks for a type on every parameter", () => {
    expect(findings(3)).toEqual(["TS7006", "TS7006", "TS7006", "TS7006", "TS7006", "TS2345"]);
  });

  it("step 4 also catches a value that may be undefined", () => {
    expect(findings(4)).toEqual([...findings(3), "TS18048"]);
  });

  it("step 5 finds at least everything step 4 did", () => {
    expect(findings(5)).toEqual(expect.arrayContaining(findings(4)));
  });
});

describe("lesson 10: the practice solutions", () => {
  it("discount and label keep their old behaviour", () => {
    expect(discount(200, 10)).toBe(180);
    expect(label({ name: "chai", price: 10 })).toBe("chai (Rs 10)");
  });

  it("legacyTotal still copes with the old caller that passes text", () => {
    expect(legacyTotal([10, 20])).toBe(30);
    expect(legacyTotal("10,20".split(",") as unknown as number[])).toBe(30);
  });

  it("priceOfItem admits an item that is not on the menu", () => {
    expect(priceOfItem("chai")).toBe(10);
    expect(priceOfItem("vada")).toBeUndefined();
  });
});
