import { search, type SearchEntry, type SearchResult } from "./search";
import { rankStarred } from "./stars";

/**
 * The filter chips above The Open Shelf: plain functions on plain data, so the
 * same code runs in the unit tests and in the browser.
 *
 * A chip is a filter id (`rust`, `web`). An item sits under every filter it
 * lists. Choosing a chip narrows the shelf; the search box then searches
 * within what is left. The chosen chip lives in the address as `?filter=rust`,
 * next to `?q=`, so a filtered view can be linked to.
 */
export type Filterable = { filters: readonly string[]; status?: "live" | "coming"; published?: string };

/** The items under one filter. `null` is "All": everything, in the order given. */
export function filterItems<T extends Filterable>(items: readonly T[], filter: string | null): T[] {
  return filter === null ? [...items] : items.filter((item) => item.filters.includes(filter));
}

export type FilterCount = { total: number; live: number; coming: number };

/** How many items sit under each filter, counted from the data. */
export function countByFilter(filterIds: readonly string[], items: readonly Filterable[]): Record<string, FilterCount> {
  const out: Record<string, FilterCount> = {};
  for (const id of filterIds) {
    const under = filterItems(items, id);
    const coming = under.filter((item) => item.status === "coming").length;
    out[id] = { total: under.length, live: under.length - coming, coming };
  }
  return out;
}

/** What a chip shows beside its label: the count, and "soon" for the part that is still being built. */
export function countLabel(count: FilterCount): string {
  if (count.coming === 0) return String(count.total);
  if (count.live === 0) return `${count.total} soon`;
  return `${count.total} · ${count.coming} soon`;
}

/**
 * The shelf's own order: live items first, newest `published` first (items
 * from the same day, or with no date, keep the order they were given in), then
 * coming ones in the order given, which is the roadmap's.
 */
export function liveFirst<T extends Filterable>(items: readonly T[]): T[] {
  const live = items
    .map((item, at) => ({ item, at }))
    .filter(({ item }) => item.status !== "coming")
    .sort((a, b) => (b.item.published ?? "").localeCompare(a.item.published ?? "") || a.at - b.at)
    .map(({ item }) => item);
  return [...live, ...items.filter((item) => item.status === "coming")];
}

/**
 * The filter held in an address's search string, `?filter=rust` or
 * `filter=rust`. `null` (All) when there is none, or when it is not one of the
 * filters that exist, so a stale or mistyped link shows the whole shelf.
 */
export function readFilter(search: string, known: readonly string[]): string | null {
  const value = (new URLSearchParams(search).get("filter") ?? "").trim().toLowerCase();
  return known.includes(value) ? value : null;
}

/**
 * The address to show for a filter: the same page, other parameters kept
 * (`q` among them), `filter` set, or removed for All. Used with
 * `history.replaceState`, so choosing a chip never adds a history entry.
 */
export function withFilter(location: { pathname: string; search: string; hash: string }, filter: string | null): string {
  const params = new URLSearchParams(location.search);
  if (filter === null) params.delete("filter");
  else params.set("filter", filter);
  const rest = params.toString();
  return `${location.pathname}${rest ? `?${rest}` : ""}${location.hash}`;
}

/** The filter chip for the items a student has starred. It is not a subject, so it is not in `shelfFilters`. */
export const STARRED = "starred";

/**
 * Search within a filter: the entries under it first, then the usual search
 * over those. `starred` is the set of starred shelf ids; with the Starred chip
 * chosen it is what is kept, and in any case the starred collections' results
 * come first.
 */
export function searchWithin(
  index: readonly SearchEntry[],
  query: string,
  filter: string | null,
  starred: ReadonlySet<string> = new Set(),
): SearchResult[] {
  const under =
    filter === null
      ? index
      : filter === STARRED
        ? index.filter((entry) => starred.has(entry.shelfId))
        : index.filter((entry) => entry.filters.includes(filter));
  return rankStarred(search(under, query), starred);
}

/** More pills than this and a card shows only the first few, then "+N more". */
export const PILL_LIMIT = 9;
export const PILLS_SHOWN = 8;

/**
 * The pills a card draws. A short list is shown whole. A long one is cut to
 * about two lines of a half-width card, with the rest counted. Never "+1 more":
 * a list that is only one over is shown whole. Search still finds every pill,
 * and a screen reader is told all of them.
 */
export function pillsFor(topics: readonly string[]): { shown: readonly string[]; more: number } {
  if (topics.length <= PILL_LIMIT) return { shown: topics, more: 0 };
  return { shown: topics.slice(0, PILLS_SHOWN), more: topics.length - PILLS_SHOWN };
}

/** The words for a screen reader after a chip is chosen. */
export function filterAnnouncement(count: number, label: string | null): string {
  const noun = count === 1 ? "item" : "items";
  return label === null ? `Showing all ${count} ${noun} on the shelf.` : `Showing ${count} ${noun} for ${label}.`;
}
