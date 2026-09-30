import type { MetadataRoute } from "next";
import { pages, site } from "@/data/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${site.url}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    // Driven off the same list the nav renders, so a page cannot be added to
    // one and forgotten in the other.
    ...pages.map((page) => ({
      url: `${site.url}${page.href}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
