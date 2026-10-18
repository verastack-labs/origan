import type { ReactNode } from "react";
import { codeToHtml, createCssVariablesTheme } from "shiki";
import { compareParts, errorSnippet, playgroundHref, type CompareProps } from "@/lib/ts-snippets";
import { CompareView } from "./compare-view";
import { CopyButton } from "./copy-button";

/**
 * Code for The Switch: JavaScript and TypeScript, highlighted at build time
 * with the same css-variables theme as every other block on the site, so it
 * follows the dark and light palettes.
 *
 * Lines can carry a mark. `diff` is a line that differs between the JavaScript
 * and the TypeScript; `error` is a line TypeScript refuses. The marks are
 * classes on the line, and `globals.css` tints them with tokens.
 */
export const theme = createCssVariablesTheme({
  name: "origan",
  variablePrefix: "--shiki-",
  variableDefaults: {},
  fontStyle: true,
});

export type Lang = "typescript" | "javascript" | "json" | "html" | "css";

const labels: Record<Lang, string> = {
  typescript: "TypeScript",
  javascript: "JavaScript",
  json: "tsconfig.json",
  html: "HTML",
  css: "CSS",
};

export type Marks = { diff?: ReadonlySet<number>; error?: ReadonlySet<number> };

export async function highlight(code: string, lang: Lang, marks: Marks = {}): Promise<string> {
  return codeToHtml(code, {
    lang,
    theme,
    transformers: [
      {
        line(node, line) {
          if (marks.diff?.has(line - 1)) this.addClassToHast(node, "mark-diff");
          if (marks.error?.has(line - 1)) this.addClassToHast(node, "mark-error");
        },
        // Lines are blocks here, so the newline between them would be a second
        // line break. The line itself already ends the line.
        code(node) {
          node.children = node.children.filter((child) => !(child.type === "text" && child.value === "\n"));
        },
      },
    ],
  });
}

export const control =
  "rounded-control border border-line px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.09em] text-fg-2 transition-colors hover:border-survey-2 hover:text-fg";

export function PlaygroundLink({ code }: { code: string }) {
  return (
    <a href={playgroundHref(code)} target="_blank" rel="noopener noreferrer" className={control}>
      Open in TypeScript Playground<span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/** What TypeScript said, under a snippet that is meant to fail. */
export function ErrorNote({ errorCode, message }: { errorCode: string; message: string }) {
  return (
    <div className="border-t border-line-2 bg-ground-2 px-3 py-3">
      <p className="notation">TypeScript says</p>
      <p className="mt-1.5 font-mono text-[12.5px] leading-[1.6] text-fg-2">
        <span className="font-semibold text-warn">error {errorCode}</span>
        <span className="text-fg-3">: </span>
        {message}
      </p>
    </div>
  );
}

/**
 * One block of JavaScript or TypeScript, with a copy button and, for
 * TypeScript, a link that opens the same program in the Playground.
 */
export async function TsBlock({
  code,
  lang = "typescript",
  marks,
  play = lang === "typescript",
  footer,
  program,
  label,
}: {
  /** The name in the corner, where the language's own would not say enough ("JSON-LD"). */
  label?: string;
  code: string;
  /** What the Playground gets, when the snippet needs other regions to run on its own. */
  program?: string;
  lang?: Lang;
  marks?: Marks;
  /** The Playground link. On by default for TypeScript, and available for a JavaScript starting point too. */
  play?: boolean;
  footer?: ReactNode;
}) {
  const html = await highlight(code, lang, marks);

  return (
    <figure className="code-block cmp-code my-6 overflow-hidden rounded-panel border border-line bg-panel">
      <figcaption className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-line-2 px-3 py-2">
        <span className="notation">{label ?? labels[lang]}</span>
        <span className="flex flex-wrap items-center gap-2">
          <CopyButton code={code} />
          {play && <PlaygroundLink code={program ?? code} />}
        </span>
      </figcaption>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {footer}
    </figure>
  );
}

/** A snippet that is meant to fail: the code, the line that fails, and what TypeScript says. */
export async function Fails({ file, name = "code", jsdoc = false }: { file: string; name?: string; jsdoc?: boolean }) {
  const snippet = errorSnippet(file, name, jsdoc);
  return (
    <TsBlock
      code={snippet.code}
      lang={jsdoc ? "javascript" : "typescript"}
      play={!jsdoc}
      marks={{ error: snippet.errorLines }}
      footer={<ErrorNote errorCode={snippet.errorCode} message={snippet.message} />}
    />
  );
}

/**
 * The signature block: the JavaScript you have, beside the TypeScript it
 * becomes, with the lines that differ highlighted. Side by side from `md` up,
 * and tabs on a phone. The layout and the tabs are in `compare-view.tsx`; this
 * does the work that needs the files and the highlighter, at build time.
 */
export async function Compare(props: CompareProps) {
  const { js, ts, jsChanged, tsChanged, errorLines, failure } = compareParts(props);
  const [jsHtml, tsHtml] = await Promise.all([
    highlight(js, "javascript", { diff: jsChanged }),
    highlight(ts, "typescript", { diff: tsChanged, error: errorLines }),
  ]);

  return (
    <CompareView
      js={{ code: js, html: jsHtml }}
      ts={{ code: ts, html: tsHtml, playground: playgroundHref(ts) }}
      tsFooter={failure && <ErrorNote errorCode={failure.errorCode} message={failure.message} />}
    />
  );
}
