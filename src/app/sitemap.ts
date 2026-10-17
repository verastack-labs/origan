import type { MetadataRoute } from "next";
import { lessonUrl, rustDsa } from "@/data/rust-dsa";
import { pages, site } from "@/data/site";
import { getLessons } from "@/lib/lessons";

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
    // The learning section. Generated from the lesson files themselves, so a
    // lesson that is published is a lesson that is listed, and a draft that has
    // no file is not.
    {
      url: `${site.url}${rustDsa.path}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    ...getLessons().map((lesson) => ({
      url: lessonUrl(lesson.slug),
      lastModified: new Date(lesson.updated),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
