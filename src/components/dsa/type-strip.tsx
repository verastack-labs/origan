import { codeToHtml } from "shiki";
import { region } from "@/lib/snippets";
import { TS_SOURCE } from "@/lib/ts-snippets";
import { stripTypes } from "@/lib/ts-strip";
import { theme } from "./ts-code";
import { TypeStripView } from "./type-strip-view";

/**
 * A TypeScript snippet with a "Strip the types" switch: turn it on and the
 * labels fade out and the gaps close, leaving the JavaScript that actually
 * runs. Lesson 0 uses it to show that types are only for you and your tools;
 * lesson 1 uses it for what `node file.ts` does.
 *
 * Everything that needs the files happens here, at build time: the snippet is
 * a real, tested region, and which characters are types comes from Node's own
 * type stripper (see `src/lib/ts-strip.ts`), so the JavaScript on the far side
 * of the switch is the real output, not something typed by hand.
 */
export async function TypeStrip({ file, name }: { file: string; name: string }) {
  const code = region(file, name, TS_SOURCE);
  const { lines, js } = stripTypes(code);

  const html = await codeToHtml(code, {
    lang: "typescript",
    theme,
    // Each type is wrapped, so the page can fade it and close it up. Its width
    // in characters travels with it: the face is monospaced, so `ch` is exact.
    decorations: lines.flatMap((line, i) =>
      line.ranges.map(([from, to]) => ({
        start: { line: i, character: from },
        end: { line: i, character: to },
        properties: { class: "ts-strip", style: `--w:${to - from}` },
      })),
    ),
    transformers: [
      {
        line(node, line) {
          const gone = lines[line - 1];
          if (gone?.gone) this.addClassToHast(node, gone.text.trim() === "" ? "ts-gone ts-blank" : "ts-gone");
        },
        // Lines are blocks here, so the newline between them would be a second line break.
        code(node) {
          node.children = node.children.filter((child) => !(child.type === "text" && child.value === "\n"));
        },
      },
    ],
  });

  return <TypeStripView html={html} ts={code} js={js} />;
}
