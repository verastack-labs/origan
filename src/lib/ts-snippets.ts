import { readFileSync } from "node:fs";
import { join } from "node:path";
import { switchCourse } from "@/data/courses";
import { region, type SnippetSource } from "./snippets";
import { tsPlaygroundUrl } from "./ts-playground";

/**
 * Snippets for The Switch.
 *
 * Every program on these pages is a real file under `ts/the-switch/`: a `.ts`
 * file that is type-checked with `strict` on and tested, and a `.js` file with
 * the same regions, which is the JavaScript it grew from. A page names a file
 * and a region, and the two are cut out of the files here, so the code you
 * read is the code that was checked.
 *
 * Snippets that are meant to FAIL live in `ts/the-switch/errors/`. Each starts
 * with two header lines that `scripts/check-ts-snippets.mjs` holds the compiler
 * to:
 *
 *     // expect-error: TS2551
 *     // expect-message: Property 'prise' does not exist on type ...
 *
 * and the line that must fail ends with `// @error`. The marker is removed
 * from what the page shows. The line is highlighted instead.
 *
 * Node-only, and safe because every route is prerendered at build time.
 */
export const TS_SOURCE: SnippetSource = switchCourse.snippets;
// The JavaScript lives in its own folder: a .js file beside a .ts file of the
// same name would be what `import "./x.js"` finds, instead of the TypeScript.
export const JS_SOURCE: SnippetSource = { dir: [...switchCourse.snippets.dir, "js"], ext: ".js" };

const MARK = /\s*\/\/ @error\s*$/;

export type ErrorSnippet = {
  /** What is shown and sent to the Playground: the region, with the markers removed. */
  code: string;
  /** Zero-based indexes of the lines that must fail. */
  errorLines: ReadonlySet<number>;
  /** For example `TS2551`. */
  errorCode: string;
  /** The compiler's message, word for word. */
  message: string;
};

/** The header lines of a snippet that is meant to fail. Throws if either is missing. */
export function parseErrorHeader(source: string, file: string): { errorCode: string; message: string } {
  const errorCode = /^\/\/ expect-error: (TS\d+)\s*$/m.exec(source)?.[1];
  const message = /^\/\/ expect-message: (.+?)\s*$/m.exec(source)?.[1];
  if (!errorCode) throw new Error(`${file}: missing "// expect-error: TSxxxx" header`);
  if (!message) throw new Error(`${file}: missing "// expect-message: ..." header`);
  return { errorCode, message };
}

/** Remove the `// @error` markers from a region and say which lines had one. */
export function stripErrorMarks(code: string): { code: string; errorLines: Set<number> } {
  const errorLines = new Set<number>();
  const lines = code.split("\n").map((line, i) => {
    if (!MARK.test(line)) return line;
    errorLines.add(i);
    return line.replace(MARK, "");
  });
  return { code: lines.join("\n"), errorLines };
}

/** A snippet that is meant to fail, by its file under `errors/` (no extension). */
export function errorSnippet(file: string, name = "code"): ErrorSnippet {
  const path = `errors/${file}`;
  const raw = readFileSync(join(process.cwd(), ...TS_SOURCE.dir, `${path}${TS_SOURCE.ext}`), "utf8");
  const header = parseErrorHeader(raw, path);
  const { code, errorLines } = stripErrorMarks(region(path, name, TS_SOURCE));
  if (errorLines.size === 0) throw new Error(`${path}: the region "${name}" has no line marked "// @error"`);
  return { code, errorLines, ...header };
}

/**
 * Which lines of two versions of a program are different. Compared by their
 * trimmed text with a longest-common-subsequence match, so a line that merely
 * moved down because something was added above it is not reported. Blank lines
 * are never reported.
 */
export function changedLines(left: string, right: string): { left: Set<number>; right: Set<number> } {
  const a = left.split("\n").map((l) => l.trim());
  const b = right.split("\n").map((l) => l.trim());
  const n = a.length;
  const m = b.length;
  const table = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));

  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      table[i][j] = a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }

  const out = { left: new Set<number>(), right: new Set<number>() };
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      i++;
      j++;
    } else if (table[i + 1][j] >= table[i][j + 1]) {
      if (a[i] !== "") out.left.add(i);
      i++;
    } else {
      if (b[j] !== "") out.right.add(j);
      j++;
    }
  }
  for (; i < n; i++) if (a[i] !== "") out.left.add(i);
  for (; j < m; j++) if (b[j] !== "") out.right.add(j);
  return out;
}

export type CompareProps = {
  file: string;
  name: string;
  /** A file under `errors/` whose region stands in for the TypeScript side, because it is meant to fail. */
  fail?: string;
};

/** Everything the Compare block shows, worked out once so a test can check it. */
export function compareParts({ file, name, fail }: CompareProps) {
  const js = region(file, name, JS_SOURCE);
  let ts: string;
  let errorLines: ReadonlySet<number> = new Set();
  let failure: ErrorSnippet | undefined;

  if (fail) {
    failure = errorSnippet(fail);
    ts = failure.code;
    errorLines = failure.errorLines;
  } else {
    ts = region(file, name, TS_SOURCE);
  }

  const changed = changedLines(js, ts);
  return { js, ts, jsChanged: changed.left, tsChanged: changed.right, errorLines, failure };
}

/** The program the Playground gets for a TypeScript snippet. */
export const playgroundHref = (code: string) => tsPlaygroundUrl(`${code}\n`);
