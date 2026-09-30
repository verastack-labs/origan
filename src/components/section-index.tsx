"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { sectionsByPath } from "@/data/site";

/**
 * Where you are on the sheet you are holding, floating at the foot of the
 * viewport. Whole-page navigation is the primary axis and lives in the header;
 * this is the secondary one, and it changes with the route.
 *
 * It tracks scroll rather than only linking: the marker fills as you reach
 * each section, which makes it a position indicator that happens to also be
 * navigation, in the same way a chainage board on a road is.
 */
export function SectionIndex() {
  const pathname = usePathname();
  const here = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const sections = sectionsByPath[here] ?? [];

  const [active, setActive] = useState(-1);
  // The bar sits over the enquiry form at wider viewports, and by the time a
  // reader has reached it they have stopped navigating and started typing.
  const [atTalk, setAtTalk] = useState(false);
  const frame = useRef(0);

  useEffect(() => {
    const talk = document.querySelector("#talk");
    if (!talk) return;

    const io = new IntersectionObserver(([entry]) => setAtTalk(entry.isIntersecting), {
      rootMargin: "0px 0px -35% 0px",
    });
    io.observe(talk);
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (sections.length === 0) return;

    const found = sections.map((s) => document.querySelector<HTMLElement>(s.href));

    const measure = () => {
      frame.current = 0;
      let current = -1;
      found.forEach((section, i) => {
        if (section && section.getBoundingClientRect().top <= window.innerHeight * 0.42) {
          current = i;
        }
      });
      setActive(current);
    };

    const onScroll = () => {
      if (!frame.current) frame.current = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
    // The list is looked up from the path, so the path is what changes it.
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  if (sections.length === 0) return null;

  return (
    <nav
      aria-label="Sections on this page"
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(14px,env(safe-area-inset-bottom))] transition-[opacity,transform] duration-300 ease-survey ${
        atTalk ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100"
      }`}
      // Removed from the tab order too while hidden, so it is not a set of
      // invisible stops between the form's fields and its submit button.
      inert={atTalk || undefined}
    >
      <ol className="pointer-events-auto flex items-center gap-0.5 rounded-panel border border-line bg-ground/90 p-1 backdrop-blur-[10px]">
        {sections.map((section, i) => {
          const current = active === i;

          return (
            <li key={section.href}>
              <a
                href={section.href}
                aria-current={current ? "location" : undefined}
                className={`flex items-center gap-2 rounded-control px-3 py-2 text-[13px] transition-colors sm:px-3.5 ${
                  current ? "bg-panel-2 text-fg" : "text-fg-2 hover:bg-panel hover:text-fg"
                }`}
              >
                {/* A station mark: hollow until the traverse reaches it. */}
                <span
                  aria-hidden="true"
                  className={`h-[7px] w-[7px] shrink-0 rounded-full border transition-colors ${
                    current ? "border-survey bg-survey" : "border-line-2 bg-transparent"
                  }`}
                />
                {section.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
