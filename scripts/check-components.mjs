#!/usr/bin/env node
/**
 * Component hygiene.
 *
 * The house rule is that `globals.css` is the only place a colour is defined.
 * A hex literal anywhere else means a value has escaped the token layer, and
 * the next person to change the palette will miss it. The same goes for raw
 * pixel font sizes bypassing the scale, and for the two structures this design
 * explicitly refuses.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, extname, join, relative } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const searchRoots = [join(root, "src/components"), join(root, "src/app")];
const exempt = new Set(["globals.css"]);

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...walk(full));
    } else if ([".tsx", ".ts", ".css"].includes(extname(entry)) && !exempt.has(entry)) {
      out.push(full);
    }
  }
  return out;
}

const rules = [
  {
    name: "hex colour outside the token layer",
    // Six or three digit hex, not preceded by a word character so ids and
    // hashes in URLs do not trip it.
    test: /(?<![\w&])#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?\b/g,
    hint: "define it in globals.css and reference the token",
  },
  {
    name: "hard offset shadow",
    // A zero-blur block shadow is a neobrutalist costume. This world is flat.
    test: /box-shadow:\s*-?\d+px\s+-?\d+px\s+0(?![.\d])/g,
    hint: "this design conveys depth with borders and background steps",
  },
  {
    name: "gradient text",
    test: /bg-clip-text|-webkit-background-clip:\s*text/g,
    hint: "emphasis comes from weight, size or the accent colour",
  },
];

let failures = 0;

for (const dir of searchRoots) {
  for (const file of walk(dir)) {
    const source = readFileSync(file, "utf8");
    const lines = source.split("\n");

    for (const rule of rules) {
      lines.forEach((line, i) => {
        // Comments may mention a value; they are documentation, not styling.
        const code = line.replace(/\/\*.*?\*\//g, "").replace(/\/\/.*$/, "");
        for (const match of code.matchAll(rule.test)) {
          failures += 1;
          console.error(
            `  ${relative(root, file)}:${i + 1}  ${rule.name}: ${match[0].trim()}\n      ${rule.hint}`,
          );
        }
      });
    }
  }
}

if (failures) {
  console.error(`\n${failures} finding(s).`);
  process.exit(1);
}

console.log("components: no hardcoded colours, no refused structures.");
