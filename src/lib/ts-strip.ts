import { stripTypeScriptTypes } from "node:module";

// The installed @types/node (v20) predates Node's type stripper, which arrived
// in Node 22.13. Declare the one function used, here, until the types catch up.
declare module "node:module" {
  function stripTypeScriptTypes(code: string, options?: { mode?: "strip" | "transform" }): string;
}

/**
 * What stripping the types from a TypeScript snippet leaves, worked out with
 * Node's own type stripper (the same one `node file.ts` uses, which lesson 1
 * teaches), so the JavaScript shown is the JavaScript that really runs.
 *
 * Node blanks each type out with spaces, so every character stays where it
 * was. That is what makes the fade possible: comparing the original with the
 * blanked copy says exactly which characters were types. This module turns
 * that into
 *
 * - `ranges` on each line: the stretches of a line that are types,
 * - `gone`: a whole line that is nothing but a type, which closes up on its own,
 * - `js`: the code with those parts taken out, which is what the toggle ends on.
 *
 * Node-only, and safe because the pages are prerendered at build time.
 */
export type StripLine = {
  /** The line as written, types and all. */
  text: string;
  /** True when the line is only types (or a blank line left stranded by one), so it closes up entirely. */
  gone: boolean;
  /** Half-open character ranges `[from, to)` of the types in this line. */
  ranges: [number, number][];
};

export type Stripped = { lines: StripLine[]; js: string };

/** Stretches of a line that Node blanked out, with whitespace between two of them folded in. */
function rangesOf(original: string, blanked: string): [number, number][] {
  const out: [number, number][] = [];
  let start = -1;
  for (let i = 0; i <= original.length; i++) {
    const blank = i < original.length && original[i] !== blanked[i];
    if (blank && start < 0) start = i;
    if (!blank && start >= 0) {
      out.push([start, i]);
      start = -1;
    }
  }

  // `: string` is blanked as one stretch, but a type with spaces in it
  // (`string | null`) shows up as several, because the spaces were spaces
  // already. Fold stretches that only whitespace separates into one.
  const merged: [number, number][] = [];
  for (const range of out) {
    const last = merged[merged.length - 1];
    if (last && original.slice(last[1], range[0]).trim() === "") last[1] = range[1];
    else merged.push([...range]);
  }

  // A type at the end of a statement leaves the space before it behind
  // (`value as number;` would close up to `value ;`). Take that space too.
  return merged.map(([from, to]) => {
    const next = original.slice(to).trimStart()[0];
    let f = from;
    if (next === undefined || ";,)}".includes(next)) while (f > 0 && original[f - 1] === " ") f -= 1;
    return [f, to] as [number, number];
  });
}

export function stripTypes(code: string): Stripped {
  const blanked = stripTypeScriptTypes(code, { mode: "strip" });
  const originals = code.split("\n");
  const blanks = blanked.split("\n");
  if (originals.length !== blanks.length) {
    throw new Error("ts-strip: Node's type stripper changed the number of lines, so the types cannot be located");
  }

  let anyShown = false;
  let lastShownBlank = false;
  const lines: StripLine[] = originals.map((text, i) => {
    const isBlank = text.trim() === "";
    let gone = !isBlank && blanks[i].trim() === "";
    // A blank line that would be left at the top, or beside another blank
    // line, closes up as well.
    if (isBlank && (!anyShown || lastShownBlank)) gone = true;
    if (!gone) {
      anyShown = true;
      lastShownBlank = isBlank;
    }
    return { text, gone, ranges: gone || isBlank ? [] : rangesOf(text, blanks[i]) };
  });

  // A blank line left at the very end closes up too.
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].gone) continue;
    if (lines[i].text.trim() !== "") break;
    lines[i].gone = true;
  }

  const js = lines
    .filter((line) => !line.gone)
    .map((line) => {
      let kept = "";
      let at = 0;
      for (const [from, to] of line.ranges) {
        kept += line.text.slice(at, from);
        at = to;
      }
      return (kept + line.text.slice(at)).trimEnd();
    })
    .join("\n");

  return { lines, js };
}
