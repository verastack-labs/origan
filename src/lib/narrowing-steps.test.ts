import { join } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { lineIndex, narrowingSteps, stepSpecs } from "./narrowing-steps";
import { region } from "./snippets";
import { TS_SOURCE } from "./ts-snippets";

/**
 * The narrowing stepper shows the type of `order` at each step. These tests ask
 * the compiler, with `strict` on, rather than trusting what is written: the
 * snippet is compiled as the file it is, and for each step the type checker is
 * asked for the type of the named expression on the named line.
 */
const code = region("lesson5-unions", "exhaustive", TS_SOURCE);
const fileName = join(process.cwd(), "ts", "the-switch", "narrowing-stepper.ts").replaceAll("\\", "/");
const isOurs = (name: string) => name.endsWith("/narrowing-stepper.ts");
const source = `${code}\n\nexport {};\n`;

const options: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.NodeNext,
  moduleResolution: ts.ModuleResolutionKind.NodeNext,
  strict: true,
  noEmit: true,
  skipLibCheck: true,
};

function compile() {
  const host = ts.createCompilerHost(options);
  const getSourceFile = host.getSourceFile.bind(host);
  host.getSourceFile = (name, languageVersion, ...rest) =>
    isOurs(name) ? ts.createSourceFile(name, source, languageVersion, true) : getSourceFile(name, languageVersion, ...rest);
  const fileExists = host.fileExists.bind(host);
  host.fileExists = (name) => isOurs(name) || fileExists(name);
  const readFile = host.readFile.bind(host);
  host.readFile = (name) => (isOurs(name) ? source : readFile(name));
  const program = ts.createProgram([fileName], options, host);
  return { program, checker: program.getTypeChecker(), file: program.getSourceFiles().find((f) => isOurs(f.fileName))! };
}

/** The first node on `line` (zero-based) whose source text is exactly `expr`. */
function findOnLine(file: ts.SourceFile, line: number, expr: string): ts.Node {
  let found: ts.Node | undefined;
  const visit = (node: ts.Node) => {
    if (found) return;
    const isExpr = ts.isIdentifier(node) || ts.isPropertyAccessExpression(node);
    if (isExpr && node.getText(file) === expr && file.getLineAndCharacterOfPosition(node.getStart(file)).line === line) {
      found = node;
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  if (!found) throw new Error(`no "${expr}" on line ${line + 1}`);
  return found;
}

const { program, checker, file } = compile();

describe("the narrowing stepper", () => {
  it("is built on a snippet that compiles cleanly under strict", () => {
    const problems = ts.getPreEmitDiagnostics(program, file).map((d) => ts.flattenDiagnosticMessageText(d.messageText, " "));
    expect(problems).toEqual([]);
  });

  it.each(stepSpecs.map((spec, i) => [i + 1, spec] as const))("step %i shows the type the compiler reports", (_n, spec) => {
    const node = findOnLine(file, lineIndex(code, spec.probe), spec.expr);
    const type = checker.getTypeAtLocation(node);
    expect(checker.typeToString(type)).toBe(spec.type);
    if (spec.members) {
      expect(type.isUnion()).toBe(true);
      const members = (type as ts.UnionType).types.map((t) => checker.typeToString(t)).join(" | ");
      expect(members).toBe(spec.members);
    }
  });

  it("walks the checks in order, ending at never", () => {
    expect(stepSpecs.map((s) => s.type)).toEqual([
      "Order",
      '"chai" | "coffee" | "lassi"',
      "ChaiOrder",
      "CoffeeOrder",
      "LassiOrder",
      "never",
    ]);
  });

  it("lights up real lines, in order, and never the same line in two steps", () => {
    const steps = narrowingSteps(code);
    const lineCount = code.split("\n").length;
    const all = steps.flatMap((s) => s.lines);
    for (const line of all) {
      expect(line).toBeGreaterThanOrEqual(0);
      expect(line).toBeLessThan(lineCount);
    }
    expect(new Set(all).size).toBe(all.length);
    expect(all).toEqual([...all].sort((a, b) => a - b));
  });

  it("fails loudly when a line it lights up is no longer in the snippet", () => {
    expect(() => lineIndex(code, 'case "tea":')).toThrow(/expected exactly one line/);
  });
});
