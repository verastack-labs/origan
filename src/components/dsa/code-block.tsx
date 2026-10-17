import { codeToHtml, createCssVariablesTheme } from "shiki";
import { playgroundUrl } from "@/lib/snippets";
import { CopyButton } from "./copy-button";

/**
 * Highlighted at build time. The theme writes CSS variables rather than
 * colours, and `globals.css` points them at the site's tokens, so a block
 * follows the dark and light palettes without shipping a highlighter.
 */
const theme = createCssVariablesTheme({
  name: "origan",
  variablePrefix: "--shiki-",
  variableDefaults: {},
  fontStyle: true,
});

const labels: Record<string, string> = { rust: "Rust", java: "Java", bash: "Terminal", text: "Output" };

/**
 * One block of code: the label, a copy button, and, for Rust, a link that
 * opens the same program in the Rust Playground. Java has no official browser
 * playground, so a Java block carries a small tip instead: paste it into
 * jshell, the console that ships with the JDK.
 *
 * `code` is what is shown and copied. `program` is what the Playground gets,
 * which differs when the snippet is not a whole program and needs a `main`.
 */
export async function CodeBlock({
  code,
  lang = "rust",
  program,
  tip = true,
}: {
  code: string;
  lang?: string;
  program?: string;
  /** Java only: the "paste into jshell" note. Left off whole programs, which are saved and compiled instead. */
  tip?: boolean;
}) {
  const html = await codeToHtml(code, { lang, theme });

  return (
    <figure className="code-block my-6 overflow-hidden rounded-panel border border-line bg-panel">
      <figcaption className="flex items-center justify-between gap-3 border-b border-line-2 px-3 py-2">
        <span className="notation">{labels[lang] ?? lang}</span>
        <span className="flex items-center gap-2">
          <CopyButton code={code} />
          {program !== undefined && (
            <a
              href={playgroundUrl(program)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-control border border-line px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.09em] text-fg-2 transition-colors hover:border-survey-2 hover:text-fg"
            >
              Run in Rust Playground<span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </span>
      </figcaption>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {lang === "java" && tip && (
        <p className="border-t border-line-2 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3">
          Paste into jshell to try it
        </p>
      )}
    </figure>
  );
}
