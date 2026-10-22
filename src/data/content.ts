/**
 * Every word on the page, as data.
 *
 * Kept out of the components so copy can be reviewed without reading JSX, and
 * so `content.test.ts` can assert the things that must stay true: no pricing,
 * no named college, no invented proof.
 */

export const hero = {
  notation: "Origan · The record of what a batch has covered",
  // The cadence the carousel and the film close on, with the record as the
  // payload rather than the time horizon. The newline is a deliberate break:
  // the hero's figure owns the right of the frame.
  heading: "Four years,\none [record].",
  sub: "What each student has actually covered and solved, from first semester to the final drive, with a Campus Coach who steps in when someone stalls. Your cell reads the same record as a cohort, never a ranking.",
  secondary: { label: "See the four years", href: "#profile" },
} as const;

export const datum = {
  kicker: "Students aren't short of content. They're stuck in tutorial hell, watching hour after hour and never writing the solution themselves.",
  heading: "Nobody owns the [record].",
  body: "Nobody notices when they stall. Ask what a batch covered in second year and you get a shrug, so the gaps that were still fixable then are found in year four, when they are simply late.",
} as const;

export const profile = {
  notation: "Longitudinal section",
  heading: "Every semester has a [job].",
  sub: "Eight of them, from first direction to final drive. Pick one to see what happens in it.",
} as const;

export const strandsHead = {
  notation: "Levels observed",
  heading: "Four strands, all four [years].",
  sub: "Direction, practice, readiness and evidence, woven through every semester instead of stacked at the end.",
} as const;

/** The eight semesters of the longitudinal section, in order. */
export const semesters = [
  {
    key: "S1",
    title: "Direction established",
    body: "Bearing builds the first roadmap, with the best existing playlist picked for each block.",
  },
  {
    key: "S2",
    title: "The habit forms",
    body: "Language fundamentals complete. Progress becomes visible, which is most of why a student comes back.",
  },
  {
    key: "S3",
    title: "Practice begins in earnest",
    body: "Chain opens: data structure problems to solve, with revisit marking, so a hard question comes back.",
  },
  {
    key: "S4",
    title: "Aptitude enters the rhythm",
    body: "Bench Mark makes aptitude weekly, rather than a cram three weeks before a test.",
  },
  {
    key: "S5",
    title: "Depth",
    body: "Framework and project work. The roadmap has diverged by now, shaped by what your Campus Coach reported.",
  },
  {
    key: "S6",
    title: "Internships",
    body: "Elevation builds the first résumé. Avsar carries internship applications, and outcome data starts arriving.",
  },
  {
    key: "S7",
    title: "Readiness",
    body: "Mock rounds, every revisit cleared, and the résumé rebuilt against the roles being targeted.",
  },
  {
    key: "S8",
    title: "Season",
    body: "Drives and interviews through Avsar, on three years of work rather than a fortnight.",
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
    glyph: "traverse",
    key: "Direction",
    heading: "Know what's next",
    body: "Bearing builds a roadmap from a short questionnaire. Sightline puts one proven playlist, picked from what already exists, in every block.",
    aside: "Heaviest in the first two years, when drifting is invisible until it is expensive.",
  },
  {
    glyph: "spotHeights",
    key: "Practice",
    heading: "Practice that comes back",
    body: "Chain, where every topic ends in problems the student has to solve, with revisit marking. Bench Mark, a test engine covering aptitude and technical topics, spread across years.",
    aside: "The strand every branch uses. Mass recruiters screen on aptitude and hire well beyond computer science.",
  },
  {
    glyph: "station",
    key: "Readiness",
    heading: "From preparation to applications",
    body: "Elevation for résumés. Avsar moves campus drives and internship applications off WhatsApp groups into one place.",
    aside: "Third and fourth year, and where the outcome data comes from.",
  },
  {
    glyph: "sheet",
    key: "Evidence",
    heading: "One record, two readers",
    body: "A student sees what they have covered and where they are thin. Datum shows your cell the same record as cohorts across years, never a score against a name.",
    aside: "A record a student reads about themselves is not surveillance of them.",
  },
] as const;

