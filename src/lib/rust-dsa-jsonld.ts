import { lessonUrl, rustDsa } from "@/data/rust-dsa";
import { site } from "@/data/site";
import type { Lesson } from "@/lib/lessons";

const provider = {
  "@type": "Organization",
  name: rustDsa.provider.name,
  url: rustDsa.provider.url,
};

const indexUrl = `${site.url}${rustDsa.path}`;

/** One lesson, as a LearningResource that is part of the course. */
export function lessonJsonLd(lesson: Lesson) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: lesson.title,
    description: lesson.description,
    url: lessonUrl(lesson.slug),
    inLanguage: "en",
    learningResourceType: "lesson",
    teaches: lesson.title,
    position: lesson.order,
    dateModified: lesson.updated,
    isAccessibleForFree: true,
    isPartOf: { "@type": "Course", name: rustDsa.name, url: indexUrl },
    provider,
    author: provider,
  };
}

/** The section, as a Course whose parts are the lessons that exist today. */
export function courseJsonLd(lessons: Lesson[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: rustDsa.name,
    description: rustDsa.description,
    url: indexUrl,
    inLanguage: "en",
    isAccessibleForFree: true,
    provider,
    hasPart: lessons.map((lesson) => ({
      "@type": "LearningResource",
      name: lesson.title,
      url: lessonUrl(lesson.slug),
    })),
    about: "Data structures in the Rust programming language",
  };
}

/** Serialised for a script tag: `<` is escaped so content can never close it. */
export function jsonLdScript(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\u003c");
}
