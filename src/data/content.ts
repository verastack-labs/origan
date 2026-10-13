/**
 * Every word on the page, as data.
 *
 * Kept out of the components so copy can be reviewed without reading JSX, and
 * so `content.test.ts` can assert the things that must stay true: no pricing,
 * no named college, no invented proof.
 */

export const hero = {
  notation: "Origan · Software placement preparation for engineering colleges",
  // The line the carousel and the film close on, so the site opens on it. The
  // newline is a deliberate break: the hero's figure owns the right of the frame.
  heading: "Four years,\nnot four [weeks].",
  sub: "Placement preparation that starts in first semester. A Campus Coach on your campus, and a platform your students open from day one to the final drive.",
  secondary: { label: "See the four years", href: "#profile" },
} as const;

export const datum = {
  kicker: "Campus training usually arrives as a fortnight in final year, against a fixed syllabus.",
  heading: "Final year is too [late].",
  body: "By then, the students who were going to be ready already are.",
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
    body: "Bearing builds the first roadmap. Playlists and the glossary begin.",
  },
  {
    key: "S2",
    title: "The habit forms",
    body: "Language fundamentals complete. Progress becomes visible, which is most of why a student comes back.",
  },
  {
    key: "S3",
    title: "Practice begins in earnest",
    body: "Chain opens: data structure sheets with revisit marking, so a hard question comes back.",
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
    body: "Bearing builds a roadmap from a short questionnaire. Sightline puts a curated playlist in every block.",
    aside: "Heaviest in the first two years, when drifting is invisible until it is expensive.",
  },
  {
    glyph: "spotHeights",
    key: "Practice",
    heading: "Practice that comes back",
    body: "Chain, for data structures with revisit marking. Bench Mark, a test engine covering aptitude and technical topics, spread across years.",
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
    heading: "A record your cell can read",
    body: "Datum: cohorts across years, never a score against a name. A report every two to four weeks, shaped with your cell.",
    aside: "Built so students never experience it as being watched.",
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
  sub: "A Campus Coach sits with your students, five to ten conversations a campus day, and turns what they hear into the roadmap.",
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
  fallbackEmail: "verastack.labs@gmail.com",
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
  fallbackEmail: "verastack.labs@gmail.com",
} as const;

/* ------------------------------------------------------------------ product */

export const product = {
  notation: "The platform",
  kicker: "Not a course you finish. The place a student comes back to for eight semesters.",
  heading: "From first year to [fourth].",
  description:
    "Not a course. The thing a student returns to for eight semesters: what to learn next, the practice that makes it stick, and the applications at the end.",

  roadmap: {
    heading: "A roadmap that [stays].",
    sub: "Bearing builds it from a short questionnaire, in blocks that don't reshuffle. Want another direction? Generate a second roadmap and keep both.",
    points: [
      {
        glyph: "traverse",
        label: "Why generated rather than chosen",
        body: "A first-year cannot pick a syllabus they have not seen. The product chooses, and explains itself.",
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
    sub: "Chain brings a hard question back in a week or two. Bench Mark sets two tests a day, so practice becomes a habit, not a binge.",
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
    "A platform your students use every week, and a person who has sat with them. One without the other is a fraction of the value.",
  sub: "A platform your students use every week, and a person who has sat with them. Either alone is a fraction of the value.",

  shape: [
    {
      glyph: "contours",
      key: "The platform",
      role: "The destination",
      body: "Live from day one. Bearing, Sightline, Chain, Bench Mark, Beacon and Avsar, extended through the term rather than delivered once.",
    },
    {
      glyph: "staff",
      key: "The Campus Coach",
      role: "The medium",
      body: "Assigned for the whole term, not an onboarding window. Five to ten student conversations a campus day, and what they hear shapes what gets built for you.",
    },
  ],

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
      { when: "Day one", what: "The platform is live for students. Nothing is gated behind an assessment period." },
      { when: "Week one onward", what: "Your Campus Coach begins student conversations on the agreed cadence." },
      { when: "Within month one", what: "A first draft of Datum, your college's dashboard, shaped with your cell." },
      { when: "Every two to four weeks", what: "Reporting to your placement cell and to college leadership." },
      { when: "Throughout", what: "Content and features extended against what your students actually report." },
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
    sub: "Not published. It depends on headcount, mode and term, and it's the first thing a conversation covers.",
  },
} as const;

export const talk = {
  heading: "Let's [talk].",
  sub: "Tell us about your college, and we'll come back with a time within two working days.",
  orRegister: "Not ready to talk yet? Three fields keeps your college on the list.",
} as const;
