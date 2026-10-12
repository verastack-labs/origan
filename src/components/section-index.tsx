"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { sectionsByPath, sheets } from "@/data/site";

const pill =
  "pointer-events-auto flex items-center gap-0.5 rounded-panel border border-line bg-ground p-1 md:bg-ground/90 md:backdrop-blur-[10px]";
const item =
  "flex items-center gap-2 rounded-control px-3 py-2 text-[13px] font-medium transition-colors sm:px-3.5";

/**
 * The bar at the foot of the viewport, and what it carries depends on how much
 * room the header has.
 *
 * Wide enough for the header to show all three pages, and this is the
 * secondary axis: where you are on the sheet you are holding, with each
 * station mark filling as you reach it.
 *
 * Narrow, and the header cannot fit the page labels beside a wordmark and a
 * call to action, so it drops them. This bar takes them over. That is not a
 * nicety: with the pages hidden above and sections shown here, a reader on a
 * phone had no route to the other sheets at all.
 *
 * Six sheets do not fit across a phone as a row, and a row that wraps or
 * scrolls sideways hides exactly the pages it exists to show. So the bar
 * becomes a drawing register: one control naming the sheet you are on, which
 * opens the full list of sheets above it.
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
      {/* Keyed on the route, so arriving on a new sheet starts with the
          register closed rather than closing it from an effect. */}
      <Register key={here} here={here} sections={sections} />

      {/* The sections of the page you are on, once the header has the pages. */}
      {sections.length > 0 && (
        <nav aria-label="Sections on this page" className="hidden lg:block">
          <ol className={pill}>
            {sections.map((section, i) => {
              const current = active === i;

              return (
                <li key={section.href}>
                  <a
                    href={section.href}
                    aria-current={current ? "location" : undefined}
                    className={`${item} ${
                      current ? "bg-panel-2 text-fg" : "text-fg hover:bg-panel"
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
        filled ? "border-survey bg-survey" : "border-fg-3 bg-transparent"
      }`}
    />
  );
}

/**
 * The drawing register: the list of every sheet in the set, the way a drawing
 * package opens. Closed, it names the sheet in hand. Open, it lists them all.
 */
function Register({ here, sections }: { here: string; sections: readonly { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const box = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const index = Math.max(
    0,
    sheets.findIndex((sheet) => sheet.href === here),
  );
  const current = sheets[index];

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <nav aria-label="Pages" className="lg:hidden">
      <div ref={box} className="pointer-events-auto relative">
        {open && (
          <ol
            id={id}
            className="swap absolute inset-x-0 bottom-full mb-2 min-w-[240px] rounded-panel border border-line bg-ground p-1"
          >
            {sheets.map((sheet, i) => {
              const isHere = sheet.href === current.href;

              return (
                <li key={sheet.href}>
                  <Link
                    href={sheet.href}
                    aria-current={isHere ? "page" : undefined}
                    className={`${item} w-full justify-between ${
                      isHere ? "bg-panel-2 text-fg" : "text-fg hover:bg-panel"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Mark filled={isHere} />
                      {sheet.label}
                    </span>
                    <span className="font-mono text-[10px] tabular-nums text-fg-2">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </Link>
                </li>
              );
            })}
            {/* The sheet in hand, opened to its own sections. */}
            {sections.length > 0 && (
              <li className="mt-1 border-t border-line-2 pt-1">
                <ol>
                  {sections.map((section) => (
                    <li key={section.href}>
                      <a
                        href={section.href}
                        onClick={() => setOpen(false)}
                        className={`${item} w-full pl-8 text-fg-2 hover:bg-panel hover:text-fg`}
                      >
                        <Mark filled={false} />
                        {section.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </li>
            )}
          </ol>
        )}

        <div className={pill}>
          <button
            ref={button}
            type="button"
            aria-expanded={open}
            aria-controls={open ? id : undefined}
            onClick={() => setOpen((v) => !v)}
            className={`${item} min-w-[220px] justify-between text-fg hover:bg-panel`}
          >
            <span className="flex items-center gap-2">
              <Mark filled />
              {current.label}
            </span>
            <span className="flex items-center gap-2 font-mono text-[10px] tabular-nums text-fg-2">
              <span>
                Sheet {index + 1} of {sheets.length}
              </span>
              <svg
                width="9"
                height="9"
                viewBox="0 0 9 9"
                aria-hidden="true"
                className={`transition-transform duration-200 ease-survey ${open ? "" : "rotate-180"}`}
              >
                <path d="M1 6l3.5-3.5L8 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
