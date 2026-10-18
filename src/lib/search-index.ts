import { courses, coursePath, type Course } from "@/data/courses";
import { resources } from "@/data/resources";
import { partOf } from "@/data/rust-dsa";
import { articlePath, offTheSyllabus, otsPlan, otsTopics, seriesOf } from "@/data/off-the-syllabus";
import { getArticles } from "@/lib/articles";
import { getLessons } from "@/lib/lessons";
import { liveFirst } from "@/lib/shelf";
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
  liveArticles: ReadonlySet<string> = new Set(getArticles().map((a) => a.slug)),
): SearchEntry[] {
  const out: SearchEntry[] = [];

  for (const course of list) {
    const live = liveSlugs(course);
    const shelf = liveResource(course.path);
    const topics = shelf?.topics ?? [];
    const filters = shelf?.filters ?? [];
    const shelfId = shelf?.id ?? course.id;

    out.push({
      id: `course:${course.id}`,
      kind: "course",
      title: course.name,
      descriptor: course.descriptor,
      courseName: course.name,
      language: course.languageName,
      href: course.path,
      published: true,
      lessonCount: live.size,
      shelfId,
      filters,
      topics,
      text: [course.summary, ...(course.descriptor ? [course.descriptor] : []), ...Object.values(course.partNames)],
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
        shelfId,
        filters,
        topics: [],
        text: [entry.angle, course.partNames[partOf(entry)] ?? ""],
      });
    }
  }

  out.push(...articleEntries(liveArticles));
  out.push(...comingEntries());

  // Ties in a search keep the index order, so put the index in the shelf's order:
  // newest collection first, coming ones last. A sort is stable, so each
  // collection keeps its own order inside.
  const rank = new Map(liveFirst(resources).map((r, i) => [r.id, i]));
  const at = (entry: SearchEntry) => rank.get(entry.shelfId) ?? rank.size;
  return out.sort((a, b) => at(a) - at(b));
}

/** The shelf item for a path, if it is live. */
function liveResource(href: string) {
  const found = resources.find((r) => r.status === "live" && r.href === href);
  return found?.status === "live" ? found : undefined;
}

/**
 * Collections that are being built. They are found by name, descriptor and
 * topic pills, like any collection, but there is no page: the result says
 * "Coming soon" and is not a link.
 */
function comingEntries(): SearchEntry[] {
  return resources.flatMap((r) =>
    r.status === "coming"
      ? [
          {
            id: `coming:${r.id}`,
            kind: "collection" as const,
            title: r.name,
            descriptor: r.descriptor,
            courseName: r.name,
            language: r.filters.join(" "),
            href: "",
            published: false,
            comingSoon: true,
            shelfId: r.id,
            filters: r.filters,
            topics: r.topics,
            text: [r.summary, r.descriptor],
          },
        ]
      : [],
  );
}

/**
 * Off the Syllabus: the collection, and every article in the plan, written or
 * not. An article is found by its title, its series, its angle and the topics
 * it declares.
 */
function articleEntries(live: ReadonlySet<string>): SearchEntry[] {
  const written = new Map(getArticles().map((a) => [a.slug, a]));
  const shelf = liveResource(offTheSyllabus.path);
  const filters = shelf?.filters ?? [];
  const shelfId = shelf?.id ?? "off-the-syllabus";
  const entries: SearchEntry[] = [
    {
      id: "collection:off-the-syllabus",
      kind: "collection",
      title: offTheSyllabus.name,
      descriptor: offTheSyllabus.descriptor,
      courseName: offTheSyllabus.name,
      language: "Web",
      href: offTheSyllabus.path,
      published: true,
      articleCount: live.size,
      shelfId,
      filters,
      topics: otsTopics,
      text: [offTheSyllabus.summary, offTheSyllabus.descriptor],
    },
  ];

  for (const entry of otsPlan) {
    const article = written.get(entry.slug);
    entries.push({
      id: `article:${entry.slug}`,
      kind: "article",
      title: entry.title,
      courseName: offTheSyllabus.name,
      language: "Web",
      href: articlePath(entry.slug),
      published: live.has(entry.slug),
      articleNumber: entry.order,
      series: seriesOf(entry.series).name,
      shelfId,
      filters,
      topics: article ? article.topics : [],
      text: [entry.angle],
    });
  }
  return entries;
}
