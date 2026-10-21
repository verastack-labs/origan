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
  kicker: "Each part is named for a surveyor's instrument, because each one measures a piece of the ground between first semester and the placement drive.",
  heading: "Every part measures [something].",
  description:
    "Each part is named for a surveyor's instrument or mark, because each records a piece of the ground between first semester and placement drive.",

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
      body: "A short questionnaire on domain, language and framework produces a roadmap, with the best existing material picked for each step. The same answers always give the same roadmap, so your cell can see why a student is on the path they are on.",
      records: "Direction, set in year one",
    },
    {
      name: "Bench Mark",
      descriptor: "The test engine",
      glyph: "benchmark",
      body: "Aptitude, reasoning, verbal and technical topics. Two tests a day, so practice becomes a habit across semesters rather than a cram in the last one.",
      records: "Scores against a fixed standard, by topic",
    },
    {
      name: "Chain",
      descriptor: "The DSA tracker",
      glyph: "chain",
      body: "Problem sheets, one link at a time. Every topic ends in problems the student has to solve, and anything shaky comes back in a week or two, because solved once is not yet learned.",
      records: "Solved, unsolved, due for revisit",
    },
    {
      name: "Elevation AI",
      descriptor: "The résumé builder",
      glyph: "sheet",
      ai: true,
      body: "AI that helps a student write the version of themselves a recruiter reads first, in curated templates.",
      records: "Versions on file, ready before a drive",
    },
    {
      name: "Beacon AI",
      descriptor: "The question forum",
      glyph: "reciprocal",
      ai: true,
      body: "An AI-backed forum for the questions a student will not ask in class, answered when they are stuck.",
      records: "What students are asking, as it changes",
    },
    {
      name: "Avsar",
      descriptor: "Campus applications",
      glyph: "peg",
      body: "Drives and internships applied for in one place instead of WhatsApp groups. अवसर means opportunity.",
      records: "Applications, eligibility, deadlines",
    },
  ] satisfies Feature[],

  // Shown under the fade. Real features, just not spelled out.
  faded: [
    {
      name: "Sightline",
      descriptor: "Picked video learning",
      glyph: "staff",
      body: "One proven playlist from what already exists, placed inside each roadmap block, with progress tracked per video, playlist and block.",
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
    heading: "AI where it [works].",
    sub: "Two features carry AI in their name because AI does the work inside them: drafting a résumé, and answering at an hour nobody else is awake.",
    body: "Everywhere else the logic is repeatable, which is what lets a placement cell trust the record.",
  },

  datum: {
    heading: "And one view for your [college].",
    sub: "Datum is the dashboard your placement cell holds: the record all of this builds, read by cohort.",
    link: { label: "What Datum shows", href: "/analytics/" },
  },
} as const;
