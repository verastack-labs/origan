import type { MetadataRoute } from "next";
import { site } from "@/data/site";

/**
 * Static export: this has to be prerendered like everything else.
 *
 * Nothing here is disallowed. The site is a single public page with no search
 * parameters, no duplicate paths and nothing private, so a disallow rule would
 * only be a way to make a mistake later.
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
