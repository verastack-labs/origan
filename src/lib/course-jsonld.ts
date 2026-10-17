import { courseUrl, fullName, type Course } from "@/data/courses";
import { site } from "@/data/site";
import type { Lesson } from "@/lib/lessons";

const providerOf = (course: Course) => ({
  "@type": "Organization",
  name: course.provider.name,
  url: course.provider.url,
});

const indexUrl = (course: Course) => `${site.url}${course.path}`;

/** One lesson, as a LearningResource that is part of the course. */
export function lessonJsonLd(course: Course, lesson: Lesson) {
  const provider = providerOf(course);
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: lesson.title,
    description: lesson.description,
    url: courseUrl(course, lesson.slug),
    inLanguage: "en",
    learningResourceType: "lesson",
    teaches: lesson.title,
    position: lesson.order,
    dateModified: lesson.updated,
    isAccessibleForFree: true,
    isPartOf: { "@type": "Course", name: fullName(course), url: indexUrl(course) },
    provider,
    author: provider,
  };
}

/** The section, as a Course whose parts are the lessons that exist today. */
export function courseJsonLd(course: Course, lessons: Lesson[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: fullName(course),
    ...(course.descriptor ? { alternateName: course.descriptor } : {}),
    description: course.description,
    url: indexUrl(course),
    inLanguage: "en",
    isAccessibleForFree: true,
    provider: providerOf(course),
    hasPart: lessons.map((lesson) => ({
      "@type": "LearningResource",
      name: lesson.title,
      url: courseUrl(course, lesson.slug),
    })),
    about: course.about,
  };
}

/**
 * The trail a reader sees at the top of the page, as structured data, so a
 * search result can show "Origan > Resources > DSA in Rust" instead of a bare URL.
 * Pass a lesson for a lesson page; leave it out for the course index.
 */
export function breadcrumbJsonLd(course: Course, lesson?: Lesson) {
  const trail = [
    { name: site.name, url: `${site.url}/` },
    { name: "Resources", url: `${site.url}/resources/` },
    { name: course.name, url: indexUrl(course) },
    ...(lesson ? [{ name: lesson.title, url: courseUrl(course, lesson.slug) }] : []),
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: step.name,
      item: step.url,
    })),
  };
}

/** Serialised for a script tag: `<` is escaped so content can never close it. */
export function jsonLdScript(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
