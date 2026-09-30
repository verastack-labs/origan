/**
 * Every word on the page, as data.
 *
 * Kept out of the components so copy can be reviewed without reading JSX, and
 * so `content.test.ts` can assert the things that must stay true: no pricing,
 * no named college, no invented proof.
 */

export const hero = {
  notation: "Origan · Software placement preparation for engineering colleges",
  // `accent` is set in survey mint inside the headline. Kept to one short
  // sentence: the first viewport is carrying a drawing, and a headline that
  // runs to four lines buries it.
  headline: { before: "We mark the ", accent: "ground", after: ", all four years." },
  body: "A consultant on your campus, and a platform your students use from first semester to final drive.",
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
    glyph: "traverse",
    key: "Direction",
    heading: "Knowing what to learn next",
    body: "A questionnaire produces a roadmap. Curated playlists sit inside every block, and a glossary turns the jargon into something a first-year can hold onto.",
    aside: "Heaviest in the first two years, when drifting is invisible and nobody notices until it is expensive.",
  },
  {
    glyph: "spotHeights",
    key: "Practice",
    heading: "Doing the work, repeatedly",
    body: "Curated data structure sheets with revisit marking. A test engine covering aptitude, reasoning and technical topics, spread across years instead of crammed into the last one.",
    aside: "The strand every branch uses. Mass recruiters screen on aptitude, and they hire well beyond computer science.",
  },
  {
    glyph: "station",
    key: "Readiness",
    heading: "Turning preparation into applications",
    body: "Resume tooling and template galleries. Avsar moves campus drives and internship applications off WhatsApp groups and Google Forms into one place students apply from.",
    aside: "Third and fourth year. Also where the outcome data comes from, which is what makes the rest measurable.",
  },
  {
    glyph: "sheet",
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
  primary: { label: "How the partnership works", href: "/partnership/" },
  secondary: { label: "What the platform is", href: "/product/" },
} as const;

/* ------------------------------------------------------------------ enquiry */

type Field = {
  name: string;
  label: string;
  required: boolean;
  placeholder?: string;
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
      placeholder: "TPO, dean, principal",
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
      placeholder: "Batch size, branches, when your season starts.",
      lines: 4,
      wide: true,
    },
  ] satisfies Field[],
  submit: "Send it",
  sending: "Sending",
  sent: "Thank you. This reaches Rigan directly, and you will hear back within two working days.",
  assurance: "Goes to one inbox. No mailing list.",
  awaitingCaptcha: "Complete the check above to send.",
  captchaPending: "A human check appears here once you start.",
  failed: "That did not send. Please write to",
  fallbackEmail: "therealriganb@gmail.com",
} as const;

/* ------------------------------------------------------------------ product */

export const product = {
  notation: "The platform",
  headline: {
    before: "A place a student opens in ",
    accent: "first year",
    after: ", and still opens in fourth.",
  },
  body: "Origan is not a course. It is the thing a student returns to for eight semesters: what to learn next, the practice that makes it stick, and the applications at the end of it.",

  roadmap: {
    heading: "The roadmap is generated, then it stops moving.",
    body: "A student answers a questionnaire about domain, language and the skills they already have. That produces an ordered set of blocks, each carrying a curated playlist. The blocks do not shuffle. A student who wants a different direction generates a second roadmap and keeps both.",
    points: [
      {
        glyph: "traverse",
        label: "Why generated rather than chosen",
        body: "A first-year cannot pick a syllabus they have not seen yet. Choosing is the part they are worst at, so the product does it and explains itself.",
      },
      {
        glyph: "benchmark",
        label: "Why it stops moving",
        body: "A roadmap that rearranges itself is a roadmap nobody trusts. Progress is only meaningful against something fixed.",
      },
      {
        glyph: "peg",
        label: "Why progress is stored once",
        body: "Completion lives against a student and a video, nothing else. Percentages for a playlist, a block and the whole roadmap are worked out from that, which is why swapping a playlist and swapping back loses nothing.",
      },
    ],
  },

  practice: {
    heading: "Practice, spread across four years instead of three weeks.",
    body: "Curated data structure sheets with a revisit flag, so a question somebody struggled with returns in a week or two rather than never. A test engine that selects by topic, capped at a couple of tests a day, so it stays a habit rather than a binge.",
    aptitude: {
      glyph: "spotHeights",
    label: "Aptitude sits inside the test engine",
      body: "Quantitative, logical, analytical and verbal reasoning, as topics rather than a separate module. Mass recruiters screen on aptitude and hire well beyond computer science, which is why this is the strand every branch on your campus uses.",
      // Cited because the claim is load-bearing: it is what makes pricing
      // across every branch honest rather than convenient. See
      // origan-internal/docs/market-evidence.md section 3.1.
      source:
        "Wipro's Elite National Talent Hunt is open to every engineering branch bar four, and opens with an 80-minute verbal, analytical and quantitative assessment.",
    },
  },

  avsar: {
    heading: "Avsar, where applications actually happen.",
    body: "Campus openings posted to one place instead of broadcast across WhatsApp groups. Students apply in a click from up to three saved resumes. Your cell stops chasing spreadsheets.",
    aside: "Called Avsar for students and Origan Apply in institutional conversation. It is also the measurement layer: without a record of who applied where, preparation can never be shown to have mattered.",
  },

  rest: {
    heading: "The rest of it",
    items: [
      { glyph: "fieldBook", name: "Video notes", body: "Short notes taken against the video, at the point they occurred to you." },
      { glyph: "legend", name: "Glossary", body: "A piece of tech jargon a day, explained for somebody who has not met it before." },
      { glyph: "sheet", name: "Resume tool", body: "Drafting help, plus a gallery of templates that open ready to edit." },
      { glyph: "reciprocal", name: "Forum", body: "Questions answered against the platform's own content rather than into a void." },
      { glyph: "chain", name: "Typing test", body: "Small, and genuinely useful to somebody who has never typed for a living." },
      { glyph: "grid", name: "Cohorts", body: "Batch, branch and section, which is the backbone everything institutional is built on." },
    ],
  },
} as const;

