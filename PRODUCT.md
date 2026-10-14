# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) with static export, deployed to GitHub Pages via
`.github/workflows/nextjs.yml`. Chosen by the user to match `verastack-labs.github.io`
and `riganb.github.io`, which already use this setup including dynamic OG image routes,
sitemap, and robots. pnpm only. TypeScript. Tailwind.

## Users

Two audiences on one surface, **colleges leading**.

**Primary, the buyer.** Deans, principals, directors, and management trusts at Indian
engineering colleges, plus the Training and Placement Officer who champions internally.
They are evaluating whether to commit to a multi-year partnership. They care about
placement percentage, accreditation evidence, standing against peer colleges, and whether
the people behind this will still exist in two years. The TPO needs something forwardable
to their dean.

**Secondary, the user.** Engineering students, from first year onward. **A student is a
reader of the record, not only its subject.** They see what they have actually covered and
where they are thin, while there is still time to act on it. This is what keeps institutional
visibility from reading as monitoring: the person being measured sees the measurement first.

## Product Purpose

**Origan is the record of what a batch has actually covered, from first semester to the
final drive.** It is sold to engineering colleges as an institutional agreement, and it is
produced by two things working together: a student-facing platform used every week, and a
Campus Coach assigned to the college for the length of the partnership.

The platform and the Coach are how the record gets made. They are not the thing being sold,
in the way that instruments and a surveyor are not what a client buys from a survey.

**One record, two readers.** A student reads it about themselves: what is covered, what is
thin, with time left to act. The placement cell reads the same record as cohorts across
years, never as a score against a name. Neither reader is served by a version the other
cannot see.

A student joins in first year and the record travels with them for four. The four-year span
is what makes the record worth keeping; a record of a fortnight is a register.

Success for the college is being able to answer "what has this batch actually covered"
before the season starts, rather than discovering the answer during it.

## Positioning

Origan sits **alongside** campus recruitment training, not instead of it. Colleges keep
their aptitude trainers and company-specific programmes.

**Lead with the record, never with preparation.** "Preparation programme" is a crowded
category with incumbents who have employer networks we do not have, and opening with that
noun invites a comparison on placement outcomes that we would lose and would deserve to
lose. Decided 14 October 2026; the reasoning in full is in
`social-docs/outreach/origan-positioning.md`.

**Say what Origan does, never what it is not.** Listing what we are not plants a comparison
the reader was not making. Stating the problem is different and still allowed: "nobody owns
that record today" describes the gap, not a competitor.

The claim a neighbouring product cannot truthfully copy: a continuous, college-specific
record of four years, readable by the student it describes and by the cell that has to act
on it, shaped by a Campus Coach who talks to that college's students. Training vendors
deliver a fixed syllabus in a fixed window and leave, measuring nothing after. Self-serve
platforms record plenty and have no one making sure it gets used.

## Operating Context

- Indian engineering colleges, typically 600 to 3,000 students.
- Institutions procure formally: two-bid sealed tenders, committee approval, payment in
  arrears after review and reporting. Warm introductions do not bypass procurement.
- Campus placement season broadly runs July to December for final years.
- The TPO's existing tooling for campus drives is WhatsApp groups and Google Forms.
- The site is not a conversion funnel. In a relationship sale it must survive the
  "who are these people" search after a meeting, give the TPO something forwardable to
  their dean, and read as an organisation rather than a student project.

## Capabilities and Constraints

Confirmed platform capabilities: questionnaire-generated roadmaps; curated video learning
with progress tracked at video, playlist, block, and roadmap level; video notes; DSA
sheets with solved and revisit states; a test engine covering aptitude, technical topics,
and domains; an AI-backed forum; a resume tool; an Overleaf template gallery; a glossary;
a typing test; and Avsar, campus application infrastructure replacing WhatsApp and Google
Forms.

Constraints on this surface:

- No pricing, in either direction.
- No named pilot college.
- No VeraStack Labs client work cited as evidence.
- No exhaustive feature lists and no delivery detail that belongs in a contract
  conversation. Entice rather than specify.
- The product mockup shown must be partial: a corner of the dashboard, a glimpse of the
  sidebar tabs. Never a full screenshot, because no product exists to screenshot.

Undecided and not to be implied: pricing, contract minimums, pilot terms, and what
TPO-facing analytics contain.

## Brand Commitments

**Name:** Origan. Derived from the founder's name, Rigan, embedded whole, and sitting one
letter from "origin". The positioning seed is *where an engineering career starts*.

**Sub-product:** Avsar (अवसर, opportunity) student-facing; Origan Apply in institutional
conversations.

**The person on campus:** Campus Coach, in anything a dean reads; Coach, with
students. Never "consultant" on a public surface. Feature names, and the rule for
when one may carry "AI", live in `origan-internal/docs/naming.md`.

**Studio:** VeraStack Labs. Repo pattern is `origan` public landing, `origan-app` private,
`origan-internal` private.

**House conventions:** design tokens in a single layer with no hardcoded colours in
components, automated contrast and component hygiene checks, a dev-only `/design-system`
route, never committing directly to `main`.

**Explicit anti-commitment:** every VeraStack product has its own visual world. Riggit and
Mehfil share no colour, typeface, or register. Origan must not inherit either, and must
not reuse `riganb.github.io`'s Instrument Serif.

**Writing:** no em-dashes anywhere in copy.

## Evidence on Hand

**Nothing product-side exists.** No screenshots, no users, no testimonials, no metrics, no
completed pilot, no case study.

The craft of the page itself has to carry the persuasion, because there is no external
proof to lean on. Any product imagery must be authored and understood as synthetic, and
must not imply a working deployment or an existing customer.

## Product Principles

1. **The record, kept for four years.** Every claim reduces to the record and the span that
   makes it worth keeping. If a section does not make the record more credible or the span
   more necessary, question whether it belongs. The time horizon still governs: a record of
   a fortnight is a register.
2. **Two readers, which is why it is not surveillance.** The student reads the record about
   themselves before anyone reads it about them. Institutional visibility is part of the
   sale, and it is safe precisely because the subject is also an audience. Longitudinal
   growth, not readiness ranking, and never a score against a name.
3. **Alongside, not instead of.** Never positioned as replacing a college's existing
   training.
4. **Prove by craft, since there is nothing else to prove with.** With no customers or
   metrics, the page's own quality is the only evidence of competence available.
5. **The platform is the destination, the Campus Coach is the medium.** Neither works alone
   and neither should dominate the other on this surface.

## Accessibility & Inclusion

Visitors span deans on institutional machines with unknown, possibly dated browsers, and
students on a wide range of device quality and network speed in India. No experimental
browser feature may be load-bearing. Visible keyboard focus throughout, since this is a
public surface.