export const alongside = {
  heading: "Alongside, not [instead].",
  sub: "Keep your trainers and your training week. Origan changes who walks into the room.",
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
  heading: "Someone on your [campus].",
  sub: "Students go to the Campus Coach in person, or post questions through Origan. The Coach plans with your teachers and your Training and Placement Officer (TPO).",
  stats: [
    { value: "5 – 10", label: "Student conversations per campus day" },
    { value: "8", label: "Semesters the partnership covers" },
    { value: "2 – 4 wk", label: "Between reports to your placement cell" },
    { value: "1", label: "College each Campus Coach's roadmap is shaped for" },
  ],
} as const;

export const close = {
  heading: "Give it two [years].",
  sub: "The shortest term that can show anything. One year is available.",
  secondary: { label: "How the partnership works", href: "/partnership/" },
} as const;

/* ---------------------------------------------------------------------- faq */

/**
 * The questions colleges and students ask. Rendered as disclosure rows on the
 * overview and emitted as FAQPage structured data from this same list, so the
 * visible text and the markup cannot differ. Every answer restates something
 * the rest of the site already says; there is no public price, so the price
 * answer says so.
 */
export const faq = {
  heading: "Questions, [answered].",
  sub: "What colleges and students ask first. Anything else, just write to Rigan.",
  items: [
    {
      q: "So what is Origan, really?",
      a: "It's a record of what each engineering student has covered and solved, from first semester to the final drive. It picks the best existing material for each topic and makes students practise it, and a Campus Coach on campus notices when someone stalls.",
    },
    {
      q: "Does Origan make its own courses?",
      a: "No. It picks the best existing resources for each topic and makes students solve problems instead of only watching. Students are rarely short of content; they are stuck in tutorial hell, watching without ever writing the solution.",
    },
    {
      q: "Is it only for computer science students?",
      a: "No, every branch uses it. Mass recruiters screen on aptitude and hire well beyond computer science.",
    },
    {
      q: "What does a Campus Coach actually do?",
      a: "Students go to them in person or post questions through Origan, and they plan with your teachers and your Training and Placement Officer (TPO) around what students are stuck on. Your placement cell gets summaries and reports every two to four weeks.",
    },
    {
      q: "Can we take the Campus Coach without the platform?",
      a: "Yes, and the Coach alone can make a real difference. Students get a limited Origan to post questions to the Coach and track them, the college gets the Coach's summaries and reports instead of dashboards, and the Coach still helps your faculty plan. The platform on its own is possible too, but it has no student support, so it makes much less difference without a Coach.",
    },
    {
      q: "Can students sign up on their own?",
      a: "No. Students get Origan through their college, and no part of it can be bought by an individual student. If your college isn't on Origan yet, you can ask us to bring it there.",
    },
    {
      q: "Do we have to drop our training partner?",
      a: "No, keep them. Origan runs alongside your trainers, from first year onward instead of one fortnight in the final year.",
    },
    {
      q: "Will the college see my scores?",
      a: "No. It sees groups, like a batch or a branch, never one student's results or a ranking.",
    },
    {
      q: "How long do we have to commit?",
      a: "Two years is the usual start, and one year is available. Two years is the shortest time that can show anything.",
    },
    {
      q: "How much does it cost?",
      a: "We talk about price in conversation, not on the website. It depends on which of the three ways you take Origan, so write to Rigan or register your interest, and he will set up a time.",
    },
    {
      q: "What is the Open Shelf?",
      a: "Free reading material from VeraStack Labs, open to anyone with no sign-up, including Oxidise (DSA in Rust) and Filter Coffee (Java Collections). It is separate from Origan and is not part of what a college buys.",
    },
  ],
} as const;

/* ------------------------------------------------------------------ enquiry */

type Field = {
  name: string;
  label: string;
  required: boolean;
  placeholder?: string;
  /** Shown under the label, where it stays while the reader types. */
  hint?: string;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  /** Rows, when the control should be a textarea rather than an input. */
  lines?: number;
  /** Spans both columns at the wider breakpoint. */
  wide?: boolean;
};

