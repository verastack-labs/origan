import { courses, coursePath, type Course } from "@/data/courses";
import { resources } from "@/data/resources";
import { partOf } from "@/data/rust-dsa";
import { getLessons } from "@/lib/lessons";
import type { SearchEntry } from "@/lib/search";

/**
 * The search index for the Resources page, built from the course data and the
 * lesson files at build time, so there is no second list to keep in step. One
 * entry per course and one per planned lesson; a lesson with no file yet is
 * included, marked unpublished, so "Coming next" can be searched too.
 *
 * Node-only, like `lessons.ts`. The result is plain data and crosses to the
 * client as props.
 */
export function buildSearchIndex(
  list: readonly Course[] = courses,
  liveSlugs: (course: Course) => ReadonlySet<string> = (c) => new Set(getLessons(c).map((l) => l.slug)),
): SearchEntry[] {
  const out: SearchEntry[] = [];

  for (const course of list) {
    const live = liveSlugs(course);
    const topics = resources.find((r) => r.href === course.path)?.topics ?? [];

    out.push({
      id: `course:${course.id}`,
      kind: "course",
      title: course.name,
      courseName: course.name,
      language: course.languageName,
      href: course.path,
      published: true,
      lessonCount: live.size,
      topics,
      text: [course.summary, ...Object.values(course.partNames)],
    });

    for (const entry of course.curriculum) {
      out.push({
        id: `lesson:${course.id}:${entry.slug}`,
        kind: "lesson",
        title: entry.title,
        courseName: course.name,
        language: course.languageName,
        href: coursePath(course, entry.slug),
        published: live.has(entry.slug),
        lessonNumber: entry.order,
        topics: [],
        text: [entry.angle, course.partNames[partOf(entry)] ?? ""],
      });
    }
  }

  return out;
}
