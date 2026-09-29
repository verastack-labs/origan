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

**Secondary, the user.** Engineering students, from first year onward. They experience
Origan as structured preparation that must not feel like monitoring.

## Product Purpose

Origan is a preparation partnership sold to engineering colleges as an institutional
agreement. It pairs a student-facing platform with a consultant assigned to the college
for the length of the partnership.

Origan covers preparation across the whole of engineering. A student joins in first year
and the system travels with them for four. This is the defining fact about the product.

Success for the college is a measurable improvement in placement outcomes. Success for a
student is arriving at placement season already prepared rather than cramming.

## Positioning

Origan sits **alongside** campus recruitment training, not instead of it. Colleges keep
their aptitude trainers and company-specific programmes.

The claim a neighbouring product cannot truthfully copy: four years of continuous,
instrumented, college-specific preparation, shaped by a consultant who talks to that
college's students and feeds what they say back into the platform. Training vendors
deliver a fixed syllabus in a fixed window and leave. Self-serve platforms have no one
making sure the thing gets used.

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

1. **Four years, not four weeks.** Every claim reduces to time horizon. If a section does
   not benefit from the four-year frame, question whether it belongs.
2. **Helpful, never punitive.** Institutional visibility is part of the sale, but nothing
   may read as surveillance of students. Longitudinal growth, not readiness ranking.
3. **Alongside, not instead of.** Never positioned as replacing a college's existing
   training.
4. **Prove by craft, since there is nothing else to prove with.** With no customers or
   metrics, the page's own quality is the only evidence of competence available.
5. **The platform is the destination, the consultant is the medium.** Neither works alone
   and neither should dominate the other on this surface.

## Accessibility & Inclusion

Visitors span deans on institutional machines with unknown, possibly dated browsers, and
students on a wide range of device quality and network speed in India. No experimental
browser feature may be load-bearing. Visible keyboard focus throughout, since this is a
public surface.
