import type { ReactNode } from "react";
import { langOfSample, sampleCode } from "@/lib/ots-snippets";
import { repoSampleText, type RepoSample } from "@/lib/ots-samples";
import { slugify } from "@/lib/articles";
import { TsBlock } from "./ts-code";

/**
 * The parts of an Off the Syllabus article that are not lessons' parts: a
 * heading with an anchor, a sample from the checked folder, and the structured
 * data the site really emits.
 */

const textOf = (node: ReactNode): string =>
  typeof node === "string" ? node : Array.isArray(node) ? node.map(textOf).join("") : "";

/** A section heading. The anchor is the heading's own words, which is what the sidebar links to. */
export function ArticleH2({ children }: { children?: ReactNode }) {
  const id = slugify(textOf(children));
  return (
    <h2
      id={id}
      className="mb-4 mt-[clamp(40px,5.4vw,64px)] scroll-mt-[132px] border-t border-line pt-[clamp(28px,4vw,44px)] text-[clamp(22px,2.6vw,30px)] font-bold leading-[1.15] tracking-[-0.03em] text-fg first:mt-0 first:border-t-0 first:pt-0 lg:scroll-mt-[88px]"
    >
      {children}
    </h2>
  );
}

/**
 * A region of a checked file. `file` is the file name, with its extension
 * unless it is TypeScript. `play` adds the TypeScript Playground link.
 */
export async function Sample({
  file,
  name,
  play = false,
  label,
}: {
  file: string;
  name: string;
  play?: boolean;
  label?: string;
}) {
  return <TsBlock code={sampleCode(file, name)} lang={langOfSample(file)} play={play} label={label} />;
}

/** JSON-LD this repository really emits, printed from the function that emits it. */
export async function RepoJsonLd({ which, label = "JSON-LD" }: { which: RepoSample; label?: string }) {
  return <TsBlock code={repoSampleText(which)} lang="json" play={false} label={label} />;
}