export const enquiry = {
  fields: [
    {
      name: "name",
      label: "Your name",
      required: true,
      placeholder: "",
      autoComplete: "name",
    },
    {
      name: "role",
      label: "Your role",
      required: true,
      placeholder: "",
      hint: "TPO, dean, principal",
      autoComplete: "organization-title",
    },
    {
      name: "college",
      label: "College",
      required: true,
      placeholder: "",
      autoComplete: "organization",
      wide: true,
    },
    {
      name: "email",
      label: "Email",
      required: true,
      type: "email",
      placeholder: "",
      autoComplete: "email",
    },
    {
      name: "phone",
      label: "Phone",
      required: false,
      type: "tel",
      placeholder: "",
      autoComplete: "tel",
    },
    {
      name: "message",
      label: "Anything worth knowing first",
      required: false,
      placeholder: "",
      hint: "Batch size, branches, when your season starts.",
      lines: 4,
      wide: true,
    },
  ] satisfies Field[],
  submit: "Request a conversation",
  sending: "Sending",
  sent: "Thank you. This reaches Rigan directly, and you will hear back within two working days.",
  assurance: "Goes to one inbox. No mailing list.",
  awaitingCaptcha: "One human check, then it sends.",
  captchaPending: "",
  failed: "That did not send. Please write to",
  fallbackEmail: "rigan@verastack.dev",
} as const;

/** The interest list. Three fields, raised in a dialog from any call to action. */
export const interest = {
  cta: "Register your interest",
  notation: "Interest list",
  heading: "Join the [list].",
  sub: "Three fields. We'll write back with a time to talk, and nothing else.",
  subject: "Origan interest list",
  fields: [
    { name: "email", label: "Email", type: "email", placeholder: "you@college.ac.in", autoComplete: "email" },
    { name: "college", label: "College", type: "text", placeholder: "", autoComplete: "organization" },
    { name: "city", label: "City", type: "text", placeholder: "", autoComplete: "address-level2" },
  ] as const,
  submit: "Register",
  sending: "Sending",
  sentHeading: "You're on the list.",
  sent: "You'll hear from Rigan within two working days. If your season is close, write to him directly at the foot of the page.",
  done: "Back to the page",
  assurance: "One inbox. No mailing list.",
  awaitingCaptcha: "Complete the check above to register.",
  failed: "That did not send. Please write to",
  fallbackEmail: "rigan@verastack.dev",
} as const;

/**
 * The student referral: a student names their college and, if they know one,
 * someone there worth talking to. Any college contact counts, because a
 * non-decider is a bridge to the right person. It is an invitation, never a
 * report on staff or students, and the copy keeps to that.
 */
export const studentReferral = {
  cta: "Bring Origan to your college",
  footerLink: "Students: bring Origan to your college",
  notation: "From a student",
  heading: "Bring it to your [college].",
  sub: "Tell us where you study and who we should talk to. We'll take it from there.",
  subject: "Origan student referral",
  fields: [
    { name: "name", label: "Your name", type: "text", placeholder: "", autoComplete: "name" },
    { name: "college", label: "College", type: "text", placeholder: "", autoComplete: "organization" },
    { name: "city", label: "City", type: "text", placeholder: "", autoComplete: "address-level2" },
    {
      name: "branch_year",
      label: "Branch and year",
      type: "text",
      placeholder: "e.g. ECE, 2nd year",
      autoComplete: "off",
      required: false,
    },
    {
      name: "contact",
      label: "Email or phone",
      type: "text",
      placeholder: "",
      autoComplete: "off",
      contact: true,
    },
    {
      name: "talk_to",
      label: "Who should we talk to?",
      type: "text",
      placeholder: "Placement officer or a faculty member, if you know one",
      autoComplete: "off",
      required: false,
      multiline: true,
    },
  ] as const,
  contactInvalid: "Enter an email address or a phone number.",
  submit: "Send",
  sending: "Sending",
  sentHeading: "Thank you.",
  sent: "We'll reach out to your college. You don't need to do anything else.",
  done: "Back to the page",
  assurance: "We only use this to contact your college. Nothing you write is shared with them.",
  awaitingCaptcha: "Complete the check above to send.",
  failed: "That did not send. Please write to",
  fallbackEmail: "rigan@verastack.dev",
} as const;

