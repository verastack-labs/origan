"use client";

const control =
  "rounded-control border border-line px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.09em] text-fg-2 transition-colors hover:border-survey-2 hover:text-fg";

/**
 * Opens the browser's print dialog, where "Save as PDF" is also on offer. The
 * page has print styles, so the sidebar, the header and the buttons are left
 * out and the rows fit the paper.
 */
export function PrintButton({ label = "Print or save as PDF" }: { label?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={`no-print ${control}`}>
      {label}
    </button>
  );
}
