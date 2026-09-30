"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Sheets are changed, not cross-faded.
 *
 * Keying on the pathname makes React replace the subtree on navigation, which
 * replays the CSS animation below. A survey drawing set is a stack of sheets,
 * so the transition is a short lift and settle on the same curve everything
 * else in this design uses, not a slide or a wipe.
 *
 * Done in CSS rather than through the View Transitions API on purpose: this is
 * a static export that has to behave the same in every browser that a college
 * IT department has standardised on, and the effect is small enough that the
 * extra capability buys nothing. Under `prefers-reduced-motion` the stylesheet
 * turns it off and the swap is instant.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="sheet-change">
      {children}
    </div>
  );
}
