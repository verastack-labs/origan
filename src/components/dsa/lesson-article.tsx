"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { arrivalScrollTop, takeArrival } from "@/lib/arrival";
import { useAnnounce } from "./announce";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The bottom edge of whatever is stuck to the top of the viewport: the site header, and on a phone the chapters bar. */
function stickyBottom(): number {
  let bottom = 0;
  for (const el of document.querySelectorAll<HTMLElement>("[data-sticky-top]")) {
    if (el.getClientRects().length === 0) continue;
    bottom = Math.max(bottom, el.getBoundingClientRect().bottom);
  }
  return bottom;
}

/**
 * The article column of a lesson or article.
 *
 * The chapters shell around it stays mounted, so this is the only thing that
 * is new when the reader changes chapter. When it arrives by a click it:
 *
 * - puts its top just under the sticky chrome, instantly, unless the link
 *   pointed at a section (`#anchor`), which wins;
 * - fades up by a few pixels, which the stylesheet turns off under reduced
 *   motion;
 * - lets the blocks near the top simply appear, rather than each replaying
 *   its own entrance;
 * - moves focus to its heading and has the shell's live region say the title.
 *
 * A fresh load does none of this, and the back and forward buttons keep the
 * scroll the browser restores.
 */
export function LessonArticle({ title, children }: { title: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const announce = useAnnounce();
  const pathname = usePathname();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const arrival = takeArrival(pathname);
    if (!arrival) return;

    const heading = el.querySelector<HTMLElement>("[data-lesson-title]");
    const focusHeading = () => heading?.focus({ preventScroll: true });
    let cleanup: (() => void) | undefined;

    if (arrival === "link") {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      const target = hash ? document.getElementById(hash) : null;
      if (target) {
        target.scrollIntoView({ block: "start", behavior: "instant" });
      } else {
        const top = arrivalScrollTop({
          articleTop: el.getBoundingClientRect().top,
          scrollY: window.scrollY,
          stickyBottom: stickyBottom(),
        });
        if (top !== null) window.scrollTo({ top, behavior: "instant" });
      }

      // What is on screen now just appears. The rest keeps its entrance.
      for (const block of el.querySelectorAll<HTMLElement>(".rv, .rv-plot, .rv-label")) {
        if (block.getBoundingClientRect().top < window.innerHeight) {
          block.dataset.still = "";
          block.dataset.in = "true";
        }
      }

      if (!reduced()) {
        el.classList.add("article-arrive");
        const done = () => el.classList.remove("article-arrive");
        el.addEventListener("animationend", done, { once: true });
        cleanup = () => el.removeEventListener("animationend", done);
      }
    }

    announce(title);

    // A drawer that is still sliding shut keeps the page inert, and gives
    // focus back to its own button as it closes. Wait for it, then take focus.
    const drawer = document.querySelector<HTMLDialogElement>("dialog[open]");
    if (drawer) {
      drawer.addEventListener("close", focusHeading, { once: true });
      const stop = cleanup;
      cleanup = () => {
        stop?.();
        drawer.removeEventListener("close", focusHeading);
      };
    } else {
      focusHeading();
    }

    return cleanup;
    // Runs once per arrival: a new article is a new mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <article ref={ref} className="lesson-article min-w-0">
      {children}
    </article>
  );
}
