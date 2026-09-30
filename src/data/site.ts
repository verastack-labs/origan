/**
 * Facts about the site itself. Nothing here is a product claim.
 */
export const site = {
  name: "Origan",
  tagline: "Four years of preparation for software placements",
  description:
    "A software placement preparation partnership for engineering colleges. A consultant on your campus, a platform your students use from their first semester, and a record of everything covered between entry and placement.",
  url: "https://verastack-labs.github.io/origan",
  studio: "VeraStack Labs",
  studioUrl: "https://verastack-labs.github.io",
  location: "Bangalore, India",
} as const;

/**
 * The enquiry form posts here.
 *
 * The access key is public by design. Web3Forms uses it to identify the
 * destination inbox, and their own documentation puts it in client-side
 * markup, so committing it is the intended use rather than a leaked secret.
 * It carries no read access: it can only cause a message to be delivered to
 * an address the key already points at.
 *
 * Domain restriction is a paid feature on Web3Forms, so the key is not pinned
 * to this origin. What guards the inbox instead is the hCaptcha token below,
 * which the endpoint verifies server side, plus their spam filter and a
 * 250-a-month cap that bounds the damage either way.
 */
export const form = {
  endpoint: "https://api.web3forms.com/submit",
  key: "71da103f-670d-4a7d-80ef-197ca0461d48",
  /**
   * hCaptcha site key. Web3Forms issues this one shared key to every account
   * on the free plan and verifies the token server side against it, so it is
   * published deliberately rather than belonging to us. A site key is public
   * in any case: the secret half never leaves their server.
   */
  captchaSiteKey: "50b2fe65-b00b-4b9e-ad62-3ba471098be2",
} as const;

/**
 * The whole set, in sheet order. Rendered by the floating sheet index at the
 * foot of every page, and by the sitemap, so a new page cannot appear in one
 * and be forgotten in the other.
 */
export const sheets = [
  // `short` is what the floating bar uses below the breakpoint where the
  // header's own page links appear. Three full labels do not fit across a
  // phone, and a nav that does not fit is a nav that wraps or scrolls away.
  { href: "/", label: "Overview", short: "Overview" },
  { href: "/product/", label: "The platform", short: "Platform" },
  { href: "/partnership/", label: "The partnership", short: "Partnership" },
] as const;

/** The sheets other than the overview, which the sitemap adds separately. */
export const pages = sheets.filter((sheet) => sheet.href !== "/");

/**
 * In-page anchors, per route. The nav underlines whichever of these the reader
 * has reached; a route that passes none simply shows no underline.
 */
export const homeSections = [
  { href: "#profile", label: "The distance" },
  { href: "#strands", label: "Four strands" },
  { href: "#surface", label: "The surface" },
] as const;

export const productSections = [
  { href: "#roadmap", label: "The roadmap" },
  { href: "#practice", label: "Practice" },
  { href: "#avsar", label: "Avsar" },
] as const;

export const partnershipSections = [
  { href: "#shape", label: "The shape" },
  { href: "#modes", label: "Two modes" },
  { href: "#term", label: "The term" },
] as const;

/**
 * Which anchors belong to which sheet. The layout owns the section index, so
 * it needs to resolve this from the route rather than have every page pass it
 * down.
 */
export const sectionsByPath: Record<string, readonly { href: string; label: string }[]> = {
  "/": homeSections,
  "/product/": productSections,
  "/partnership/": partnershipSections,
};
