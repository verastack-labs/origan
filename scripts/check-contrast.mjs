#!/usr/bin/env node
/**
 * Contrast check.
 *
 * Reads the token values straight out of `globals.css` rather than from a copy,
 * so the check cannot drift from the palette it is checking. Every pair the
 * design actually uses is listed with the threshold that applies to it.
 *
 * WCAG 2.1 AA: 4.5:1 for body text, 3:1 for large text (at least 24px, or 19px
 * bold) and for the boundary of a user interface component.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parseThemes, ratio } from "./lib/contrast.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const themes = parseThemes(readFileSync(join(root, "src/app/globals.css"), "utf8"));

/** [foreground, background, minimum, what it is]. */
const pairs = [
  ["fg", "ground", 4.5, "body text on the page"],
  ["fg", "ground-2", 4.5, "body text on a banded section"],
  ["fg", "panel", 4.5, "body text inside a panel"],
  ["fg-2", "ground", 4.5, "secondary copy on the page"],
  ["fg-2", "ground-2", 4.5, "secondary copy on a banded section"],
  ["fg-2", "panel", 4.5, "secondary copy inside a panel"],
  ["fg-3", "ground", 4.5, "notation labels on the page"],
  ["fg-3", "ground-2", 4.5, "notation labels on a banded section"],
  ["fg-3", "panel", 4.5, "notation labels inside a panel"],
  ["survey", "ground", 4.5, "accent text and links"],
  ["survey", "ground-2", 4.5, "accent text on a banded section"],
  ["survey", "panel", 4.5, "accent text inside a panel"],
  ["survey-ink", "survey", 4.5, "label on the primary control"],
  ["warn", "panel", 4.5, "the warn tone inside a panel"],
  ["survey-2", "ground", 3, "the surface model, a graphical boundary"],
  ["line", "ground", 1.2, "rules, which only need to be perceptible"],
];

let failed = 0;

// Every pair, against both palettes. A colour that passes on the dark ground
// says nothing about the light one.
for (const [theme, tokens] of Object.entries(themes)) {
  const rows = [];

  for (const [fg, bg, min, what] of pairs) {
    if (!tokens[fg] || !tokens[bg]) {
      console.error(`  missing ${theme} token: ${!tokens[fg] ? fg : bg}`);
      failed += 1;
      continue;
    }
    const r = ratio(tokens[fg], tokens[bg]);
    const ok = r >= min;
    if (!ok) failed += 1;
    rows.push(
      `  ${ok ? "ok  " : "FAIL"}  ${r.toFixed(2).padStart(5)}:1  (min ${String(min).padStart(3)})  ${fg} on ${bg}  — ${what}`,
    );
  }

  console.log(`contrast, ${theme}\n` + rows.join("\n") + "\n");
}

if (failed) {
  console.error(`${failed} pair(s) below threshold. Adjust the tokens in globals.css.`);
  process.exit(1);
}

console.log(`All ${pairs.length} pairs pass in both themes.`);
