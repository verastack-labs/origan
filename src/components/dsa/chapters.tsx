"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type ReactNode,
  type TouchEvent,
} from "react";
import { List, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { coursePath, type CourseNav } from "@/data/courses";
import { CHAPTERS_KEY } from "@/lib/chapters";
import { ReadCheck } from "./read-tick";

/**
 * The chapters sidebar on every lesson page.
 *
 * One list of the course, two ways to hold it. From `lg` up it is a sticky
 * column beside the text that can fold down to a slim rail. Below that it is a
 * drawer, opened from a bar under the site header, and built on the native
 * `<dialog>` so focus, Escape and the inert page behind it come from the
 * browser rather than from script.
 *
 * The folded state is not React state. It lives on `<html data-chapters>`,
 * where an inline script in the layout sets it before first paint, and the
 * stylesheet does the rest. React only reads it, to label the button.
 */
export type Chapter = {
  order: number;
  slug: string;
  title: string;
  /** Which part of the course it is in. */
  part: number;
  /** Published lessons are links. The rest are listed, dimmed, and say so. */
  available: boolean;
};

const EVENT = "origan-rust-dsa-chapters";
const pad = (n: number) => String(n).padStart(2, "0");

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

const readCollapsed = () => document.documentElement.dataset.chapters === "collapsed";

function writeCollapsed(next: boolean) {
  const root = document.documentElement;
  if (next) root.dataset.chapters = "collapsed";
  else delete root.dataset.chapters;

  // A private window or blocked site data refuses storage. The sidebar still
  // folds for the visit; it just is not remembered.
  try {
    window.localStorage.setItem(CHAPTERS_KEY, next ? "collapsed" : "expanded");
  } catch {}

  window.dispatchEvent(new Event(EVENT));
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Which of the seven parts is under the reading line, for the highlight.
 * Measured on scroll in an animation frame, the way the site's section index
 * does it, so a long page costs one read per frame.
 */
function useActivePart(parts: CourseNav["parts"]): number {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const elements = parts.map((part) => document.getElementById(part.id));
    let frame = 0;

    const measure = () => {
      frame = 0;
      const line = window.innerHeight * 0.34;
      let current = 0;
      elements.forEach((part, i) => {
        if (part && part.getBoundingClientRect().top <= line) current = i;
      });
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [parts]);

  return active;
}

/** Scroll a list's own scroll box, never the page, so the current lesson is in view. */
function revealCurrent(box: HTMLElement | null) {
  const here = box?.querySelector<HTMLElement>('[aria-current="page"]');
  if (!box || !here) return;
  const top = here.offsetTop - box.offsetTop;
  if (top < box.scrollTop || top + here.offsetHeight > box.scrollTop + box.clientHeight) {
    box.scrollTop = Math.max(0, top - box.clientHeight / 3);
  }
}

/** The nav itself: every lesson, grouped by part, with the seven parts under the one you are on. */
function ChapterList({
  course,
  chapters,
  current,
  active,
  onNavigate,
}: {
  course: CourseNav;
  chapters: readonly Chapter[];
  current: string;
  active: number;
  onNavigate?: () => void;
}) {
  const row = "relative flex items-baseline gap-3 rounded-control py-2 pl-3 pr-2 text-[14.5px] leading-snug";
  const partNumbers = [...new Set(chapters.map((c) => c.part))];
  const grouped = partNumbers.length > 1;

  return (
    <nav aria-label="Chapters">
      {partNumbers.map((part) => (
      <div key={part} className={grouped && part !== partNumbers[0] ? "mt-5" : ""}>
      {grouped && (
        <p className="notation mb-1.5 whitespace-nowrap pl-3">
          Part {part} · {course.partNames[part]}
        </p>
      )}
      <ol className="grid gap-px">
        {chapters.filter((c) => c.part === part).map((chapter) => {
          const here = chapter.slug === current;
          const number = (
            <span
              className={`w-[18px] shrink-0 font-mono text-[10px] tabular-nums ${here ? "text-survey" : "text-fg-3"}`}
            >
              {pad(chapter.order)}
            </span>
          );

          return (
            <li key={chapter.slug}>
              {chapter.available ? (
                <Link
                  href={coursePath(course, chapter.slug)}
                  aria-current={here ? "page" : undefined}
                  onClick={onNavigate}
                  className={`${row} transition-colors ${
                    here
                      ? "bg-panel-2 font-semibold text-fg before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:bg-survey"
                      : "text-fg-2 hover:bg-panel hover:text-fg"
                  }`}
                >
                  {number}
                  <span className="min-w-0 flex-1">{chapter.title}</span>
                  <ReadCheck course={course.id} slug={chapter.slug} />
                </Link>
              ) : (
                <div className={`${row} text-fg-3`}>
                  {number}
                  <span className="min-w-0 flex-1">
                    {chapter.title}
                    <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.1em]">
                      Coming next
                    </span>
                  </span>
                </div>
              )}

              {here && (
                <ol className="mb-2 ml-[21px] mt-1 border-l border-line-2">
                  {course.parts.map((part, i) => {
                    const seen = active === i;
                    return (
                      <li key={part.id}>
                        <a
                          href={`#${part.id}`}
                          onClick={onNavigate}
                          aria-current={seen ? "location" : undefined}
                          className={`-ml-px flex items-baseline gap-2.5 border-l py-1.5 pl-3 pr-2 text-[13.5px] leading-snug transition-colors ${
                            seen
                              ? "border-survey text-fg"
                              : "border-transparent text-fg-2 hover:text-fg"
                          }`}
                        >
                          <span
                            className={`font-mono text-[10px] tabular-nums ${seen ? "text-survey" : "text-fg-3"}`}
                          >
                            {pad(i + 1)}
                          </span>
                          {part.label}
                        </a>
                      </li>
                    );
                  })}
                </ol>
              )}
            </li>
          );
        })}
      </ol>
      </div>
      ))}
    </nav>
  );
}

/** The course title, linking to the index. */
function CourseTitle({ course, onNavigate }: { course: CourseNav; onNavigate?: () => void }) {
  return (
    <>
      <p className="notation whitespace-nowrap">{Object.keys(course.partNames).length > 1 ? "Free lessons" : "Part 1"}</p>
      <Link
        href={course.path}
        onClick={onNavigate}
        className="mt-1.5 block whitespace-nowrap text-[19px] font-bold tracking-[-0.02em] text-fg transition-colors hover:text-survey"
      >
        {course.name}
      </Link>
      {course.descriptor && (
        <p className="mt-1 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3">
          {course.descriptor}
        </p>
      )}
    </>
  );
}

function CollapseButton({
  collapsed,
  controls,
  onClick,
}: {
  collapsed: boolean;
  controls: string;
  onClick: () => void;
}) {
  const label = collapsed ? "Show chapters" : "Hide chapters";

  return (
    <span className="group/tip relative shrink-0">
      <button
        type="button"
        aria-expanded={!collapsed}
        aria-controls={controls}
        aria-label={label}
        onClick={onClick}
        className="inline-flex h-8 w-8 items-center justify-center rounded-control border border-line text-fg-2 transition-colors hover:border-survey-2 hover:text-fg"
      >
        <PanelLeftClose size={15} strokeWidth={1.7} aria-hidden="true" className="chapters-icon-hide" />
        <PanelLeftOpen size={15} strokeWidth={1.7} aria-hidden="true" className="chapters-icon-show" />
      </button>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-full top-1/2 z-20 ml-2.5 -translate-y-1/2 whitespace-nowrap rounded-control border border-line bg-panel px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-fg opacity-0 transition-opacity duration-150 group-hover/tip:opacity-100 group-has-[:focus-visible]/tip:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}

export function ChaptersLayout({
  course,
  chapters,
  current,
  head,
  contentClass,
  children,
}: {
  course: CourseNav;
  chapters: readonly Chapter[];
  current: string;
  /** The page heading. It sits under the chapters bar, so the bar is the first thing below the site header. */
  head: ReactNode;
  contentClass: string;
  children: ReactNode;
}) {
  const active = useActivePart(course.parts);
  const collapsed = useSyncExternalStore(subscribe, readCollapsed, () => false);
  const bodyId = useId();
  const bodyRef = useRef<HTMLDivElement>(null);
  const drawerListRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closing = useRef(0);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const [open, setOpen] = useState(false);

  const now = chapters.find((c) => c.slug === current);

  useEffect(() => revealCurrent(bodyRef.current), []);

  const openDrawer = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    setOpen(true);
    revealCurrent(drawerListRef.current);
  };

  // Animated, unless the reader asked for less motion. The dialog closes for
  // real only when the slide out has finished.
  const closeDrawer = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || !dialog.open || closing.current) return;
    if (reducedMotion()) {
      dialog.close();
      return;
    }
    dialog.setAttribute("data-closing", "");
    closing.current = window.setTimeout(() => {
      closing.current = 0;
      dialog.close();
    }, 190);
  }, []);

  // The page behind a drawer must not scroll. Undone on close and on unmount,
  // because following a link replaces this whole subtree.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const before = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = before;
    };
  }, [open]);

  // The drawer is a phone and tablet pattern. If the window grows past `lg`
  // while it is open, the sidebar column takes over and the dialog goes.
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (wide.matches && dialogRef.current?.open) dialogRef.current.close();
    };
    wide.addEventListener("change", onChange);
    return () => {
      wide.removeEventListener("change", onChange);
      window.clearTimeout(closing.current);
    };
  }, []);

  // `showModal` keeps focus in the dialog, but at the last control Tab would
  // leave for the browser's own chrome. Wrapping it makes the trap complete.
  const trapTab = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return;
    const stops = event.currentTarget.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    const first = stops[0];
    const last = stops[stops.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const onTouchStart = (event: TouchEvent) => {
    const t = event.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (event: TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const t = event.changedTouches[0];
    if (t.clientX - start.x < -56 && Math.abs(t.clientY - start.y) < 48) closeDrawer();
  };

  return (
    <div>
      {/* Below lg: the bar that opens the drawer. Sticky under the site header,
          which is 62px plus its rule. */}
      <div className="sticky top-[63px] z-30 border-b border-line-2 bg-ground lg:hidden">
        <div className="mx-auto max-w-[1240px] px-[clamp(18px,4vw,60px)]">
          <button
            ref={triggerRef}
            type="button"
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={openDrawer}
            className="flex h-11 w-full min-w-0 items-center gap-3 text-left"
          >
            <List size={15} strokeWidth={1.8} aria-hidden="true" className="shrink-0 text-fg-2" />
            <span className="shrink-0 font-mono text-[10.5px] font-semibold uppercase tracking-[0.1em] text-fg">
              Chapters
            </span>
            <span aria-hidden="true" className="h-3 w-px shrink-0 bg-line" />
            {now && (
              <>
                <span className="shrink-0 font-mono text-[10px] tabular-nums text-survey">{pad(now.order)}</span>
                <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-fg-2">{now.title}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {head}

      <div className={contentClass}>
        <div className="chapters-layout">
          <aside className="chapters-aside hidden lg:block">
            <div className="sticky top-[63px] flex h-[calc(100svh-63px)] flex-col border-r border-line-2">
              <div className="flex items-start justify-between gap-2 px-[11px] pb-4 pt-5">
                <div className="chapters-fade min-w-0 flex-1 overflow-hidden pl-1">
                  <CourseTitle course={course} />
                </div>
                <CollapseButton
                  collapsed={collapsed}
                  controls={bodyId}
                  onClick={() => writeCollapsed(!collapsed)}
                />
              </div>

              <div
                id={bodyId}
                ref={bodyRef}
                className="chapters-fade chapters-body min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-10"
              >
                <div className="w-[var(--rail-open)] pr-3">
                  <ChapterList course={course} chapters={chapters} current={current} active={active} />
                </div>
              </div>

              <span
                aria-hidden="true"
                className="chapters-rail-label pointer-events-none absolute left-0 top-[76px] flex w-[var(--rail-shut)] justify-center"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-3 [writing-mode:vertical-rl]">
                  Chapters
                </span>
              </span>
            </div>
          </aside>

          <div className="min-w-0">{children}</div>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        aria-label="Course chapters"
        onCancel={(event) => {
          event.preventDefault();
          closeDrawer();
        }}
        onClose={() => {
          dialogRef.current?.removeAttribute("data-closing");
          setOpen(false);
          triggerRef.current?.focus();
        }}
        onKeyDown={trapTab}
        className="chapters-drawer fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden border-0 bg-transparent p-0 text-fg lg:hidden"
      >
        <div
          aria-hidden="true"
          onClick={closeDrawer}
          className="drawer-backdrop absolute inset-0 bg-ground/70 backdrop-blur-[3px]"
        />
        <div
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="drawer-panel absolute inset-y-0 left-0 flex w-[85%] max-w-[360px] flex-col border-r border-line bg-ground"
        >
          <div className="flex items-start justify-between gap-3 border-b border-line-2 px-4 pb-4 pt-5">
            <div className="min-w-0">
              <CourseTitle course={course} onNavigate={closeDrawer} />
            </div>
            <button
              type="button"
              onClick={closeDrawer}
              aria-label="Close chapters"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-control border border-line text-fg-2 transition-colors hover:border-survey-2 hover:text-fg"
            >
              <X size={15} strokeWidth={1.9} aria-hidden="true" />
            </button>
          </div>
          <div ref={drawerListRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-24 pt-2">
            <ChapterList course={course} chapters={chapters} current={current} active={active} onNavigate={closeDrawer} />
          </div>
        </div>
      </dialog>
    </div>
  );
}
