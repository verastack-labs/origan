import { javaCollections, javaCurriculum, javaParts } from "./java-collections";
import { curriculum as rustCurriculum, lessonParts as rustParts, rustDsa } from "./rust-dsa";
import type { CurriculumEntry } from "./rust-dsa";
import { switchCurriculum, switchParts, theSwitch } from "./the-switch";
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
  /** The brand name, like "Oxidise". */
  name: string;
  /** The plain name that carries the search terms, like "DSA in Rust". */
  descriptor: string;
  /** With a leading and trailing slash. */
  path: string;
  description: string;
  provider: { readonly name: string; readonly url: string };
  partNames: Record<number, string>;
  /** The language the lessons teach, which decides how code is shown. */
  language: "rust" | "java" | "typescript";
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
  /** The heading above Part 1's lesson list; the sub is built from the counts. */
  listingHeading: string;
  /** The heading above each later part's list, keyed by part number. */
  partHeadings?: Record<number, string>;
  /** One optional line on where the name comes from. Shown once, on the index. */
  origin?: string;
  /** The closing paragraph on the index. */
  verifiedNote: string;
  /** The heading pair above the list of lesson parts, where the default does not fit. */
  shape?: { heading: string; sub: string };
};

/** The name, with its descriptor if it has one: "The Switch: JavaScript to TypeScript". */
export const fullName = (course: Pick<Course, "name" | "descriptor">) =>
  course.descriptor ? `${course.name}: ${course.descriptor}` : course.name;

export const rustCourse: Course = {
  id: "rust-dsa",
  name: rustDsa.name,
  descriptor: rustDsa.descriptor,
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
  about: "Data structures and algorithms in the Rust programming language",
  summary: "Data structures and algorithms, taught in Rust, with code that is compiled and tested.",
  hero: { heading: "Oxidise", sub: "Data structures, then algorithms, one working build at a time." },
  origin: "Rust is oxidised iron. Here, it's where your data structures harden.",
  listingHeading: "Part 1: data [structures]",
  partHeadings: { 2: "Part 2: [algorithms]" },
  verifiedNote:
    "Every piece of Rust on these pages is a real file that is compiled and tested before the page is built, so the code you read is the code that ran. Your progress is kept in this browser only. Nothing is sent anywhere.",
};

export const javaCourse: Course = {
  id: "java-collections",
  name: javaCollections.name,
  descriptor: javaCollections.descriptor,
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
  hero: { heading: "Filter [Coffee]", sub: "The tools Java ships with, one lesson at a time." },
  origin: "Java is coffee. Here, you learn to brew it strong.",
  listingHeading: "Part 1: the [framework]",
  verifiedNote:
    "Every piece of Java on these pages is a real file that is compiled and run with assertions on before the page is built, so the code you read is the code that ran. Your progress is kept in this browser only. Nothing is sent anywhere.",
};

export const switchCourse: Course = {
  id: "js-to-ts",
  name: theSwitch.name,
  descriptor: theSwitch.descriptor,
  path: theSwitch.path,
  description: theSwitch.description,
  provider: theSwitch.provider,
  partNames: theSwitch.partNames,
  language: "typescript",
  languageName: "TypeScript",
  curriculum: switchCurriculum,
  parts: switchParts,
  contentDir: ["src", "content", "learn", "js-to-ts"],
  snippets: { dir: ["ts", "the-switch"], ext: ".ts" },
  about: "The TypeScript programming language, for developers who already know JavaScript",
  summary: "JavaScript to TypeScript, one lesson at a time, with the costs as plain as the benefits.",
  hero: { heading: "The [Switch]", sub: "JavaScript to TypeScript, for people who already write JavaScript." },
  listingHeading: "The [lessons]",
  shape: { heading: "Seven parts, every [time]", sub: "So you always know where the traps are." },
  verifiedNote:
    "Every piece of TypeScript on these pages is a real file that is type-checked with strict mode on, and tested, before the page is built. The snippets that are meant to fail are checked to fail with the error shown. Your progress is kept in this browser only. Nothing is sent anywhere.",
};

/** Every course, in the order the Resources page lists them. */
export const courses: readonly Course[] = [rustCourse, javaCourse, switchCourse];

export const coursePath = (course: Pick<Course, "path">, slug: string) => `${course.path}${slug}/`;
export const courseUrl = (course: Pick<Course, "path">, slug: string) =>
  `${site.url}${coursePath(course, slug)}`;

/** The slice of a course a client component needs: small, and plain data. */
export type CourseNav = Pick<Course, "id" | "name" | "descriptor" | "path" | "parts" | "partNames">;
export const navOf = (course: Course): CourseNav => ({
  id: course.id,
  name: course.name,
  descriptor: course.descriptor,
  path: course.path,
  parts: course.parts,
  partNames: course.partNames,
});
