"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { sectionsByPath, sheets } from "@/data/site";

const pill =
  "pointer-events-auto flex items-center gap-0.5 rounded-panel border border-line bg-ground/90 p-1 backdrop-blur-[10px]";
const item =
  "flex items-center gap-2 rounded-control px-3 py-2 text-[13px] transition-colors sm:px-3.5";

/**
 * The bar at the foot of the viewport, and what it carries depends on how much
 * room the header has.
 *
 * Wide enough for the header to show all three pages, and this is the
 * secondary axis: where you are on the sheet you are holding, with each
 * station mark filling as you reach it.
 *
 * Narrow, and the header cannot fit three page labels beside a wordmark and a
 * call to action, so it drops them. This bar takes them over. That is not a
 * nicety: with the pages hidden above and sections shown here, a reader on a
 * phone had no route to the other two sheets at all.
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

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(14px,env(safe-area-inset-bottom))] transition-[opacity,transform] duration-300 ease-survey ${
        atTalk ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100"
      }`}
      // Removed from the tab order too while hidden, so it is not a set of
      // invisible stops between the form's fields and its submit button.
      inert={atTalk || undefined}
    >
      {/* The pages, only while the header is too narrow to carry them. */}
      <nav aria-label="Pages" className="md:hidden">
        <ol className={pill}>
          {sheets.map((sheet) => {
            const current = here === sheet.href;

            return (
              <li key={sheet.href}>
                <Link
                  href={sheet.href}
                  aria-current={current ? "page" : undefined}
                  className={`${item} ${
                    current ? "bg-panel-2 text-fg" : "text-fg-2 hover:bg-panel hover:text-fg"
                  }`}
                >
                  <Mark filled={current} />
                  {sheet.short}
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* The sections of the page you are on, once the header has the pages. */}
      {sections.length > 0 && (
        <nav aria-label="Sections on this page" className="hidden md:block">
          <ol className={pill}>
            {sections.map((section, i) => {
              const current = active === i;

              return (
                <li key={section.href}>
                  <a
                    href={section.href}
                    aria-current={current ? "location" : undefined}
                    className={`${item} ${
                      current ? "bg-panel-2 text-fg" : "text-fg-2 hover:bg-panel hover:text-fg"
                    }`}
                  >
                    <Mark filled={current} />
                    {section.label}
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      )}
    </div>
  );
}

/** A station mark: hollow until the traverse reaches it. */
function Mark({ filled }: { filled: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`h-[7px] w-[7px] shrink-0 rounded-full border transition-colors ${
        filled ? "border-survey bg-survey" : "border-line-2 bg-transparent"
      }`}
    />
  );
}
