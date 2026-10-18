import { switchCourse } from "@/data/courses";
import { siteGraph } from "@/components/json-ld";
import { breadcrumbJsonLd, lessonJsonLd } from "@/lib/course-jsonld";
import { articleJsonLd } from "@/lib/article-jsonld";
import { getArticle } from "@/lib/articles";
import { getLesson } from "@/lib/lessons";

/**
 * The structured data this repository really emits, for the JSON-LD article to
 * quote. Each one is produced by the same function the site uses, so the page
 * shows the code's output and not a copy of it. A test checks that every one
 * is valid JSON with an `@context` and an `@type`.
 */
export type RepoSample = "organization" | "website" | "lesson" | "breadcrumb" | "article";

const node = (type: string) => {
  const found = siteGraph()["@graph"].find((n) => n["@type"] === type);
  if (!found) throw new Error(`The site graph has no ${type}`);
  // A node on its own needs its own context to be read on its own.
  return { "@context": "https://schema.org", ...found };
};

export function repoSample(which: RepoSample): object {
  switch (which) {
    case "organization":
      return node("Organization");
    case "website":
      return node("WebSite");
    case "lesson": {
      const lesson = getLesson("why-switch", switchCourse);
      if (!lesson) throw new Error("The Switch has no why-switch lesson");
      return lessonJsonLd(switchCourse, lesson);
    }
    case "breadcrumb": {
      const lesson = getLesson("why-switch", switchCourse);
      if (!lesson) throw new Error("The Switch has no why-switch lesson");
      return breadcrumbJsonLd(switchCourse, lesson);
    }
    case "article": {
      const article = getArticle("json-ld");
      if (!article) throw new Error("The json-ld article is not published");
      return articleJsonLd(article);
    }
  }
}

export const repoSampleText = (which: RepoSample) => JSON.stringify(repoSample(which), null, 2);
