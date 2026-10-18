import { Children, isValidElement, type ComponentProps, type ReactNode } from "react";
import { isExternal } from "@/lib/links";

/**
 * The one link treatment for long-form text: the lessons, the articles, and
 * the Sources list.
 *
 * An internal link keeps the plain survey-accent underline. An external one
 * (see `lib/links.ts`) adds a small up-right arrow in the accent, and a hidden
 * "(opens in a new tab)" for a screen reader, and opens in a new tab with
 * `rel="noopener noreferrer"`, which stops the new page reaching back to this
 * one. The arrow is glued to the last word with `white-space: nowrap`, so it
 * can never wrap onto a line of its own.
 *
 * On hover the underline thickens and the arrow nudges up and to the right by
 * a pixel. Reduced motion keeps the thickening and drops the nudge.
 */
const base =
  "group text-fg underline decoration-survey-2 decoration-1 underline-offset-4 transition-colors hover:text-survey hover:decoration-2 [&_code]:text-survey";

function Arrow() {
  return (
    <>
      <span
        aria-hidden="true"
        className="ml-[0.2em] inline-block text-[0.8em] text-survey transition-transform duration-150 group-hover:-translate-y-px group-hover:translate-x-px motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
      >
        ↗
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </>
  );
}

/**
 * The text of an external link with the arrow joined to its last word. The last
 * word, or the last element such as an inline `code` chip, and the arrow go in
 * one nowrap box.
 */
export function withArrow(children: ReactNode): ReactNode {
  const nodes = Children.toArray(children);
  const last = nodes[nodes.length - 1];
  const head = nodes.slice(0, -1);

  const at = typeof last === "string" ? last.search(/\S+\s*$/) : -1;
  if (typeof last === "string" && at >= 0) {
    return (
      <>
        {head}
        {last.slice(0, at)}
        <span className="whitespace-nowrap">
          {last.slice(at).trimEnd()}
          <Arrow />
        </span>
      </>
    );
  }

  return (
    <>
      {head}
      <span className="whitespace-nowrap">
        {isValidElement(last) || last ? last : null}
        <Arrow />
      </span>
    </>
  );
}

export function ProseLink({ href, children, className = "", ...rest }: ComponentProps<"a">) {
  if (!isExternal(href)) {
    return (
      <a href={href} className={`${base} ${className}`.trim()} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${base} ${className}`.trim()} {...rest}>
      {withArrow(children)}
    </a>
  );
}
