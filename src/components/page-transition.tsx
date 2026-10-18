"use client";

import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { sheetKey, trackArrivals } from "@/lib/arrival";

/**
 * Sheets are changed, not cross-faded.
 *
 * Keying on the pathname makes React replace the subtree on navigation, which
 * replays the CSS animation below. A survey drawing set is a stack of sheets,
 * so the transition is a short lift and settle on the same curve everything
 * else in this design uses, not a slide or a wipe.
 *
 * The lessons of one course are the exception. They share a key
 * (`sheetKey`), because the chapters sidebar is meant to stay put while the
 * article beside it changes, and a new key would rebuild it. Those pages
 * announce and animate their own arrival instead.
 *
 * Done in CSS rather than through the View Transitions API on purpose: this is
 * a static export that has to behave the same in every browser that a college
 * IT department has standardised on, and the effect is small enough that the
 * extra capability buys nothing. Under `prefers-reduced-motion` the stylesheet
 * turns it off and the swap is instant.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Learns, from this always-mounted spot, whether a page was reached by a
  // click or the back button, which a page cannot tell once it has mounted.
  useEffect(() => trackArrivals(), []);

  return (
    <div key={sheetKey(pathname)} id="main" className="sheet-change">
      {children}
    </div>
  );
}
