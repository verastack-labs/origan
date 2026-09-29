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

export const nav = [
  { href: "#profile", label: "The distance" },
  { href: "#strands", label: "What it does" },
  { href: "#alongside", label: "Alongside training" },
  { href: "#consultant", label: "The consultant" },
  { href: "#surface", label: "The surface" },
] as const;
