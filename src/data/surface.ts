/**
 * The interface study: an illustrative view of what a student opens.
 *
 * Every value here is invented for illustration and the surface labels itself
 * as such on the page. No deployment exists, so nothing in this file may be
 * presented as a measurement.
 */

export type Row =
  | { label: string; kind: "bar"; percent: number }
  | { label: string; kind: "pill"; text: string; tone: "ok" | "warn" | "mute" };

export type View = {
  id: string;
  nav: string;
  heading: string;
  sub: string;
  rows: Row[];
};

export const views: View[] = [
  {
    id: "roadmap",
    nav: "Roadmap",
    heading: "Backend Engineering",
    sub: "Python · Django · Semester 4",
    rows: [
      { label: "Language fundamentals", kind: "bar", percent: 100 },
      { label: "Data structures", kind: "bar", percent: 74 },
      { label: "Web framework", kind: "bar", percent: 31 },
      { label: "Databases", kind: "bar", percent: 0 },
      { label: "Deployment", kind: "bar", percent: 0 },
    ],
  },
  {
    id: "playlists",
    nav: "Playlists",
    heading: "Active playlists",
    sub: "Six across two roadmaps",
    rows: [
      { label: "Django in depth", kind: "bar", percent: 62 },
      { label: "SQL and Postgres", kind: "bar", percent: 88 },
      { label: "Git, properly", kind: "bar", percent: 100 },
      { label: "Systems basics", kind: "bar", percent: 12 },
    ],
  },
  {
    id: "sheets",
    nav: "Sheets",
    heading: "Arrays and hashing",
    sub: "Curated sheet · 48 questions",
    rows: [
      { label: "Two sum variants", kind: "pill", text: "Solved", tone: "ok" },
      { label: "Sliding window", kind: "pill", text: "Revisit", tone: "warn" },
      { label: "Prefix sums", kind: "pill", text: "Solved", tone: "ok" },
      { label: "Monotonic stack", kind: "pill", text: "Unsolved", tone: "mute" },
    ],
  },
  {
    id: "tests",
    nav: "Tests",
    heading: "Recent attempts",
    sub: "2 per day · 7 per week",
    rows: [
      { label: "Quantitative aptitude", kind: "pill", text: "78%", tone: "ok" },
      { label: "Logical reasoning", kind: "pill", text: "84%", tone: "ok" },
      { label: "Verbal ability", kind: "pill", text: "61%", tone: "warn" },
      { label: "Data structures", kind: "pill", text: "72%", tone: "ok" },
    ],
  },
  {
    id: "avsar",
    nav: "Avsar",
    heading: "Open on campus",
    sub: "Four you are eligible for",
    rows: [
      { label: "Drive closing today", kind: "pill", text: "1 left", tone: "warn" },
      { label: "Internship, backend", kind: "pill", text: "Eligible", tone: "ok" },
      { label: "Analyst role", kind: "pill", text: "Eligible", tone: "ok" },
      { label: "Resume versions on file", kind: "pill", text: "3", tone: "mute" },
    ],
  },
  {
    id: "progress",
    nav: "Progress",
    heading: "Across four years",
    sub: "Trajectory, not a ranking",
    rows: [
      { label: "Semester 1", kind: "bar", percent: 100 },
      { label: "Semester 2", kind: "bar", percent: 96 },
      { label: "Semester 3", kind: "bar", percent: 91 },
      { label: "Semester 4", kind: "bar", percent: 58 },
    ],
  },
];
