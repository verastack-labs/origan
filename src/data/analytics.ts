/**
 * The Analytics sheet: the kinds of views Datum, a college's dashboard, is built
 * toward.
 *
 * EVERY VALUE IN THIS FILE IS INVENTED FOR ILLUSTRATION, and the page labels
 * every chart as such. No deployment exists, so nothing here may be presented
 * as a measurement, a result, or a college's data.
 *
 * What Datum finally contains is drafted with each college's placement cell,
 * so these are a direction rather than a specification. Every view is
 * cohort-level: groups of students over time, never a ranking of individuals.
 */

export const analyticsPage = {
  notation: "Analytics",
  heading: "What your cell [sees].",
  sub: "Datum reads the record as a whole batch or a single section, by branch, semester and topic. A first draft within month one.",
  description:
    "Datum, your college's dashboard, is its view of the record. How closely it reads is yours to set: a whole batch down to a single section, by branch, semester and topic. A first draft within month one, shaped with your placement cell.",
  disclaimer: "Illustrative data",
  direction:
    "Drafted with each college, so these views show the direction, not a fixed product. Every number here is invented.",

  trajectory: {
    heading: "Eight semesters, not eight [weeks].",
    sub: "One cohort's median score, first semester to last. A line that starts early has room to rise.",
    caption: "Median test score by semester",
    unit: "%",
    series: [
      { key: "cse", label: "Computer Science", tone: "survey", values: [38, 45, 52, 58, 63, 68, 72, 75] },
      { key: "mech", label: "Mechanical", tone: "fg-3", values: [24, 30, 38, 46, 53, 60, 65, 69] },
    ],
    // Where campus recruitment training usually starts. The same mark the
    // longitudinal section on the overview uses.
    marker: { semester: 7, label: "Campus training begins" },
  },

  branches: {
    heading: "Every branch, side by [side].",
    sub: "Who's practising, branch by branch. A gap is a conversation for your Campus Coach, not a verdict on a department.",
    caption: "Practising in the last four weeks, by branch",
    rows: [
      { label: "Computer Science", value: 82 },
      { label: "Information Science", value: 78 },
      { label: "Electronics", value: 64 },
      { label: "Electrical", value: 51 },
      { label: "Mechanical", value: 47 },
      { label: "Civil", value: 39 },
    ],
  },

  topics: {
    heading: "Where a cohort is [stuck].",
    sub: "Accuracy by topic and year. The weak cells decide next term's content.",
    caption: "Accuracy by topic and year",
    years: ["Year 1", "Year 2", "Year 3", "Year 4"],
    rows: [
      { label: "Quantitative", values: [41, 55, 66, 74] },
      { label: "Logical reasoning", values: [48, 59, 70, 78] },
      { label: "Verbal", values: [52, 54, 57, 61] },
      { label: "Arrays and hashing", values: [33, 51, 68, 76] },
      { label: "Recursion", values: [null, 38, 57, 69] },
      { label: "Dynamic programming", values: [null, null, 42, 58] },
      { label: "SQL", values: [null, 44, 63, 71] },
    ] as { label: string; values: (number | null)[] }[],
    notYet: "Not yet started",
  },

  report: {
    kicker: "Every two to four weeks: the readings, what your Campus Coach saw, and what happens next.",
    heading: "Read in five [minutes].",
    title: "Datum · Report",
    period: "Semester 5 · Weeks 9 to 12",
    readings: [
      { value: "71%", label: "Active on the platform this period" },
      { value: "3,412", label: "Bench Mark tests taken" },
      { value: "64%", label: "Revisits cleared on time" },
    ],
    observed: {
      label: "Observed on campus",
      items: [
        "Year 3 verbal practice trails quantitative across every branch.",
        "Mechanical students asking where software preparation starts for them.",
        "Two Year 1 sections stalled at the same roadmap block.",
      ],
    },
    next: {
      label: "Next period",
      items: [
        "Verbal sets added to the Year 3 practice rotation.",
        "A non-CS starting route added to Bearing.",
        "Block revised, with a shorter first playlist.",
      ],
    },
  },

  principle: {
    heading: "Cohorts, not league [tables].",
    sub: "Groups of students over time, to show a college where to help. Nothing ranks an individual.",
  },
} as const;
