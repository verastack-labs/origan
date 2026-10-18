import type { MetadataRoute } from "next";
import { courses, courseUrl } from "@/data/courses";
import { pages, site } from "@/data/site";
import { articleUrl, offTheSyllabus } from "@/data/off-the-syllabus";
import { getArticles } from "@/lib/articles";
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
    ...courses.flatMap((course) => [
      {
        url: `${site.url}${course.path}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
      ...getLessons(course).map((lesson) => ({
        url: courseUrl(course, lesson.slug),
        lastModified: new Date(lesson.updated),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ]),
    // Off the Syllabus: the index, then each article, dated by when its facts
    // were last checked.
    {
      url: `${site.url}${offTheSyllabus.path}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    ...getArticles().map((article) => ({
      url: articleUrl(article.slug),
      lastModified: new Date(article.checked),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
