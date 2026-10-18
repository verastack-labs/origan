/**
 * Starred shelf items: the pure half. A student can star any card on The Open
 * Shelf, and starred cards come first. The list is kept in this browser only
 * (`localStorage`, under one key), as a JSON array of resource ids. There is no
 * account and nothing is sent anywhere.
 *
 * Storage can be unavailable (a private window, blocked site data), and what is
 * stored can be stale or damaged, so every read and write here is guarded and
 * the rest of the site works without it.
 */
export const STARS_KEY = "origan:shelf:stars";

/** The slice of `Storage` this needs, so a test can hand in a fake that throws. */
export type StarStorage = Pick<Storage, "getItem" | "setItem">;

/**
 * The ids in a stored string that are real: whole strings, once each, and only
 * ones that still exist on the shelf. Anything else (damaged JSON, an id from a
 * collection that was renamed) is ignored, never an error.
 */
export function parseStars(raw: string | null | undefined, known: readonly string[]): string[] {
  if (!raw) return [];
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(value)) return [];
  const real = new Set(known);
  const out: string[] = [];
  for (const id of value) {
    if (typeof id === "string" && real.has(id) && !out.includes(id)) out.push(id);
  }
  return out;
}

/** The list with this id added, or removed if it was there. */
export function toggled(list: readonly string[], id: string): string[] {
  return list.includes(id) ? list.filter((s) => s !== id) : [...list, id];
}

/** Read the stored list. Returns an empty list if storage refuses. */
export function loadStars(storage: StarStorage | undefined, known: readonly string[]): string[] {
  try {
    return parseStars(storage?.getItem(STARS_KEY), known);
  } catch {
    return [];
  }
}

/** Write the list. Returns false if storage refused, so the caller can keep it for the visit instead. */
export function saveStars(storage: StarStorage | undefined, ids: readonly string[]): boolean {
  try {
    if (!storage) return false;
    storage.setItem(STARS_KEY, JSON.stringify(ids));
    return true;
  } catch {
    return false;
  }
}

/**
 * Starred items first, in the order given; then the rest, in the order given.
 * The order given is the shelf's own (live cards, then coming ones), so within
 * each group nothing moves.
 */
export function starsFirst<T extends { id: string }>(items: readonly T[], starred: ReadonlySet<string>): T[] {
  return [...items.filter((i) => starred.has(i.id)), ...items.filter((i) => !starred.has(i.id))];
}

/** Search results with the starred collections' results first, otherwise in the order they came. */
export function rankStarred<T extends { entry: { shelfId: string } }>(results: readonly T[], starred: ReadonlySet<string>): T[] {
  return [...results.filter((r) => starred.has(r.entry.shelfId)), ...results.filter((r) => !starred.has(r.entry.shelfId))];
}

/** What a screen reader hears after a star is pressed. */
export function starAnnouncement(name: string, nowStarred: boolean): string {
  return nowStarred ? `${name} starred, moved to the top` : `${name} unstarred`;
}
