import { site } from "@/data/site";

/**
 * Whether a link leaves this site. External means an absolute http or https
 * address whose host is not Origan's own. Everything else stays here or is not
 * a page at all: a relative path, a `#anchor`, `mailto:`, `tel:`, and our own
 * address written in full.
 *
 * Case and a leading `www.` do not matter to a host, so they do not matter here.
 */
const ownHost = new URL(site.url).host.toLowerCase();

const bare = (host: string) => host.toLowerCase().replace(/^www\./, "");

export function isExternal(href: string | undefined | null): boolean {
  if (!href) return false;
  const text = href.trim();
  // `//example.com/x` is an absolute address that borrows the page's scheme.
  const absolute = /^https?:\/\//i.test(text) || text.startsWith("//");
  if (!absolute) return false;
  try {
    return bare(new URL(text, site.url).host) !== bare(ownHost);
  } catch {
    // Something that looked absolute but is not an address. Treat it as ours, not as a way out.
    return false;
  }
}
