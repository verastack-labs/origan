"use client";

import { useEffect, useRef, useState } from "react";
import { strands } from "@/data/content";
import { glyphs, type GlyphName } from "./survey-glyphs";

/**
 * Four strands as a tab set rather than four stacked blocks. The page has to
 * explain a dozen features to a reader who will not read a dozen features, so
 * three quarters of this copy stays folded until it is asked for.
 */
export function Strands() {
  const [active, setActive] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.classList.remove("swap");
    void el.offsetHeight;
    el.classList.add("swap");
  }, [active]);

  const current = strands[active];
  const Mark = glyphs[current.glyph as GlyphName];

  return (
    <>
      <div className="mt-[clamp(26px,3.6vw,44px)] flex flex-wrap gap-0.5 border-b border-line" role="tablist">
        {strands.map((s, i) => (
          <button
            key={s.key}
            type="button"
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={`-mb-px border-b-2 px-5 py-[13px] font-mono text-[10.5px] uppercase tracking-[0.1em] transition-colors ${
              active === i
                ? "border-survey text-survey"
                : "border-transparent text-fg-3 hover:text-fg-2"
            }`}
          >
            {s.key}
          </button>
        ))}
      </div>

      <div
        ref={bodyRef}
        className="grid min-h-[210px] grid-cols-1 gap-[18px] pt-[clamp(24px,3.4vw,40px)] lg:grid-cols-[1.25fr_0.75fr] lg:gap-[clamp(20px,4vw,52px)]"
      >
        <div>
          <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-control border border-line text-survey">
            <Mark size={21} />
          </span>
          <h3 className="text-[clamp(21px,2.8vw,30px)] font-semibold tracking-[-0.026em]">
            {current.heading}
          </h3>
          <p className="mt-3 max-w-[46ch] text-fg-2">{current.body}</p>
        </div>
        <p className="max-w-[34ch] border-t border-line pt-4 text-[15.5px] text-fg-3 lg:border-t-0 lg:border-l lg:pl-5 lg:pt-0">
          {current.aside}
        </p>
      </div>
    </>
  );
}
