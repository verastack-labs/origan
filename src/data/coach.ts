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
  body: "Every partnership comes with a Campus Coach, assigned to your college for as long as it runs. They talk with your students, shape what gets built for your campus, and tell your placement cell what they found. Your students will just call them Coach.",

  role: {
    heading: "Five things, every term.",
    body: "None of them is a visit. All of them repeat, because a cohort is a different set of students in second year than it was in first.",
    duties: [
      {
        glyph: "staff",
        label: "Talk with students",
        body: "Five to ten conversations on a campus day. What students are stuck on, in their own words, before it shows up in a test score.",
      },
      {
        glyph: "traverse",
        label: "Shape what gets built",
        body: "What they hear becomes the roadmap for your college: which content comes next, which topics need more practice, which features matter here.",
      },
      {
        glyph: "sheet",
        label: "Report to your college",
        body: "To your placement cell and to leadership, every two to four weeks. What was observed, what changed, and what happens next.",
      },
      {
        glyph: "spotHeights",
        label: "Make sure it gets used",
        body: "A platform nobody opens is a cost, not a programme. Adoption is their job, batch by batch, not a dashboard someone checks in March.",
      },
      {
        glyph: "instrument",
        label: "Sit with your placement cell",
        body: "On campus days, with the people who already know which drives are coming and which students worry them.",
      },
    ],
  },

  day: {
    heading: "What a campus day looks like.",
    body: "A surveyor books every reading in a field book on the day it is taken, so nothing depends on memory. A Campus Coach works the same way.",
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
    close: "By the end of the day, every observation has a destination. None of it is left in someone's head.",
  },

  modes: {
    heading: "On campus, or remote.",
    body: "The same Campus Coach and the same work either way. What changes is how often they are physically on your campus, and that cadence is agreed per contract rather than fixed by us.",
    link: { label: "How the two modes work", href: "/partnership/" },
  },

  continuity: {
    heading: "Built to outlast any one person.",
    body: "Everything a Campus Coach learns is booked to the record: your dashboard and the reports your college already holds. What is known about your campus belongs to the partnership, not to one person's memory, so a change of Coach is a handover rather than a restart.",
    not: [
      {
        label: "Not a trainer",
        body: "Your aptitude trainers and company programmes stay. A Campus Coach works alongside them, across all four years rather than the last few weeks.",
      },
      {
        label: "Not a monitor",
        body: "Students talk to them because it helps. Nothing about the role is watching students on the college's behalf.",
      },
      {
        label: "Not an onboarding visit",
        body: "They do not set things up and leave. They are assigned for the length of the partnership.",
      },
    ],
  },
} as const;
