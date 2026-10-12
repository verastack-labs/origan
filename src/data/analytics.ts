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
  headline: {
    before: "What your placement cell ",
    accent: "sees",
    after: ", every few weeks.",
  },
  body: "Datum is your college's view of the record the platform keeps: cohort by cohort, branch by branch, semester by semester. Its first draft is shaped with your placement cell within month one, and it grows from there.",
  disclaimer: "Illustrative data",
  direction:
    "Datum is drafted with each college, so these views show the direction rather than a fixed product. Every number on this page is invented.",

  trajectory: {
    heading: "Readiness across eight semesters, not eight weeks.",
    body: "Median Bench Mark score for one cohort, followed from first semester to last. The point is the shape: a line that starts early has room to rise.",
    caption: "Median test score by semester",
    unit: "%",
    series: [
      { key: "cse", label: "Computer Science", tone: "survey", values: [38, 45, 52, 58, 63, 68, 72, 75] },
      { key: "mech", label: "Mechanical", tone: "fg-3", values: [24, 30, 38, 46, 53, 60, 65, 69] },
    ],
    // Where campus recruitment training usually starts. The same mark the
    // longitudinal section on the overview uses.
    marker: { semester: 7, label: "Where a two-week programme would begin" },
  },

  branches: {
    heading: "Every branch, because recruiters hire from every branch.",
    body: "Share of each branch practising in the last four weeks. A gap like this is a conversation for your Campus Coach, not a verdict on a department.",
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
    heading: "Where a cohort is stuck, before a company finds out.",
    body: "Accuracy by topic and year of study. Weak cells are where the next term's content and practice go.",
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
    heading: "And a report a dean can read in five minutes.",
    body: "Every two to four weeks your placement cell and college leadership get the readings, what your Campus Coach observed on campus, and what happens next.",
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
    heading: "Cohorts, not league tables.",
    body: "Datum is built around groups of students over time. It is there to show a college where to help, and nothing in it is designed as a ranking of individual students.",
  },
} as const;
