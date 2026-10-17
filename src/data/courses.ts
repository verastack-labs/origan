import { javaCollections, javaCurriculum, javaParts } from "./java-collections";
import { curriculum as rustCurriculum, lessonParts as rustParts, rustDsa } from "./rust-dsa";
import type { CurriculumEntry } from "./rust-dsa";
import { site } from "./site";

/**
 * A course: everything the lesson machinery needs to know to serve one
 * section. The sidebar, the index, the lesson pages, the snippets, the social
 * cards, the sitemap and llms.txt all take one of these, so adding a third
 * course is a data file and a folder of lessons.
 *
 * Plain data only (no functions), so a course can cross from a server
 * component to a client one.
 */
export type LessonPart = { readonly id: string; readonly label: string };

export type Course = {
  /** Also the key for read ticks. */
  id: string;
  name: string;
  /** With a leading and trailing slash. */
  path: string;
  description: string;
  provider: { readonly name: string; readonly url: string };
  partNames: Record<number, string>;
  /** The language the lessons teach, which decides how code is shown. */
  language: "rust" | "java";
  languageName: string;
  curriculum: readonly CurriculumEntry[];
  parts: readonly LessonPart[];
  /** Path segments from the project root to the lesson MDX files. */
  contentDir: readonly string[];
  /** Where the tested snippets live, and the extension of their files. */
  snippets: { readonly dir: readonly string[]; readonly ext: string };
  /** Said in JSON-LD as what the course is about. */
  about: string;
  /** The line on the course card and the social card. */
  summary: string;
  hero: { heading: string; sub: string };
  /** The heading above the lesson list; the sub is built from the counts. */
  listingHeading: string;
  /** The closing paragraph on the index. */
  verifiedNote: string;
};

export const rustCourse: Course = {
  id: "rust-dsa",
  name: rustDsa.name,
  path: rustDsa.path,
  description: rustDsa.description,
  provider: rustDsa.provider,
  partNames: rustDsa.partNames,
  language: "rust",
  languageName: "Rust",
  curriculum: rustCurriculum,
  parts: rustParts,
  contentDir: ["src", "content", "learn", "rust-dsa"],
  snippets: { dir: ["rust", "rust-dsa", "src"], ext: ".rs" },
  about: "Data structures in the Rust programming language",
  summary: "Data structures, taught in Rust, with code that is compiled and tested.",
  hero: { heading: "DSA in [Rust]", sub: "Data structures, one working build at a time." },
  listingHeading: "Part 1: data [structures]",
  verifiedNote:
    "Every piece of Rust on these pages is a real file that is compiled and tested before the page is built, so the code you read is the code that ran. Your progress is kept in this browser only. Nothing is sent anywhere.",
};

export const javaCourse: Course = {
  id: "java-collections",
  name: javaCollections.name,
  path: javaCollections.path,
  description: javaCollections.description,
  provider: javaCollections.provider,
  partNames: javaCollections.partNames,
  language: "java",
  languageName: "Java",
  curriculum: javaCurriculum,
  parts: javaParts,
  contentDir: ["src", "content", "learn", "java-collections"],
  snippets: { dir: ["java", "java-collections", "src"], ext: ".java" },
  about: "The Java Collections Framework in the Java programming language",
  summary: "The Java Collections Framework, taught to beginners, with code that is compiled and tested.",
  hero: { heading: "Java [Collections]", sub: "The tools Java ships with, one lesson at a time." },
  listingHeading: "Part 1: the [framework]",
  verifiedNote:
    "Every piece of Java on these pages is a real file that is compiled and run with assertions on before the page is built, so the code you read is the code that ran. Your progress is kept in this browser only. Nothing is sent anywhere.",
};

/** Every course, in the order the Resources page lists them. */
export const courses: readonly Course[] = [rustCourse, javaCourse];

export const coursePath = (course: Pick<Course, "path">, slug: string) => `${course.path}${slug}/`;
export const courseUrl = (course: Pick<Course, "path">, slug: string) =>
  `${site.url}${coursePath(course, slug)}`;

/** The slice of a course a client component needs: small, and plain data. */
export type CourseNav = Pick<Course, "id" | "name" | "path" | "parts">;
export const navOf = (course: Course): CourseNav => ({
  id: course.id,
  name: course.name,
  path: course.path,
  parts: course.parts,
});