/** The quiet band on the overview and the platform sheet that opens it. */
export const studentBand = {
  kicker: "Studying somewhere without Origan?",
  heading: "Bring it to your [college].",
} as const;

/* ------------------------------------------------------------------ product */

export const product = {
  notation: "The platform",
  kicker: "Not a course, and not ours to teach. The best existing material, picked for each topic, and proof it was practised.",
  heading: "From first year to [fourth].",
  description:
    "Not a course. The best existing material for each topic, picked for the student, with problems to solve after it, a record of what was done, and the applications at the end.",

  roadmap: {
    heading: "A roadmap that [stays].",
    sub: "Bearing builds it from a short questionnaire, in blocks that don't reshuffle, and fills each with the best material that already exists. Want another direction? Generate a second roadmap and keep both.",
    points: [
      {
        glyph: "traverse",
        label: "Why generated rather than chosen",
        body: "A first-year cannot pick a syllabus they have not seen. The product picks the best existing playlist for each topic, and explains itself.",
      },
      {
        glyph: "benchmark",
        label: "Why it stops moving",
        body: "A roadmap that rearranges itself is one nobody trusts. Progress only means something against a fixed line.",
      },
      {
        glyph: "peg",
        label: "Why progress is stored once",
        body: "Completion lives against a student and a video. Everything else is worked out from that, so swapping a playlist and back loses nothing.",
      },
    ],
  },

  practice: {
    heading: "Practice that comes [back].",
    sub: "Watching is not practising. Every topic ends in problems to solve in Chain, and a hard one comes back in a week or two. Bench Mark sets two tests a day, so practice becomes a habit, not a binge.",
    aptitude: {
      glyph: "spotHeights",
    label: "Aptitude sits inside the test engine",
      body: "Quantitative, logical, analytical and verbal reasoning, as topics inside Bench Mark. Mass recruiters screen on aptitude and hire well beyond computer science, so every branch on your campus uses this.",
      // Cited because the claim is load-bearing: it is what makes pricing
      // across every branch honest rather than convenient. See
      // origan-internal/docs/market-evidence.md section 3.1.
      source:
        "Wipro's Elite National Talent Hunt is open to every engineering branch bar four, and opens with an 80-minute verbal, analytical and quantitative assessment.",
    },
  },

  avsar: {
    heading: "Off the WhatsApp [groups].",
    sub: "Avsar puts every campus opening in one place. Students apply in a click from a saved résumé, and your cell stops chasing spreadsheets.",
    aside: "Also the measurement layer: without a record of who applied where, preparation can never be shown to have mattered.",
  },

  rest: {
    notation: "The rest of it",
    heading: "And the [rest].",
    sub: "Nine named parts, and one view for your college.",
    link: { label: "Every feature, by name", href: "/features/" },
  },
} as const;

/* -------------------------------------------------------------- partnership */

