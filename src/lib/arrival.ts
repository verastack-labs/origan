/**
 * What happens when a reader changes chapter.
 *
 * The chapters sidebar lives in a layout that stays mounted, so changing
 * chapter replaces only the article. These are the small pure pieces behind
 * that, kept apart from the components so they can be tested without a browser.
 */

/** Space left between the sticky chrome and the top of a new article. */
export const ARRIVAL_GAP = 16;

/**
 * Where to scroll so the top of a new article sits just under the sticky
 * chrome (the site header, and the chapters bar on a phone).
 *
 * `articleTop` and `stickyBottom` are viewport coordinates, `scrollY` is the
 * page's current scroll. Returns `null` when the reader is already above that
 * line, because pulling a page that is already at its top down to the article
 * would only make it jump.
 */
export function arrivalScrollTop({
  articleTop,
  scrollY,
  stickyBottom,
  gap = ARRIVAL_GAP,
}: {
  articleTop: number;
  scrollY: number;
  stickyBottom: number;
  gap?: number;
}): number | null {
  const target = Math.max(0, Math.round(scrollY + articleTop - stickyBottom - gap));
  return scrollY > target ? target : null;
}

/** The slug being read, from the layout's selected segment, or `null` for anything that is not a chapter. */
export function activeSlug(segment: string | null, slugs: readonly string[]): string | null {
  if (!segment) return null;
  let decoded = segment;
  try {
    decoded = decodeURIComponent(segment);
  } catch {}
  return slugs.includes(decoded) ? decoded : null;
}

// --- how the reader got here -------------------------------------------------

export type Arrival = "link" | "traverse";

type Intent = { kind: Arrival; path: string };

let intent: Intent | null = null;

const clean = (path: string) => (path.endsWith("/") ? path : `${path}/`);

/** Whether a click on this anchor would be a same-tab move to another page of this site. */
export function isInternalMove(
  anchor: { href: string; target: string; download: boolean | string },
  event: { button: number; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean },
  origin: string,
): boolean {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (anchor.download || (anchor.target && anchor.target !== "_self")) return false;
  try {
    return new URL(anchor.href).origin === origin;
  } catch {
    return false;
  }
}

/**
 * Listen, from the always-mounted root, for how the next page is being
 * reached. A page that mounts cannot tell a click from a fresh load, and a
 * fresh load must not steal focus or move the scroll. Returns the cleanup.
 */
export function trackArrivals(): () => void {
  const onClick = (event: MouseEvent) => {
    const anchor = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!anchor || !isInternalMove(anchor, event, window.location.origin)) return;
    intent = { kind: "link", path: clean(new URL(anchor.href).pathname) };
  };
  const onPop = () => {
    intent = { kind: "traverse", path: clean(window.location.pathname) };
  };
  document.addEventListener("click", onClick, true);
  window.addEventListener("popstate", onPop);
  return () => {
    document.removeEventListener("click", onClick, true);
    window.removeEventListener("popstate", onPop);
  };
}

/** How this page was reached, once. `null` means a fresh load, or a move that was not a chapter change. */
export function takeArrival(path: string): Arrival | null {
  const held = intent;
  intent = null;
  return held && held.path === clean(path) ? held.kind : null;
}

// --- sheets --------------------------------------------------------------------

/**
 * What the page transition keys on. Every lesson of a course shares one key,
 * so moving between them keeps the chapters shell mounted; the course index
 * and the rest of the site each keep their own.
 */
export function sheetKey(pathname: string): string {
  const match = /^\/learn\/([^/]+)\/[^/]+\/?$/.exec(pathname);
  return match ? `/learn/${match[1]}/*` : pathname;
}