/* -------------------------------------------------------------- partnership */

export const partnership = {
  notation: "The partnership",
  headline: {
    before: "Two things, sold together, because ",
    accent: "neither works alone",
    after: ".",
  },
  body: "A platform your students use every week, and a person who has actually sat with them. A college that bought only one of these would get a fraction of the value.",

  shape: [
    {
      glyph: "contours",
      key: "The platform",
      role: "The destination",
      body: "Live for your students from day one. Roadmaps, curated video, practice sheets, tests, notes, the forum and Avsar, extended continuously through the term rather than delivered once.",
    },
    {
      glyph: "staff",
      key: "The consultant",
      role: "The medium",
      body: "Assigned to your college for as long as the partnership runs, not for an onboarding window. They hold five to ten student conversations on a campus day, and what they learn shapes what gets built for you.",
    },
  ],

  modes: {
    heading: "Two modes, and the difference is presence.",
    body: "Both carry the same platform and the same consultant. What changes is how often that person is physically on your campus, and the cadence is agreed per contract rather than fixed by us.",
    items: [
      {
        glyph: "instrument",
        key: "On campus",
        body: "A consultant present on an agreed rhythm, holding student conversations in person and sitting with your placement cell. Suits colleges large enough that a person on the ground is a small part of the arrangement.",
      },
      {
        glyph: "bearing",
        key: "Remote",
        body: "The same partnership, consulted remotely. It stays workable at any size, which means a smaller college gets the product rather than a polite refusal.",
      },
    ],
  },

  term: {
    heading: "Two years, because one year cannot show you anything.",
    body: "Origan works over four years. A single year lets a college cancel before any student has reached the part that pays off, and then conclude it did not work. Two years is the shortest term over which the thing can demonstrate itself. One year is available if you want it, and anything can be negotiated.",
    timeline: [
      { when: "Day one", what: "The platform is live for students. Nothing is gated behind an assessment period." },
      { when: "Week one onward", what: "Your consultant begins student conversations on the agreed cadence." },
      { when: "Within month one", what: "A first draft of your college's dashboard, shaped with your cell rather than handed to it." },
      { when: "Every two to four weeks", what: "Reporting to your placement cell and to college leadership." },
      { when: "Throughout", what: "Content and features extended against what your students actually report." },
    ],
  },

  who: {
    heading: "Who this involves",
    items: [
      {
        glyph: "benchmark",
        role: "Dean, principal, management",
        body: "Placement percentage, accreditation evidence, and standing against peer colleges. A two-year term is a sign-off at this level.",
      },
      {
        glyph: "sheet",
        role: "Training and placement officer",
        body: "Knowing which students are ready before a company arrives, and far less manual chasing. Usually the person who champions it internally.",
      },
      {
        glyph: "traverse",
        role: "Students",
        body: "Structured preparation that does not feel like being watched. They are the users, and the product is built so they never experience it as surveillance.",
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
    heading: "On cost",
    body: "Not published, in either direction. It depends on your headcount, which mode you want and what the term looks like, and quoting a number here would mean quoting the wrong one. It is the first thing a conversation covers.",
  },
} as const;

export const talk = {
  heading: "Start the conversation.",
  body: "Tell us a little about your college and we will come back with a time. No deck is sent in the meantime.",
} as const;
