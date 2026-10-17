"use client";

import { useState } from "react";
import { inlineCode } from "./inline-code";

/**
 * Hints, one at a time. A hint that is already on screen is a hint the reader
 * did not get to try without, so each one waits behind its own button.
 */
export function Hints({ hints }: { hints: readonly string[] }) {
  const [shown, setShown] = useState(0);
  const more = shown < hints.length;

  return (
    <div>
      {shown > 0 && (
        <ol className="mb-3 grid gap-2.5" aria-live="polite">
          {hints.slice(0, shown).map((hint, i) => (
            <li
              key={i}
              className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 rounded-control border border-line-2 bg-ground-2 px-3.5 py-3 text-[15px] text-fg-2"
            >
              <span className="pt-[0.35em] font-mono text-[10px] uppercase tracking-[0.1em] text-survey-2">
                Hint {i + 1}
              </span>
              <span>{inlineCode(hint)}</span>
            </li>
          ))}
        </ol>
      )}
      {more ? (
        <button
          type="button"
          onClick={() => setShown(shown + 1)}
          className="rounded-control border border-line px-3.5 py-2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.08em] text-fg-2 transition-colors hover:border-survey-2 hover:text-fg"
        >
          {shown === 0 ? "Show a hint" : "Show the next hint"} ({shown + 1} of {hints.length})
        </button>
      ) : (
        <p className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-fg-3">
          That was every hint. The solution is below.
        </p>
      )}
    </div>
  );
}
