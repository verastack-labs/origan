import { search, type SearchEntry, type SearchResult } from "./search";

/**
 * The filter chips above The Open Shelf: plain functions on plain data, so the
 * same code runs in the unit tests and in the browser.
 *
 * A chip is a filter id (`rust`, `web`). An item sits under every filter it
 * lists. Choosing a chip narrows the shelf; the search box then searches
 * within what is left. The chosen chip lives in the address as `?filter=rust`,
 * next to `?q=`, so a filtered view can be linked to.
 */
export type Filterable = { filters: readonly string[]; status?: "live" | "coming" };

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

/** Live items first, then coming ones; otherwise the order they were given in. */
export function liveFirst<T extends Filterable>(items: readonly T[]): T[] {
  return [...items.filter((item) => item.status !== "coming"), ...items.filter((item) => item.status === "coming")];
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

/** Search within a filter: the entries under it first, then the usual search over those. */
export function searchWithin(index: readonly SearchEntry[], query: string, filter: string | null): SearchResult[] {
  return search(filter === null ? index : index.filter((entry) => entry.filters.includes(filter)), query);
}

/** The words for a screen reader after a chip is chosen. */
export function filterAnnouncement(count: number, label: string | null): string {
  const noun = count === 1 ? "item" : "items";
  return label === null ? `Showing all ${count} ${noun} on the shelf.` : `Showing ${count} ${noun} for ${label}.`;
}
