/**
 * The Features sheet: the platform's parts, by name.
 *
 * Every name comes from land surveying, and each is paired with a plain
 * descriptor so a dean never has to decode one. "AI" appears only where AI
 * does real work inside the feature. See origan-internal/docs/naming.md.
 *
 * The legend shows a few in full and fades out on the rest. That is the brief
 * ("entice rather than specify") and also simply true: the platform is extended
 * through the term against what each campus reports.
 */

export type Feature = {
  name: string;
  descriptor: string;
  glyph: string;
  body: string;
  records: string;
  ai?: boolean;
};

export const featuresPage = {
  notation: "Features",
  headline: {
    before: "Every part measures some of the ",
    accent: "distance",
    after: ".",
  },
  body: "The platform's parts are named for the instruments and marks a surveyor uses, because each one records a piece of the ground between a student's first semester and their placement drive.",

  legend: {
    caption: "Legend",
    more: "And more",
    moreBody: "Extended through the term, against what your students report.",
  },

  shown: [
    {
      name: "Bearing",
      descriptor: "The roadmap builder",
      glyph: "bearing",
      body: "A first-year answers a short questionnaire on domain, language and framework, and gets a roadmap built for that answer. The same answers always give the same roadmap, so your placement cell can see exactly why a student is on the path they are on.",
      records: "Direction, set in year one",
    },
    {
      name: "Bench Mark",
      descriptor: "The test engine",
      glyph: "benchmark",
      body: "Quantitative aptitude, logical reasoning, verbal ability and technical topics. Two tests a day and seven a week, so practice becomes a habit across semesters instead of a cram in the last one.",
      records: "Scores against a fixed standard, by topic",
    },
    {
      name: "Chain",
      descriptor: "The DSA tracker",
      glyph: "chain",
      body: "Curated problem sheets, solved one link at a time. Anything shaky is flagged to come back to in a week or two, because a problem solved once is not yet a problem learned.",
      records: "Solved, unsolved, due for revisit",
    },
    {
      name: "Elevation AI",
      descriptor: "The résumé builder",
      glyph: "sheet",
      ai: true,
      body: "AI that helps a student write the version of themselves a recruiter reads first, set in curated templates rather than whatever a search turned up.",
      records: "Versions on file, ready before a drive",
    },
    {
      name: "Beacon AI",
      descriptor: "The question forum",
      glyph: "reciprocal",
      ai: true,
      body: "An AI-backed forum for the questions a student will not ask in class, answered when they are stuck rather than when office hours allow.",
      records: "What students are asking, as it changes",
    },
    {
      name: "Avsar",
      descriptor: "Campus applications",
      glyph: "peg",
      body: "Drives and internships applied for in one place, instead of across WhatsApp groups and Google Forms. अवसर means opportunity.",
      records: "Applications, eligibility, deadlines",
    },
  ] satisfies Feature[],

  // Shown under the fade. Real features, just not spelled out.
  faded: [
    {
      name: "Sightline",
      descriptor: "Curated video learning",
      glyph: "staff",
      body: "Playlists placed inside each roadmap block, with progress tracked per video, playlist and block.",
      records: "Watched, in order",
    },
    {
      name: "Field Book",
      descriptor: "Notes taken while watching",
      glyph: "fieldBook",
      body: "Short notes kept beside the video they came from.",
      records: "Notes, by block",
    },
    {
      name: "Legend",
      descriptor: "Daily tech jargon",
      glyph: "legend",
      body: "One term a day, explained plainly.",
      records: "Terms learned",
    },
  ] satisfies Feature[],

  ai: {
    heading: "AI where it does real work.",
    body: "Two features carry AI in their name, because AI does the work inside them: drafting a résumé, and answering a question at an hour nobody else is awake. Everywhere else the logic is deliberate and repeatable, which is what lets a placement cell trust what the record says.",
  },

  datum: {
    heading: "And one view for your college.",
    body: "Datum is the dashboard your placement cell holds: the record all of this builds, read cohort by cohort.",
    link: { label: "What Datum shows", href: "/analytics/" },
  },
} as const;
