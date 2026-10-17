import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { decompressFromEncodedURIComponent } from "lz-string";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { switchCourse } from "@/data/courses";
import { PLAYGROUND, tsPlaygroundUrl } from "./ts-playground";
import { errorSnippet, JS_SOURCE, TS_SOURCE } from "./ts-snippets";
import { region } from "./snippets";

/**
 * The programs a reader can open in the TypeScript Playground, built the way
 * the page builds them, and held to what the lesson says about them:
 *
 * - a snippet that is shown as working has no errors under `strict`;
 * - a snippet that is shown as failing fails with exactly the error shown;
 * - the Playground link carries the code, and decodes back to it.
 *
 * The Playground compiles one loose file with the default libraries, so that
 * is what is checked here, rather than a module in the project.
 */
const dir = join(process.cwd(), ...switchCourse.contentDir);
const pages = readdirSync(dir).filter((f) => f.endsWith(".mdx"));

const attr = (text: string, key: string) => new RegExp(`(?:^|\\s)${key}="([^"]*)"`, "m").exec(text)?.[1];

type Program = { label: string; code: string; expect?: { code: string; line: number } };

function programsOf(mdx: string, page: string): Program[] {
  const out: Program[] = [];

  for (const m of mdx.matchAll(/<Snippet\s+([\s\S]*?)\/>/g)) {
    const file = attr(m[1], "file");
    const name = attr(m[1], "name");
    if (!file || !name || /\sjs(\s|$)/.test(m[1])) continue;
    out.push({ label: `${page}: ${file} ${name}`, code: region(file, name, TS_SOURCE) });
  }

  for (const m of mdx.matchAll(/<Compare\s+([\s\S]*?)\/>/g)) {
    const file = attr(m[1], "file");
    const name = attr(m[1], "name");
    const fail = attr(m[1], "fail");
    if (!file || !name) continue;
    if (fail) {
      const snippet = errorSnippet(fail);
      out.push({
        label: `${page}: compare ${fail}`,
        code: snippet.code,
        expect: { code: snippet.errorCode, line: [...snippet.errorLines][0] + 1 },
      });
    } else {
      out.push({ label: `${page}: compare ${file} ${name}`, code: region(file, name, TS_SOURCE) });
    }
  }

  for (const m of mdx.matchAll(/<Fails\s+([\s\S]*?)\/>/g)) {
    const file = attr(m[1], "file");
    if (!file) continue;
    const snippet = errorSnippet(file, attr(m[1], "name") ?? "code");
    out.push({
      label: `${page}: fails ${file}`,
      code: snippet.code,
      expect: { code: snippet.errorCode, line: [...snippet.errorLines][0] + 1 },
    });
  }

  for (const m of mdx.matchAll(/<Practice\b([\s\S]*?)\n>/g)) {
    const file = attr(m[1], "file");
    const solution = attr(m[1], "solution");
    if (file && solution) out.push({ label: `${page}: solution ${solution}`, code: region(file, solution, TS_SOURCE) });
  }
  return out;
}

/** Compile one loose file the way the Playground does: strict, default libraries, no module. */
function compile(code: string): readonly ts.Diagnostic[] {
  const name = "/playground.ts";
  const options: ts.CompilerOptions = { strict: true, target: ts.ScriptTarget.ES2022, noEmit: true, types: [] };
  const host = ts.createCompilerHost(options);
  const original = host.getSourceFile.bind(host);
  host.getSourceFile = (file, languageVersion, ...rest) =>
    file === name ? ts.createSourceFile(file, code, languageVersion) : original(file, languageVersion, ...rest);
  const fileExists = host.fileExists.bind(host);
  host.fileExists = (file) => file === name || fileExists(file);
  const program = ts.createProgram([name], options, host);
  return ts.getPreEmitDiagnostics(program);
}

const all = pages.flatMap((page) =>
  programsOf(readFileSync(join(dir, page), "utf8"), page.replace(/\.mdx$/, "")),
);

describe("the programs on The Switch's pages", () => {
  it("finds a good number of them", () => {
    expect(all.length).toBeGreaterThan(5);
  });

  it.each(all.map((p) => [p.label, p] as const))("%s behaves as the lesson says", (_, program) => {
    const found = compile(program.code);
    const summary = found
      .map((d) => `TS${d.code}: ${ts.flattenDiagnosticMessageText(d.messageText, " ")}`)
      .join("\n");

    if (!program.expect) {
      expect(summary).toBe("");
      return;
    }
    expect([...new Set(found.map((d) => `TS${d.code}`))]).toEqual([program.expect.code]);
    for (const d of found) {
      expect(d.file!.getLineAndCharacterOfPosition(d.start!).line + 1).toBe(program.expect.line);
    }
  });

  it.each(all.map((p) => [p.label, p] as const))("%s has a Playground link that decodes back to it", (_, program) => {
    const url = tsPlaygroundUrl(`${program.code}\n`);
    expect(url.startsWith(PLAYGROUND)).toBe(true);
    expect(decompressFromEncodedURIComponent(url.slice(PLAYGROUND.length))).toBe(`${program.code}\n`);
  });
});

describe("the JavaScript starting points", () => {
  it("each practice start is plain JavaScript that has a region", () => {
    for (const page of pages) {
      const mdx = readFileSync(join(dir, page), "utf8");
      for (const m of mdx.matchAll(/<Practice\b([\s\S]*?)\n>/g)) {
        const start = attr(m[1], "start");
        const file = attr(m[1], "file");
        expect(region(file!, start!, JS_SOURCE).length, `${page}: ${start}`).toBeGreaterThan(10);
      }
    }
  });
});
