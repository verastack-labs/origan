/**
 * The Campus Coach sheet.
 *
 * Deans read "Campus Coach"; students say "Coach". The role is described, not a
 * person: the first partnership is staffed differently from the rest, and a page
 * that named someone would be promising them.
 */

export const coachPage = {
  notation: "The Campus Coach",
  heading: "The one who [stays].",
  sub: "Students go to them in person or through Origan, and teachers and the TPO plan with them. Your students will just call them Coach.",
  description:
    "A Campus Coach is assigned to your college for as long as the partnership runs. Students go to them in person or post questions through Origan. They plan with your teachers and Training and Placement Officer (TPO), and report to your placement cell. Your students will just call them Coach.",

  role: {
    heading: "Five things, every [term].",
    sub: "None of them is a visit. All of them repeat, because a cohort changes every year.",
    duties: [
      {
        glyph: "staff",
        label: "Be there for students",
        body: "In person on campus, or through the questions students post on Origan. Five to ten conversations a campus day: what they are stuck on, in their own words, before a test score shows it.",
      },
      {
        glyph: "traverse",
        label: "Notice who stalls",
        body: "Origan records what each student has covered and solved, so the Coach sees who has stopped solving and steps in. What they hear also decides which material and practice comes next for your college.",
      },
      {
        glyph: "sheet",
        label: "Report to your college",
        body: "Summaries and reports every two to four weeks, to your cell and to leadership. What was observed, what changed, what happens next.",
      },
      {
        glyph: "spotHeights",
        label: "Make sure it gets used",
        body: "A platform nobody opens is a cost. Adoption is their job, batch by batch.",
      },
      {
        glyph: "instrument",
        label: "Plan with teachers and the TPO",
        body: "The Training and Placement Officer (TPO) and your teachers know which drives are coming and which students worry them. The Coach works through each issue with them, and plans what the next batch needs.",
      },
    ],
  },

  day: {
    kicker: "A surveyor books every reading on the day it's taken.",
    heading: "So does a Campus [Coach].",
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
        booked: "Block",
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
    heading: "On campus, or [remote].",
    sub: "Same Coach, same work. Only how often they're on campus changes.",
    link: { label: "How the two modes work", href: "/partnership/" },
  },

  continuity: {
    heading: "Built to outlast one [person].",
    sub: "Everything a Coach learns is booked to Datum. A change of Coach is a handover, not a restart.",
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
