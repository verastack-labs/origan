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
  "/": "The overview: the four reasons placement preparation breaks down, how Origan fixes them together, and how four years of preparation fit.",
  "/product/": "What the platform is: the best existing material picked for each topic, problems to solve, and a record of what was done.",
  "/features/": "The named parts of the platform.",
  "/analytics/": "The cohort-level views a college's dashboard, Datum, is built toward. Every chart uses illustrative data.",
  "/coach/": "The Campus Coach: the person students go to, in person or through Origan, who plans with teachers and the Training and Placement Officer.",
  "/partnership/": "The three ways a college can take Origan, the two engagement modes, the term, and what is delivered when.",
  "/resources/": `The Open Shelf: free reading material from ${site.studio}, open to anyone. Separate from Origan, no sign-up.`,
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

${site.name} is a placement preparation system sold to engineering colleges in
India as an institutional agreement. It pairs personal guidance, from a Campus
Coach, with software that tracks every student's progress. It isn't another
training program, and it isn't just a tracker.

Placement preparation breaks down for the same four reasons, and ${site.name}
fixes all four together:

1. Students don't know where to start. Bearing gives them a roadmap, and
   Sightline the best existing material for each topic, in order.
2. They get stuck and stop. The Campus Coach, posted questions and an R&D
   team answer their doubts, so nobody stays stuck.
3. Interest fades after a few weeks. The Campus Coach keeps students practising
   every week, with problems from Chain and Bench Mark.
4. Nobody sees who's falling behind until the drives begin. Datum shows the
   placement cell, by cohort, who is on track and who needs help.

Origan aggregates; it does not create. It picks the best existing resources
for each topic and makes students solve problems instead of only watching.

- A platform students use from their first semester through to placement season.
- A Campus Coach assigned to the college for the length of the partnership.
  Students go to the Coach in person or post questions through ${site.name}. The
  Coach works with the college's teachers and its Training and Placement Officer
  (TPO), plans with them, and prepares summaries and reports for the college.

Students get ${site.name} only through a college that signs up. No part of it can
be bought by an individual student.

## Three ways a college can take it

1. ${site.name} with a Campus Coach. The full partnership, and the one recommended.
2. The Campus Coach on its own. Students get a limited ${site.name}, a place to post
   questions to the Coach and track them, and can meet the Coach in person. The
   college gets the Coach's summaries and reports rather than dashboards, and the
   Coach still helps faculty plan. The Coach alone can make a difference.
3. ${site.name} on its own. Students use the platform and the college gets cohort
   data and support for the product. There is no student support, so it makes much
   less difference without a Coach.

## What makes it different

It covers four years rather than a fortnight. Campus recruitment training
typically arrives in the final year, runs a fixed syllabus for two weeks, and
leaves. ${site.name} is in place from the first semester and is extended
continuously based on what the Campus Coach learns on that campus.

It sits alongside a college's existing training and campus software rather than
replacing them. Colleges keep their training partner, their aptitude trainers
and company-specific programmes.

${site.founder} has hired and interviewed freshers himself.

## What the platform contains

- Roadmaps generated from a questionnaire covering domain, language and framework,
  each block filled with the best existing material rather than new lessons.
- One proven video playlist per roadmap block, picked from what already exists,
  with progress tracked per video and rolled up per playlist, per block and per
  roadmap.
- Problem sheets with solved and revisit states, so every topic ends in problems
  the student has to solve.
- A test engine covering quantitative aptitude, logical reasoning, verbal
  ability and technical topics.
- AI-assisted resume tooling and template galleries.
- Avsar, also called ${site.name} Apply, which replaces WhatsApp groups and
  Google Forms for campus drives and internship applications.
- A glossary, an AI-backed question forum and a typing test.

## The Open Shelf is separate

The Open Shelf is free reading material from ${site.studio}, open to anyone with no
sign-up. It is not ${site.name}'s courses and is not part of what a college buys.

## Who it is for

Sold to deans, principals, directors and Training and Placement Officers at
Indian engineering colleges. Used by their students from first year onward.

It prepares students for software roles specifically, and is offered across every
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
  feature, and why the partnership is offered across every branch.

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
