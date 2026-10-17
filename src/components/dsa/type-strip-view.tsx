"use client";

import { useState } from "react";
import { CopyButton } from "./copy-button";

/**
 * The part of the "Strip the types" block that runs in the browser: one
 * button. The code arrives already highlighted, with each type wrapped in a
 * `.ts-strip` span, and the stylesheet does the fading and the closing up
 * when `.is-stripped` is on the wrapper.
 *
 * - The button is a real `<button aria-pressed>`. A screen reader hears its
 *   state, and the label above the code, which says which version is showing,
 *   is a polite live region.
 * - The animated code is hidden from assistive technology, because mid-fade it
 *   would read as a half-and-half mess. A visually hidden copy of the version
 *   that is showing is read instead.
 * - Without JavaScript the switch cannot work, so it is not shown. The block
 *   is the TypeScript, and a `noscript` copy of the stripped JavaScript sits
 *   under it, so the point still lands.
 * - Motion follows `prefers-reduced-motion` in the stylesheet: no transitions.
 */
const button =
  "js-only rounded-control border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.09em] transition-colors";

export function TypeStripView({ html, ts, js }: { html: string; ts: string; js: string }) {
  const [stripped, setStripped] = useState(false);
  const shown = stripped ? js : ts;

  return (
    <figure className="type-strip code-block cmp-code my-6 overflow-hidden rounded-panel border border-line bg-panel">
      <figcaption className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-line-2 px-3 py-2">
        <span className="notation" aria-live="polite">
          {stripped ? "JavaScript: what runs" : "TypeScript: what you write"}
        </span>
        <span className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-pressed={stripped}
            onClick={() => setStripped((on) => !on)}
            className={`${button} ${
              stripped
                ? "border-survey-2 bg-panel-2 text-fg"
                : "border-line text-fg-2 hover:border-survey-2 hover:text-fg"
            }`}
          >
            Strip the types
          </button>
          <CopyButton code={shown} hint={stripped ? "the JavaScript" : "the TypeScript"} />
        </span>
      </figcaption>
      <div aria-hidden="true" className={stripped ? "is-stripped" : undefined} dangerouslySetInnerHTML={{ __html: html }} />
      <pre className="sr-only">{shown}</pre>
      <noscript>
        <p className="notation border-t border-line-2 px-3 pt-3">With the types stripped, this is what runs</p>
        <pre className="m-0 overflow-x-auto px-[18px] pb-4 pt-2 font-mono text-[13px] leading-[1.65] text-fg">{js}</pre>
      </noscript>
      <p className="border-t border-line-2 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3">
        {stripped ? (
          "Nothing is left of the types. This is the JavaScript that runs"
        ) : (
          <>
            Tinted text is a type<span className="js-only">. The switch removes it</span>
          </>
        )}
      </p>
    </figure>
  );
}
