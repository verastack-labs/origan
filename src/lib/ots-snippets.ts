import { region, type SnippetSource } from "./snippets";
import type { Lang } from "@/components/dsa/ts-code";

/**
 * Snippets for Off the Syllabus.
 *
 * Every sample on these pages is a real file under `ts/off-the-syllabus/`,
 * cut out by region like the courses'. TypeScript is type-checked with
 * `strict` on and tested; JavaScript has to parse; HTML, CSS and JSON-LD have
 * to be well formed (`ots-articles.test.ts` holds them to it). The page names
 * a file and a region, so the code you read is the code that was checked.
 *
 * Shell commands are the exception: they are written in the MDX as fences,
 * because `curl` is not run in CI.
 */
export const OTS_SOURCE: SnippetSource = { dir: ["ts", "off-the-syllabus"], ext: ".ts" };

const byExtension: Record<string, Lang> = {
  ts: "typescript",
  js: "javascript",
  mjs: "javascript",
  json: "json",
  html: "html",
  css: "css",
};

/** The language a sample file is shown as. A name with no extension is TypeScript. */
export function langOfSample(file: string): Lang {
  const ext = /\.([a-z]+)$/.exec(file)?.[1] ?? "ts";
  const lang = byExtension[ext];
  if (!lang) throw new Error(`No language for sample file "${file}"`);
  return lang;
}

export function sampleCode(file: string, name: string): string {
  return region(file, name, OTS_SOURCE);
}
