import { Children, type ComponentProps, type ReactElement, type ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import { playgroundCode } from "@/lib/snippets";
import { CodeBlock } from "./code-block";
import { ArrayDiagram, BytesDiagram, SetupDiagram } from "./diagrams";
import { Part } from "./part";
import { Practice } from "./practice";
import { Snippet } from "./snippet";

/** A short aside: an idea that earns a box of its own, such as ownership. */
function Note({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="my-6 rounded-panel border border-line border-l-2 border-l-survey bg-panel px-[clamp(16px,2.4vw,24px)] py-4">
      <p className="notation">{title}</p>
      <div className="mt-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">{children}</div>
    </aside>
  );
}

/**
 * A fenced block in the MDX. Rust is never typed here (it comes from the
 * tested crate through <Snippet>), so fences are for terminal commands and
 * their output.
 */
async function Pre({ children }: { children?: ReactNode }) {
  const child = Children.only(children) as ReactElement<{ className?: string; children?: string }>;
  const lang = /language-([\w-]+)/.exec(child.props.className ?? "")?.[1] ?? "text";
  const code = String(child.props.children ?? "").replace(/\n$/, "");
  const known = lang === "sh" || lang === "shell" ? "bash" : lang;

  return (
    <CodeBlock
      code={code}
      lang={known}
      program={known === "rust" ? playgroundCode(code) : undefined}
    />
  );
}

const link =
  "text-fg underline decoration-survey-2 decoration-1 underline-offset-4 transition-colors hover:text-survey";

/**
 * Everything an MDX lesson can use. Markdown elements are styled here, and the
 * lesson components (`Part`, `Snippet`, `Practice`, the diagrams) are named so
 * a lesson needs no imports.
 */
export const components: MDXComponents = {
  p: (props: ComponentProps<"p">) => <p className="my-4 text-[17px] leading-[1.7] text-fg" {...props} />,
  h3: (props: ComponentProps<"h3">) => (
    <h3 className="mb-2 mt-9 text-[clamp(18px,2vw,21px)] font-semibold tracking-[-0.02em] text-fg" {...props} />
  ),
  ul: (props: ComponentProps<"ul">) => (
    <ul className="my-4 grid list-disc gap-2 pl-6 text-[17px] leading-[1.65] text-fg marker:text-survey-2" {...props} />
  ),
  ol: (props: ComponentProps<"ol">) => (
    <ol className="my-4 grid list-decimal gap-2 pl-6 text-[17px] leading-[1.65] text-fg marker:font-mono marker:text-fg-3" {...props} />
  ),
  a: (props: ComponentProps<"a">) => <a className={link} {...props} />,
  strong: (props: ComponentProps<"strong">) => <strong className="font-semibold text-fg" {...props} />,
  code: (props: ComponentProps<"code">) => (
    <code className="rounded-control bg-panel-2 px-1.5 py-px font-mono text-[0.86em] text-fg" {...props} />
  ),
  pre: Pre,
  table: (props: ComponentProps<"table">) => (
    <div className="my-6 overflow-x-auto rounded-panel border border-line" tabIndex={0}>
      <table className="w-full min-w-[460px] border-collapse text-left text-[15px]" {...props} />
    </div>
  ),
  thead: (props: ComponentProps<"thead">) => <thead className="bg-ground-2" {...props} />,
  th: (props: ComponentProps<"th">) => (
    <th
      className="border-b border-line px-4 py-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.11em] text-fg-3"
      {...props}
    />
  ),
  td: (props: ComponentProps<"td">) => (
    <td className="border-b border-line-2 bg-panel px-4 py-2.5 align-top text-fg-2 [tr:last-child_&]:border-b-0" {...props} />
  ),
  hr: () => <hr className="my-10 border-line" />,
  Part,
  Snippet,
  Practice,
  Note,
  SetupDiagram,
  ArrayDiagram,
  BytesDiagram,
};
