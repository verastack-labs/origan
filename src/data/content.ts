/**
 * Every word on the page, as data.
 *
 * Kept out of the components so copy can be reviewed without reading JSX, and
 * so `content.test.ts` can assert the things that must stay true: no pricing,
 * no named college, no invented proof.
 */

export const hero = {
  notation: "Origan · Software placement preparation for engineering colleges",
  // `accent` is set in survey mint inside the headline.
  headline: { before: "Four years is a distance. We mark the ", accent: "ground", after: " the whole way." },
  body: "Software placement preparation, from first semester to final drive. A consultant on your campus, a platform your students use every week, and a record of everything covered in between.",
  primary: { label: "Request a conversation", href: "#talk" },
  secondary: { label: "See the four years", href: "#profile" },
} as const;

export const datum = {
  statement: { before: "Campus training arrives at the ", accent: "wrong chainage", after: "." },
  body: "A fortnight in the final year, against a fixed syllabus. By then the students who were going to be ready already were.",
} as const;

/** The eight semesters of the longitudinal section, in order. */
export const semesters = [
  {
    key: "S1",
    title: "Direction established",
    body: "A questionnaire produces the first roadmap. Playlists begin inside the opening blocks, and the glossary starts turning jargon into something usable.",
  },
  {
    key: "S2",
    title: "The habit forms",
    body: "Language fundamentals complete. Progress becomes visible to the student for the first time, which is most of why they come back.",
  },
  {
    key: "S3",
    title: "Practice begins in earnest",
    body: "Data structure sheets open, with revisit marking so a hard question returns in a week or two rather than never.",
  },
  {
    key: "S4",
    title: "Aptitude enters the rhythm",
    body: "Quantitative, logical and verbal reasoning become weekly rather than something met three weeks before a mass recruiter test.",
  },
  {
    key: "S5",
    title: "Depth",
    body: "Framework and project work. The roadmap has diverged meaningfully by now, shaped by what the consultant reported from this campus.",
  },
  {
    key: "S6",
    title: "Internships",
    body: "Resume tooling and template galleries. Avsar carries internship applications, and the first outcome data starts arriving.",
  },
  {
    key: "S7",
    title: "Readiness",
    body: "Mock rounds, revision of everything marked for revisit, and the resume rebuilt against the roles actually being targeted.",
  },
  {
    key: "S8",
    title: "Season",
    body: "Drives, applications and interviews through Avsar, standing on three years of accumulated work rather than a fortnight of it.",
  },
] as const;

/** Benchmarks sit on year boundaries: after S2, S4, S6 and S8. */
export const benchmarks = [
  { semester: 2, year: "I", name: "Direction" },
  { semester: 4, year: "II", name: "Practice" },
  { semester: 6, year: "III", name: "Readiness" },
  { semester: 8, year: "IV", name: "Season" },
] as const;

export const strands = [
  {
    key: "Direction",
    heading: "Knowing what to learn next",
    body: "A questionnaire produces a roadmap. Curated playlists sit inside every block, and a glossary turns the jargon into something a first-year can hold onto.",
    aside: "Heaviest in the first two years, when drifting is invisible and nobody notices until it is expensive.",
  },
  {
    key: "Practice",
    heading: "Doing the work, repeatedly",
    body: "Curated data structure sheets with revisit marking. A test engine covering aptitude, reasoning and technical topics, spread across years instead of crammed into the last one.",
    aside: "The strand every branch uses. Mass recruiters screen on aptitude, and they hire well beyond computer science.",
  },
  {
    key: "Readiness",
    heading: "Turning preparation into applications",
    body: "Resume tooling and template galleries. Avsar moves campus drives and internship applications off WhatsApp groups and Google Forms into one place students apply from.",
    aside: "Third and fourth year. Also where the outcome data comes from, which is what makes the rest measurable.",
  },
  {
    key: "Evidence",
    heading: "What your placement cell can see",
    body: "Trajectory across years rather than a readiness score against a student name. Reporting arrives biweekly or monthly, shaped with your cell rather than handed to it.",
    aside: "Deliberately built so students never experience it as being watched.",
  },
] as const;

export const alongside = {
  heading: { before: "Alongside your training, not ", accent: "instead", after: " of it." },
  body: "Keep your trainers. Origan changes what students are like when they walk into those sessions.",
  training: {
    label: "A training programme",
    items: [
      "Final year, season already running",
      "A fortnight, then it ends",
      "The same syllabus at every college",
      "Nothing measured after it leaves",
    ],
  },
  origan: {
    label: "Origan, alongside it",
    items: [
      "First year onward, all four",
      "Continuous, extended as it runs",
      "Shaped by what your students report",
      "Instrumented first week to last",
    ],
  },
} as const;

export const consultant = {
  heading: "Someone who has actually sat with your students.",
  body: "Five to ten conversations a campus day. What they learn becomes the roadmap. That is the part a platform cannot do alone.",
  stats: [
    { value: "5 – 10", countTo: 10, prefix: "5 – ", label: "Student conversations per campus day" },
    { value: "8", countTo: 8, label: "Semesters the partnership covers" },
    { value: "2wk", countTo: 2, suffix: "wk", label: "Between reports to your placement cell" },
    { value: "1 college", countTo: 1, suffix: " college", label: "Each consultant's roadmap is shaped for" },
  ],
} as const;

export const close = {
  heading: "Two years is the shortest term that shows you anything.",
  body: "Long enough for a cohort to move through it. One year is available. The rest is a conversation with your placement cell.",
  primary: { label: "Request a conversation", href: "#talk" },
  secondary: { label: "Read the four years again", href: "#profile" },
} as const;