export const partnership = {
  notation: "The partnership",
  heading: "Two things, one [partnership].",
  description:
    "Origan and a Campus Coach, best together. Three ways to take it: with a Coach, the Coach on its own, or Origan on its own. Students get it only through their college.",
  sub: "A platform your students use every week, and a person they can go to. Best together; the Coach alone can still make a difference.",

  shape: [
    {
      glyph: "contours",
      key: "The platform",
      role: "The destination",
      body: "The core tools go live from month two. Bearing and Sightline pick the best existing material, Chain makes students solve it, and Bench Mark, Beacon and Avsar round it out, extended through the term rather than delivered once.",
    },
    {
      glyph: "staff",
      key: "The Campus Coach",
      role: "The heart of it",
      body: "Assigned for the whole term, not an onboarding window. Students go to them in person or post questions through Origan, and they plan with your teachers and your TPO.",
    },
  ],

  ways: {
    notation: "How it is bought",
    heading: "Three ways to [begin].",
    sub: "We recommend the first. Each is agreed with the college.",
    recommended: "Recommended",
    items: [
      {
        glyph: "contours",
        key: "Origan with a Campus Coach",
        recommended: true,
        body: "The full partnership. Students use the platform every week and have a Coach to go to, in person or through Origan. The Coach plans with your teachers and TPO, and your cell reads the record by cohort in Datum.",
      },
      {
        glyph: "staff",
        key: "The Campus Coach on its own",
        recommended: false,
        body: "Students get a limited Origan, a place to post questions to the Coach and track them, and they can meet the Coach in person. The college gets the Coach's summaries and reports rather than dashboards, and the Coach still helps your faculty plan. The Coach alone can make a difference.",
      },
      {
        glyph: "bearing",
        key: "Origan on its own",
        recommended: false,
        body: "Students use the platform and your cell gets the cohort data, with support for the product itself. There is no student support, so it makes much less difference without a Coach.",
      },
    ],
    note: "Students get Origan through their college. It can't be bought by individual students.",
  },

  modes: {
    heading: "Two modes, one [difference].",
    sub: "Same platform, same Campus Coach. What changes is how often they're physically on campus, agreed per contract.",
    items: [
      {
        glyph: "instrument",
        key: "On campus",
        body: "A Campus Coach on campus on an agreed rhythm, with your students and your placement cell. Suits a college where a person on the ground is a small part of the arrangement.",
      },
      {
        glyph: "bearing",
        key: "Remote",
        body: "The same partnership, consulted remotely. Workable at any size, so a smaller college gets the product rather than a refusal.",
      },
    ],
  },

  term: {
    kicker: "A single year ends before any student reaches the part that pays off.",
    heading: "Two years, at [least].",
    body: "One year is available, and anything can be negotiated.",
    timeline: [
      { when: "Month one", what: "Assessment. Your Campus Coach and our team study how your students prepare today, department by department." },
      { when: "From month two", what: "The core tools go live: the roadmap planner, curated video with notes, and the DSA sheets and tracker." },
      { when: "Months two and three", what: "Assessment continues, and the tools are built and tuned to what it finds." },
      { when: "By the end of month three", what: "Everything in place: Datum, your college's complete dashboard, and the progress monitors." },
      { when: "Through the term", what: "Your Campus Coach holds student conversations on one or two fixed days a week, and reports to your placement cell every two to four weeks." },
      { when: "From then on", what: "Everything, for the rest of the term, with material and features extended against what your students actually report." },
    ],
  },

  who: {
    notation: "Who this involves",
    heading: "Who's in the [room].",
    sub: "The people who sign, the people who run it, and the people it's for.",
    items: [
      {
        glyph: "benchmark",
        role: "Dean, principal, management",
        body: "Placement percentage, accreditation evidence, standing against peers. A two-year term is signed at this level.",
      },
      {
        glyph: "sheet",
        role: "Training and placement officer",
        body: "Which cohorts are ready before a company arrives, and far less chasing. Usually the internal champion.",
      },
      {
        glyph: "traverse",
        role: "Students",
        body: "Structured preparation that does not feel like being watched. The users, never the subject of a ranking.",
      },
    ],
  },

  // Every figure here is verified against the NBA's own manual. Nothing on
  // this site claims a result Origan produced; this describes how the
  // regulator already scores the college, which is checkable.
  accreditation: {
    label: "Why this reaches past the placement cell",
    body: "Your NBA accreditation scores placement and filling your seats in the same criterion: forty marks for placement, ten more for improving it, and twenty for enrolment ratio. A programme that cannot fill half its seats, averaged over three years, cannot hold six-year accreditation at all.",
    aside: "Weak placement and weak admissions compound by design, and preparation compressed into final year cannot move a three-year average.",
    source:
      "National Board of Accreditation, Manual for Accreditation of Undergraduate Engineering Programs (Tier II Institutions), 2019.",
  },

  cost: {
    heading: "On [cost].",
    sub: "Not published. It depends on headcount, mode, term and which of the three ways you take it, and it's the first thing a conversation covers.",
  },
} as const;

export const talk = {
  heading: "Let's [talk].",
  sub: "Tell us about your college, and we'll come back with a time within two working days.",
  orRegister: "Not ready to talk yet? Three fields keeps your college on the list.",
} as const;
