import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Snippets for the lesson pages.
 *
 * The code on a page is never typed into the MDX. It lives in a tested project
 * (the crate at `rust/rust-dsa/`, the classes at `java/java-collections/`),
 * between `// region: name` and `// endregion` markers, where the tests
 * compile and run it. A page names a file and a region, and this module cuts
 * the lines out. So the page shows exactly what was tested. Both languages use
 * `//` comments, so one marker syntax serves both.
 *
 * Node-only, and safe because every route is prerendered at build time.
 */
export type SnippetSource = { readonly dir: readonly string[]; readonly ext: string };

/** DSA in Rust, the default so the original callers keep working. */
const RUST: SnippetSource = { dir: ["rust", "rust-dsa", "src"], ext: ".rs" };

const START = /^\s*\/\/ region: ([a-z0-9-]+)\s*$/;
const END = /^\s*\/\/ endregion\s*$/;

/** Every region in a source file, by name, with indentation removed. */
export function parseRegions(source: string): Map<string, string> {
  const regions = new Map<string, string>();
  const lines = source.split(/\r?\n/);
  let name: string | null = null;
  let body: string[] = [];

  for (const line of lines) {
    const start = START.exec(line);
    if (start) {
      if (name) throw new Error(`Region "${start[1]}" starts inside "${name}"`);
      if (regions.has(start[1])) throw new Error(`Region "${start[1]}" is defined twice`);
      name = start[1];
      body = [];
      continue;
    }
    if (END.test(line)) {
      if (!name) throw new Error("`// endregion` with no region open");
      regions.set(name, dedent(body));
      name = null;
      continue;
    }
    if (name) body.push(line);
  }
  if (name) throw new Error(`Region "${name}" is never closed`);
  return regions;
}

function dedent(lines: string[]): string {
  // Drop blank lines at both ends, then remove the indentation every line shares.
  let from = 0;
  let to = lines.length;
  while (from < to && lines[from].trim() === "") from += 1;
  while (to > from && lines[to - 1].trim() === "") to -= 1;
  const body = lines.slice(from, to);
  const indents = body.filter((l) => l.trim() !== "").map((l) => /^ */.exec(l)![0].length);
  const cut = indents.length ? Math.min(...indents) : 0;
  return body.map((l) => l.slice(cut).trimEnd()).join("\n");
}

const cache = new Map<string, Map<string, string>>();

export function regionsOf(file: string, source: SnippetSource = RUST): Map<string, string> {
  const path = join(process.cwd(), ...source.dir, `${file}${source.ext}`);
  let regions = cache.get(path);
  if (!regions) {
    regions = parseRegions(readFileSync(path, "utf8"));
    cache.set(path, regions);
  }
  return regions;
}

/** One region, or a loud failure: a missing snippet must stop the build. */
export function region(file: string, name: string, source: SnippetSource = RUST): string {
  const code = regionsOf(file, source).get(name);
  if (code === undefined) {
    throw new Error(`No region "${name}" in ${source.dir.join("/")}/${file}${source.ext}`);
  }
  return code;
}

export function hasRegion(file: string, name: string, source: SnippetSource = RUST): boolean {
  return regionsOf(file, source).has(name);
}

const indent = (code: string) =>
  code
    .split("\n")
    .map((l) => (l === "" ? l : `    ${l}`))
    .join("\n");

/** Top-level Rust items, as opposed to statements that need a function around them. */
const ITEM = /^(pub(\([a-z]+\))?\s+)?(unsafe\s+)?(async\s+)?(fn|struct|enum|impl|trait|use|const|static|mod|type)\b|^#\[/;

/** Lines that only continue the one before: a closing bracket, a method chain, `else`. */
const CONTINUATION = /^[})\].]|^(else|where)\b/;

/**
 * True when every top-level line starts an item. A single top-level statement
 * (a `let`, a call) means the whole snippet belongs inside `main`, where items
 * such as a `use` or a local `struct` are still valid.
 */
function onlyItems(code: string): boolean {
  const starts = code
    .split("\n")
    .filter((l) => l !== "" && !/^\s/.test(l) && !l.startsWith("//") && !CONTINUATION.test(l));
  return starts.length > 0 && starts.every((l) => ITEM.test(l));
}

/**
 * Make a snippet into something the Playground will run. A program is left
 * alone. Items get the demo as `main`. Bare statements, with or without a
 * `use` or a local type among them, are wrapped in `main`.
 */
export function playgroundCode(code: string, demo?: string): string {
  if (/\bfn\s+main\s*\(/.test(code)) return `${code}\n`;
  if (demo) return `${code}\n\nfn main() {\n${indent(demo)}\n}\n`;
  if (onlyItems(code)) return `${code}\n\nfn main() {}\n`;
  return `fn main() {\n${indent(code)}\n}\n`;
}

export function playgroundUrl(code: string): string {
  return `https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&code=${encodeURIComponent(code)}`;
}

export type SnippetProps = {
  file: string;
  name: string;
  also?: string;
  demo?: string;
  play?: boolean;
};

/**
 * The program a `<Snippet>` sends to the Playground, or undefined when it has
 * no link. This mirrors what `snippet.tsx` does, so a test can compile exactly
 * what a reader would open.
 */
export function snippetProgram(
  { file, name, also, demo, play = true }: SnippetProps,
  source: SnippetSource = RUST,
): string | undefined {
  if (!play) return undefined;
  const code = region(file, name, source);
  const demoName = demo ?? `${name}-demo`;
  const demoCode = hasRegion(file, demoName, source) ? region(file, demoName, source) : undefined;
  const before = also ? also.split(",").map((r) => region(file, r.trim(), source)) : [];
  return playgroundCode([...before, code].join("\n\n"), demoCode);
}
