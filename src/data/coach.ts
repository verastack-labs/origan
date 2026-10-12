/**
 * The Campus Coach sheet.
 *
 * Deans read "Campus Coach"; students say "Coach". The role is described, not a
 * person: the first partnership is staffed differently from the rest, and a page
 * that named someone would be promising them.
 */

export const coachPage = {
  notation: "The Campus Coach",
  headline: {
    before: "The person who ",
    accent: "stays",
    after: " for the whole term.",
  },
  body: "A Campus Coach is assigned to your college for as long as the partnership runs. They talk with your students, shape what gets built, and report to your placement cell. Your students will just call them Coach.",

  role: {
    heading: "Five things, every term.",
    body: "None of them is a visit. All of them repeat, because a cohort changes every year.",
    duties: [
      {
        glyph: "staff",
        label: "Talk with students",
        body: "Five to ten a campus day. What students are stuck on, in their own words, before a test score shows it.",
      },
      {
        glyph: "traverse",
        label: "Shape what gets built",
        body: "What they hear decides what comes next for your college: content, practice, features.",
      },
      {
        glyph: "sheet",
        label: "Report to your college",
        body: "Every two to four weeks, to your cell and to leadership. What was observed, what changed, what happens next.",
      },
      {
        glyph: "spotHeights",
        label: "Make sure it gets used",
        body: "A platform nobody opens is a cost. Adoption is their job, batch by batch.",
      },
      {
        glyph: "instrument",
        label: "Sit with your placement cell",
        body: "With the people who know which drives are coming and which students worry them.",
      },
    ],
  },

  day: {
    heading: "What a campus day looks like.",
    body: "A surveyor books every reading on the day it is taken. A Campus Coach works the same way.",
    caption: "Field book",
    disclaimer: "Illustrative entries, not a real campus",
    columns: ["Time", "Station", "Observation", "Booked to"],
    entries: [
      {
        time: "09:30",
        station: "Placement cell",
        observation: "Agree the day's batches with the TPO, and which drive is closest.",
        booked: "Plan",
      },
      {
        time: "10:15",
        station: "Year 3 · ECE",
        observation: "Four students unsure whether aptitude or data structures should come first.",
        booked: "Roadmap",
      },
      {
        time: "11:00",
        station: "Year 2 · Mechanical",
        observation: "Want software roles. Nobody has told them where a non-CS student starts.",
        booked: "Roadmap",
      },
      {
        time: "12:30",
        station: "Year 1 · CSE",
        observation: "Two students stalled at the same roadmap block within a week of each other.",
        booked: "Content",
      },
      {
        time: "14:00",
        station: "Year 3 · ISE",
        observation: "Verbal practice trails quantitative practice across the whole batch.",
        booked: "Report",
      },
      {
        time: "15:30",
        station: "Placement cell",
        observation: "Next drive: who is eligible, and who is eligible but not yet ready.",
        booked: "Avsar",
      },
    ],
    close: "By the end of the day, every observation has a destination.",
  },

  modes: {
    heading: "On campus, or remote.",
    body: "Same Coach, same work. What changes is how often they are physically on campus.",
    link: { label: "How the two modes work", href: "/partnership/" },
  },

  continuity: {
    heading: "Built to outlast any one person.",
    body: "Everything a Coach learns is booked to Datum and to the reports your college already holds. A change of Coach is a handover, not a restart.",
    not: [
      {
        label: "Not a trainer",
        body: "Your trainers stay. A Coach works alongside them, across four years rather than the last few weeks.",
      },
      {
        label: "Not a monitor",
        body: "Students talk to them because it helps. Nothing in the role watches students on the college's behalf.",
      },
      {
        label: "Not an onboarding visit",
        body: "They do not set up and leave. They are assigned for the length of the partnership.",
      },
    ],
  },
} as const;
