"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import {
  emptyState,
  isInner,
  maxQueryLength,
  placeholder,
  readQuery,
  resultsAnnouncement,
  search,
  withQuery,
  type SearchEntry,
  type SearchResult,
} from "@/lib/search";

/**
 * A search box over the courses, their languages and their chapters.
 *
 * The cards are passed in as children and always stay in the markup, so a
 * crawler (or a browser without JavaScript) reads the page as it always was.
 * Typing only hides them and shows the results in their place. The query is
 * kept in `?q=` with `replaceState`, so a search can be shared, and the page
 * restores it on arrival; replacing rather than pushing means Back leaves the
 * page instead of stepping back through every keystroke.
 *
 * The results are a plain list of links. Arrow keys move between them, Enter
 * opens the focused one (or the first, from the box), and Escape clears.
 */
export function ResourceSearch({ index, children }: { index: readonly SearchEntry[]; children: ReactNode }) {
  const router = useRouter();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [query, setQuery] = useState("");
  const [announcement, setAnnouncement] = useState("");

  const searching = query.trim() !== "";
  const results = useMemo(() => search(index, query), [index, query]);

  // Arriving with ?q= in the address, and coming back to it with Back.
  useEffect(() => {
    const fromAddress = () => setQuery(readQuery(window.location.search));
    fromAddress();
    window.addEventListener("popstate", fromAddress);
    return () => window.removeEventListener("popstate", fromAddress);
  }, []);

  const update = useCallback((next: string) => {
    const value = next.slice(0, maxQueryLength);
    setQuery(value);
    const url = withQuery(window.location, value);
    if (url !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.history.replaceState(window.history.state, "", url);
    }
  }, []);

  const clear = useCallback(() => {
    update("");
    inputRef.current?.focus();
  }, [update]);

  // The band under the nav only shows its bottom rule while it is actually stuck.
  const markerRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;
    const io = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting && entry.boundingClientRect.top < 64), {
      rootMargin: "-64px 0px 0px 0px",
    });
    io.observe(marker);
    return () => io.disconnect();
  }, []);

  // `/` focuses the box, unless the reader is typing somewhere already.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      e.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.select();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Said once the typing pauses, so a screen reader is not read every letter.
  useEffect(() => {
    const t = window.setTimeout(() => setAnnouncement(resultsAnnouncement(results.length, query)), 350);
    return () => window.clearTimeout(t);
  }, [results.length, query]);

  const links = () => Array.from(listRef.current?.querySelectorAll<HTMLAnchorElement>("a[data-result]") ?? []);

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape" && query !== "") {
      e.preventDefault();
      clear();
    } else if (e.key === "ArrowDown") {
      const first = links()[0];
      if (first) {
        e.preventDefault();
        first.focus();
      }
    } else if (e.key === "Enter") {
      const first = results.find((r) => r.entry.published);
      if (first && searching) {
        e.preventDefault();
        router.push(first.entry.href);
      }
    }
  };

  const onListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const all = links();
    const at = all.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      all[Math.min(at + 1, all.length - 1)]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (at <= 0) inputRef.current?.focus();
      else all[at - 1].focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      all[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      all[all.length - 1]?.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      clear();
    }
  };

  return (
    <div>
      {/* Zero-height marker: once it scrolls under the nav, the search band is stuck and earns its rule. */}
      <div ref={markerRef} aria-hidden="true" className="h-0" />
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        data-stuck={stuck || undefined}
        className="sticky top-[63px] z-40 mt-3 border-b border-transparent bg-ground py-3 transition-[border-color] duration-200 data-[stuck]:border-line-2"
      >
        <label htmlFor={inputId} className="sr-only">
          Search courses, languages and lessons
        </label>
        <div className="group flex items-center gap-3 rounded-panel border border-line bg-panel px-4 transition-colors duration-200 focus-within:border-survey-2 hover:border-survey-2">
          <Search aria-hidden="true" strokeWidth={1.75} className="size-[18px] shrink-0 text-fg-3" />
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            value={query}
            onChange={(e) => update(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder={placeholder}
            maxLength={maxQueryLength}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="search"
            aria-keyshortcuts="/"
            className="min-w-0 flex-1 bg-transparent py-3.5 text-[16px] text-fg outline-none placeholder:text-fg-3"
          />
          {query !== "" ? (
            <button
              type="button"
              onClick={clear}
              aria-label="Clear search"
              className="-mr-2 inline-flex size-9 shrink-0 items-center justify-center rounded-control text-fg-2 transition-colors hover:text-fg"
            >
              <X aria-hidden="true" strokeWidth={1.75} className="size-[18px]" />
            </button>
          ) : (
            <kbd
              aria-hidden="true"
              className="hidden shrink-0 rounded-control border border-line px-2 py-[2px] font-mono text-[11px] text-fg-3 sm:inline-block"
            >
              /
            </kbd>
          )}
        </div>
      </form>

      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {searching &&
        (results.length > 0 ? (
          <div className="search-results mt-6">
            <p aria-hidden="true" className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg-3">
              {results.length} {results.length === 1 ? "result" : "results"}
            </p>
            <ul
              ref={listRef}
              onKeyDown={onListKeyDown}
              className="mt-3 overflow-hidden rounded-panel border border-line"
            >
              {results.map((result) => (
                <Row key={result.entry.id} result={result} />
              ))}
            </ul>
          </div>
        ) : (
          <div className="search-results mt-6 rounded-panel border border-line bg-panel p-[clamp(20px,2.6vw,32px)]">
            <p className="text-[clamp(18px,2vw,22px)] font-semibold tracking-[-0.02em] text-fg">
              {emptyState.message}
            </p>
            <p className="mt-2 text-[15.5px] text-fg-2">Try one of these.</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {emptyState.suggestions.map((suggestion) => (
                <li key={suggestion}>
                  <button
                    type="button"
                    onClick={() => {
                      update(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[12px] tracking-[0.02em] text-fg-2 transition-colors duration-150 hover:border-survey-2 hover:text-fg"
                  >
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}

      <div hidden={searching}>{children}</div>
    </div>
  );
}

/** The small line under a result: what it is, where it sits, and how big it is. */
function rowMeta(entry: SearchEntry): string[] {
  switch (entry.kind) {
    case "course":
      return ["Course", entry.descriptor ?? entry.language, `${entry.lessonCount ?? 0} ${entry.lessonCount === 1 ? "lesson" : "lessons"}`];
    case "collection":
      return ["Collection", entry.descriptor ?? entry.language, `${entry.articleCount ?? 0} ${entry.articleCount === 1 ? "article" : "articles"}`];
    case "article":
      return [entry.courseName, entry.series ?? entry.language, `Article ${entry.articleNumber ?? 0}`];
    default:
      return [entry.courseName, entry.language, `Lesson ${entry.lessonNumber ?? 0}`];
  }
}

function Row({ result }: { result: SearchResult }) {
  const { entry } = result;
  const meta = rowMeta(entry);
  const body = (
    <span className="min-w-0">
        <span className="block text-[clamp(17px,1.9vw,20px)] font-semibold tracking-[-0.02em] text-fg">
          <Highlighted text={entry.title} ranges={result.ranges} />
        </span>
        {isInner(entry) && result.ranges.length === 0 && entry.text[0] && (
          // The match is somewhere other than the title, so say where it is.
          <span className="mt-1 block text-[14.5px] text-fg-2">{entry.text[0]}</span>
        )}
        <span className="mt-1 block font-mono text-[11px] tracking-[0.04em] text-fg-3">
          {meta.join(" · ")}
        </span>
    </span>
  );
  const row = "flex items-center justify-between gap-4 px-[clamp(16px,2.6vw,28px)] py-[clamp(14px,2vw,20px)]";

  return (
    <li className="border-b border-line-2 last:border-b-0">
      {entry.published ? (
        <Link
          href={entry.href}
          data-result
          className={`${row} group bg-panel transition-colors duration-150 hover:bg-panel-2 focus-visible:bg-panel-2 focus-visible:outline-offset-[-3px]`}
        >
          {body}
          <span
            aria-hidden="true"
            className="shrink-0 font-mono text-[13px] text-survey transition-transform duration-150 group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5"
          >
            →
          </span>
        </Link>
      ) : (
        <div className={`${row} bg-ground`}>
          {body}
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3">Coming next</span>
        </div>
      )}
    </li>
  );
}

/** The title with the matched stretches in <mark>, drawn from the tokens. */
function Highlighted({ text, ranges }: { text: string; ranges: SearchResult["ranges"] }) {
  const parts: ReactNode[] = [];
  let at = 0;
  ranges.forEach(([from, to], i) => {
    if (from > at) parts.push(text.slice(at, from));
    parts.push(
      <mark key={i} className="rounded-[1px] bg-survey/20 text-fg">
        {text.slice(from, to)}
      </mark>,
    );
    at = to;
  });
  if (at < text.length) parts.push(text.slice(at));
  return <>{parts}</>;
}
