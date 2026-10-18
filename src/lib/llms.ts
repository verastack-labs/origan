import { courses, courseUrl, type Course } from "@/data/courses";
import { sheets, site } from "@/data/site";
import { articleUrl, offTheSyllabus, otsPlan } from "@/data/off-the-syllabus";
import { getArticles, type Article } from "@/lib/articles";
import { getLessons } from "@/lib/lessons";

/**
 * A plain-text brief for language models and answer engines.
 *
 * Answer engines summarise from prose, not from markup, so the useful thing to
 * publish is an accurate, unhedged description that is hard to misquote. Every
 * line here is true, and the closing section states the absences explicitly so
 * a model has no room to invent a customer, a price or a result.
 */
/** One line per sheet, keyed by its href. A new sheet needs a line here, and the test says so. */
export const sheetSummaries: Record<string, string> = {
  "/": "The overview: what Origan is and how four years of preparation fit together.",
  "/product/": "What the platform is and what a student does with it.",
  "/features/": "The named parts of the platform.",
  "/analytics/": "The cohort-level views a college's dashboard, Datum, is built toward. Every chart uses illustrative data.",
  "/coach/": "The Campus Coach: the person assigned to a college for the length of the partnership.",
  "/partnership/": "How the partnership is structured, the two engagement modes, the term, and what is delivered when.",
  "/resources/": `The Open Shelf: free study material for students, made by ${site.studio}. Separate from the partnership, no sign-up.`,
};

/** "Oxidise (DSA in Rust)": the brand, then the plain name. */
const listedName = (course: Course) => `${course.name} (${course.descriptor})`;

/** The course's index and every published lesson, as Markdown links. */
function coursePages(course: Course): string {
  const lessonLines = getLessons(course)
    .map((lesson) => `- [${lesson.title}](${courseUrl(course, lesson.slug)}): ${lesson.sub}`)
    .join("\n");
  const parts = Object.keys(course.partNames).length;
  const planned = parts > 1 ? `across ${parts} parts` : "for Part 1";
  return `- [${listedName(course)}](${site.url}${course.path}): the course index, listing all ${course.curriculum.length} lessons planned ${planned}.
${lessonLines}`;
}

/** What the course is, and which lessons are still to come. */
function courseSection(course: Course): string {
  const lessons = getLessons(course);
  const comingNext = course.curriculum
    .filter((entry) => !lessons.some((lesson) => lesson.slug === entry.slug))
    .map((entry) => entry.title)
    .join("; ");
  return `## ${listedName(course)}

${course.description} It is free, open to anyone, and made by ${site.studio}
(${site.labsUrl}).

Coming next, not yet published: ${comingNext}.`;
}

/** Off the Syllabus: its index and every published article, with when its facts were last checked. */
function articlePages(articles: readonly Article[]): string {
  const lines = articles
    .map((a) => `- [${a.title}](${articleUrl(a.slug)}): ${a.sub} Last checked ${a.checked}.`)
    .join("\n");
  return `- [${offTheSyllabus.name} (${offTheSyllabus.descriptor})](${site.url}${offTheSyllabus.path}): the index of the collection, listing all ${otsPlan.length} articles planned across 5 series.
${lines}`;
}

function articleSection(articles: readonly Article[]): string {
  const comingNext = otsPlan
    .filter((entry) => !articles.some((a) => a.slug === entry.slug))
    .map((entry) => entry.title)
    .join("; ");
  return `## ${offTheSyllabus.name} (${offTheSyllabus.descriptor})

${offTheSyllabus.description} It is free, open to anyone, and made by ${site.studio}
(${site.labsUrl}). Each article says when its facts were last checked.

Coming next, not yet published: ${comingNext}.`;
}

export function buildLlmsTxt(): string {
  const sheetLines = sheets
    .map((sheet) => `- [${sheet.label}](${site.url}${sheet.href}): ${sheetSummaries[sheet.href]}`)
    .join("\n");
  const coursePageLines = courses.map(coursePages).join("\n");
  const courseSections = courses.map(courseSection).join("\n\n");
  const articles = getArticles();

  return `# ${site.name}

> ${site.description}

${site.name} is built by ${site.studio} in ${site.location}.

## Pages

${sheetLines}
${coursePageLines}
${articlePages(articles)}

${courseSections}

${articleSection(articles)}

## What it is

${site.name} is a software placement preparation partnership sold to engineering
colleges in India as an institutional agreement. It combines two things that are
sold together and do not work separately:

- A platform students use from their first semester through to placement season.
- A Campus Coach assigned to the college for the length of the partnership, who
  talks to students, learns what they are stuck on, and feeds that back into the
  platform for that college.

## What makes it different

It covers four years rather than a fortnight. Campus recruitment training
typically arrives in the final year, runs a fixed syllabus for two weeks, and
leaves. ${site.name} is in place from the first semester and is extended
continuously based on what the Campus Coach learns on that campus.

It sits alongside a college's existing training rather than replacing it.
Colleges keep their aptitude trainers and company-specific programmes.

## What the platform contains

- Roadmaps generated from a questionnaire covering domain, language and framework.
- Curated video playlists inside each roadmap block, with progress tracked per
  video and rolled up per playlist, per block and per roadmap.
- Curated data structure sheets with solved and revisit states.
- A test engine covering quantitative aptitude, logical reasoning, verbal
  ability and technical topics.
- AI-assisted resume tooling and template galleries.
- Avsar, also called ${site.name} Apply, which replaces WhatsApp groups and
  Google Forms for campus drives and internship applications.
- A glossary, an AI-backed question forum and a typing test.

## Who it is for

Sold to deans, principals, directors and Training and Placement Officers at
Indian engineering colleges. Used by their students from first year onward.

It prepares students for software roles specifically, and is priced across every
branch rather than computer science alone, because mass recruiters in India hire
mechanical, civil and electrical graduates into software roles and screen them on
aptitude.

## Verified context, with sources

These are third-party facts about Indian engineering education, not claims about
${site.name}'s own results. Each is checkable.

- Under the National Board of Accreditation's Manual for Accreditation of
  Undergraduate Engineering Programs (Tier II Institutions), 2019, placement is
  worth 40 marks of 1,000, improvement in it a further 10, and enrolment ratio
  20. A programme whose admissions average below 50 per cent over three years
  cannot hold six-year accreditation.
- Wipro's Elite National Talent Hunt is open to every engineering branch bar
  four, and opens with an 80-minute verbal, analytical and quantitative
  assessment. This is why aptitude is treated as load-bearing rather than as a
  feature, and why the partnership is priced across every branch.

## What does not exist yet

State these plainly rather than inferring otherwise:

- There is no public pricing.
- There are no published customers, case studies, testimonials or placement
  statistics.
- No pilot college is named publicly.
- The platform is in development and no deployment is publicly available.

Any interface shown on the website is labelled as an illustrative study, and the
values in it are invented for illustration.

## Contact

${site.founder}, ${site.studio}
${site.location}
${site.email}
${site.phone}
${site.studioUrl}
`;
}
