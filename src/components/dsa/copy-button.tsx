"use client";

import { useState } from "react";

const control =
  "rounded-control border border-line px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.09em] text-fg-2 transition-colors hover:border-survey-2 hover:text-fg";

/**
 * Copies the code beside it. The clipboard can be refused (an insecure origin,
 * a blocked permission), and then the label says so instead of claiming it
 * worked. The code is still on the page to select by hand.
 */
export function CopyButton({ code, hint }: { code: string; /** Said to a screen reader after the label, when "Copy" alone would not say what. */ hint?: string }) {
  const [state, setState] = useState<"idle" | "done" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setState("done");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 1800);
  }

  return (
    <button type="button" onClick={copy} className={control}>
      <span aria-live="polite">
        {state === "done" ? "Copied" : state === "failed" ? "Select and copy" : "Copy"}
      </span>
      {hint && <span className="sr-only"> {hint}</span>}
    </button>
  );
}
