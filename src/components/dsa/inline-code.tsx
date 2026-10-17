import { Fragment, type ReactNode } from "react";

/**
 * Plain text with `backticks` turned into <code>. Lesson hints and notes are
 * written as strings in the MDX props, where markdown does not reach.
 */
export function inlineCode(text: string): ReactNode {
  return text.split("`").map((part, i) =>
    i % 2 === 1 ? (
      <code key={i} className="rounded-control bg-panel-2 px-1.5 py-px font-mono text-[0.86em] text-fg">
        {part}
      </code>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
