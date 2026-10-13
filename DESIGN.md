# Origan — Design

Written from the built result, not from the brief. Everything below is what
shipped; where the intention and the outcome differ, this records the outcome
and says why it moved.

The surface is **Persuade**: six pages whose job is to survive the search a
dean runs after a meeting, give a TPO something forwardable, and read as an
organisation rather than a student project. There is no product to demonstrate
and no proof to cite, so the craft of the page is the only evidence of
competence available. That constraint shapes every decision here.

---

## The world

**Survey and levelling notation.** Not a metaphor applied to a layout: the page
uses the drawing conventions of the discipline as its working language. A
triangulation figure in the first viewport. A longitudinal section for the four
years. Chainage as the scroll readout. A title block closing every page, as a
drawing sheet closes. Station marks, bench marks, bearings, a measured datum.

This was chosen over six alternatives because it is the one world where
"preparation is a distance we mark the whole way" is a literal description
rather than a simile, and because it is not a world anything in edtech
currently occupies.

The rule that keeps it honest: **every mark is a real thing a surveyor draws.**
A glyph set invented to look technical would have been decoration. A bench mark
is a bench mark.

---

## Colour

Thirteen tokens, in two palettes, defined in `src/app/globals.css` and nowhere
else.
`pnpm check:components` fails the build if a hex literal appears in any other
file, including the generated social card, which reads the stylesheet at build
time rather than carrying a copy.

| Token | Dark (default) | Light | What it is |
| --- | --- | --- | --- |
| `ground` | `#050807` | `#f7f9f8` | The page |
| `ground-2` | `#080d0b` | `#eef2f0` | A banded section |
| `panel` | `#0a100d` | `#ffffff` | A bordered panel |
| `panel-2` | `#0f1714` | `#e9eeec` | The selected state inside one |
| `line` | `#1f2a25` | `#c9d3cf` | Rules, the heavier weight |
| `line-2` | `#151d19` | `#e0e7e4` | Rules, the lighter weight |
| `fg` | `#edf2ef` | `#0a110e` | Body and headings |
| `fg-2` | `#9aa9a2` | `#45534d` | Secondary copy |
| `fg-3` | `#74847d` | `#5b6a64` | Notation labels |
| `survey` | `#4cc596` | `#0b6b48` | The one saturated colour |
| `survey-2` | `#3a7d65` | `#3c7962` | Its dimmed partner, for linework |
| `survey-ink` | `#03140d` | `#f4fbf7` | Type on a survey fill |
| `warn` | `#e2b24a` | `#8a5a00` | A genuinely different hue |

**Three surface steps, two rule weights, three text levels, one accent.** The
accent is used for the thing being measured and never for emphasis in general;
`warn` exists so that "where a two-week programme would begin" is a different
colour rather than a lighter shade of the same one, which would have read as a
variant of Origan rather than as the alternative to it.

**Ink: dark is the default; light is a choice.** Decided 13 October 2026. The
site first shipped on ink-green surfaces under a mint accent, which read as
too green; a pale survey-green light default followed, and still read as a
lot of one hue. The ink palette takes the green out of the field: near-black
surfaces with only an undertone of green, near-white type, and the accent
muted to an emerald (`#4cc596`) so it is the only colour on the page and reads
as a measurement rather than as a brand wash. Every first visit sees it,
whatever the operating system prefers. Light is the same drawing on
near-white paper, with the accent deepened to `#0b6b48` to hold 4.5:1 as text.
A switch in the header applies light, stores it, and restores it before first
paint on the next visit.

Both palettes share every token name, so no component knows which ground it is
on. The dark values live in `@theme`, so a visitor without JavaScript still
gets the default; light is an unlayered `:root[data-theme="light"]` block over
them. The decks and the explainer film use the dark column.

**Contrast.** `pnpm check:contrast` measures sixteen pairs, in both palettes, against WCAG 2.1 AA
and prints every one. `fg-3` began at `#6b8880` and measured 4.16:1 on a panel,
which failed; it was lightened until it passed at 4.54:1. The tightest pair
still in use is that one. Nothing ships below threshold.

---

## Type

**Archivo** for display, **Azeret Mono** for every piece of notation. Both
self-hosted by `next/font` at build, so the static export has no runtime
dependency on Google.

The split is strict and carries meaning rather than variety: the monospace is
never decorative, it marks something as an instrument reading. Section labels,
chainage, data columns, station numerals, field names, button labels. If it is
monospaced, it is notation.

Display sizes are fluid and set with `clamp()` so they resolve against the
viewport rather than at breakpoints:

- Hero heading `clamp(40px, 7vw, 92px)`
- Page heading `clamp(32px, 5.4vw, 64px)`
- Section heading `clamp(27px, 4.2vw, 48px)`
- Subheading or kicker `clamp(16.5px, 1.6vw, 19px)` to `clamp(17px, 1.9vw, 21px)`
- Body 17px, secondary 15.5px, notation 9.5–11px

**Headings come in pairs.** Decided 13 October 2026. Every heading is one short
line, and it never stands alone. It is paired in one of two shapes:

- **Heading first:** the heading hits, then a subheading lands the impact.
- **Kicker first:** a setup line, then the heading lands the point.

The data carries the shape (`sub` or `kicker`), and `HeadingPair` renders it.
One word per heading can take the accent, marked with square brackets in the
data. Headings are held to 34 characters by `copy.test.ts`, so they sit on one
line on a laptop; on a phone a heading may break once. The hero is the one
heading broken on purpose, at a newline in the data ("Four years, / not four
weeks."), because the figure owns the right of the frame. Every pair on the
site is listed in `origan-internal/docs/copy-deck.md`.

Contractions ("don't", "we'll") are allowed in subheadings and kickers, where
they read warmer. Headings and body copy keep the full forms.

---

## Shape and space

`--radius-control: 2px`, `--radius-panel: 3px`. Survey drawing has no soft
corners, and the radii are small enough to read as a drawn corner rather than
as a rounded one.

**Bordered panels, never cards.** No elevation, no drop shadows, no glass. The
check script refuses zero-blur offset shadows outright, because that is a
neobrutalist costume and this world is flat. Depth comes from the three surface
steps and the two rule weights, which is how a drawing conveys it.

Panel grids are built as `gap-px` over a `bg-line` parent, so the dividing
lines between cells are real rules of exactly one pixel rather than borders
that double up where cells meet.

Every page is ruled to `max-w-[1240px]` with `px-[clamp(18px,4vw,60px)]`, and
sections are `py-[clamp(60px,8.5vw,120px)]`. Six routes read as one drawing
set because they share these measurements, not because they share a template.

---

## Motion

One curve, `--ease-survey: cubic-bezier(0.16, 0.84, 0.34, 1)`, on everything.

| Name | What it does |
| --- | --- |
| `rv` | Fade and lift, 16px, staggered 70ms against siblings |
| `rv-plot` | A pen crosses the line and the words resolve behind it |
| `rv-label` | Notation prints character by character, like a readout |
| `station` | A station mark appears as the line reaches it |
| `set-out` | A check or a piece of furniture, drawn after the route exists |
| `range` | Range arcs drifting in weight, 11–19s, never in step |
| `sheet-change` | A short lift when a route changes |
| `swap` | A pane or tab swapping its contents |

Two details that are load-bearing rather than cosmetic:

**Hidden states ship in the markup and are gated on `html.js`,** which an
inline script sets before first paint. Adding the hiding class from an effect
instead made every heading paint, vanish, and then animate in, which reads as a
bug rather than as an entrance. Without JavaScript nothing hides at all.

**`prefers-reduced-motion` switches all of it off,** and every affected element
falls back to its resting state rather than to nothing. The longitudinal
section does not autoplay under it and stays fully operable by hand.

---

## The first viewport

A **triangulation figure**: four stations, the legs between them, two sights
closing the figure, three range arcs struck about the destination, one measured
datum, and an open circle marking where the line begins. About a dozen marks.

This is the third version. The first was a contour field, the second a surface
mesh, and both failed the same way: dozens of long lines across the whole
frame, which is texture, and texture behind a headline is wallpaper however
finely it is ruled. Masking it only produced linework behind frosted glass.

What fixed it was not a better texture but a smaller count. The figure is
composed into the right of the field so the headline has the left by
placement rather than by veiling, and `figure.test.ts` holds it there:

- Every station inside `x 820–1380`, `y 270–680`
- Total marks capped at twelve
- Stations never collinear, and the two intermediate ones on opposite sides
  of the line from first to last

That last one was a real bug. With four stations on one slope, every closing
sight lay exactly along a leg already drawn and closed no triangle at all,
while every bearing arc swept the reflex angle and drew a ring around its
station instead of the angle between two legs.

The slice is anchored `xMaxYMid`, not centred. A narrow viewport crops the
sides, and centred it showed the first station and nothing else while the route
ran off into a frame that held none of it.

---

## Mobile

Six sheets do not fit in a header beside a wordmark and a call to action until
`lg`, so below it the header drops them and the floating bar at the foot
carries them instead. Above `lg` the header has five of them (the wordmark is
the overview) and the bar carries the current page's sections.

Below `lg` the bar is a **drawing register**: one control naming the sheet in
hand and "Sheet n of 6", which opens the full list of sheets above it. Three
sheets once fitted across a phone as a row; six do not, and a row that wraps
or scrolls sideways hides exactly the pages it exists to show. The register is
keyed on the route, so arriving on a new sheet starts it closed.

A phone also has no "beside the headline" to put a drawing in, because the
column is the whole width. The figure keeps the top of the viewport and
dissolves into the ground before the words start, rather than shrinking into
decoration.

---

## Interaction

Four places the page can be operated, which is most of how it carries a dozen
features without listing a dozen features:

- **The longitudinal section.** Eight semester hit zones. It also walks itself
  while on screen, pausing on hover or focus and stopping for good once a
  semester is chosen. `aria-live` stays off until the reader takes control, so
  the walk never narrates a fresh paragraph every few seconds.
- **The strands.** Four tabs, three quarters of the copy folded away.
- **The surface study.** Six working tabs over an invented interface, labelled
  as illustrative.
- **The enquiry form.** Six fields, two of them optional, an hCaptcha, and no
  mailing list.

Focus is always visible: `:focus-visible` draws a 2px survey outline with 3px
offset, globally, because this surface is public.

---

## Icons

Drawn in `src/components/survey-glyphs.tsx` from survey notation: a traverse, a
levelling staff, a plotted sheet, spot heights, a triangulation station, a
contour stack, an instrument on a tripod, a bench mark, a field book, a legend,
a sheet grid, a bearing, a peg, a reciprocal observation, a chain. One stroke
weight, 16px frame, no fills except where a mark is solid by convention.

A general-purpose set would have put a generic book and a generic user beside
copy that spent its whole length establishing a different world. `lucide-react`
is installed for ordinary interface furniture where a generic mark is correct.

The mapping is chosen, not arbitrary. The platform is contours, because it is
the ground itself. The Campus Coach is a levelling staff, because a staff is the
medium a reading is taken through. The forum is a reciprocal observation, which
is two instruments sighting each other so the error in one cancels the other.

---

## What this design refuses

Recorded so the refusals survive the next change:

- No gradient headline text. Emphasis is weight, size, or the accent.
- No cards, no elevation, no glass.
- No hex literal outside `globals.css`.
- No stock photography, no illustrated students, no feature-card grid.
- No hero that is a screenshot of a product that does not exist.
- No colour added without a contrast pair added to the check.

---

## The three later sheets

**Features** is a map legend, not a card grid: a mark, a name, what it is, and
what it records. Six rows are spelled out and three more continue under a mask
that fades them into the ground, with "And more" set over the fade. The faded
rows are real features in real text, so the brief's "entice rather than
specify" costs a screen reader nothing. A feature carries "AI" as a small
bordered tag only where AI does real work inside it; the heading's accessible
name is the full name, so the tag is not read as "ElevationAI".

**Analytics** draws Datum's views in the site's own notation: a longitudinal
section for one cohort across eight semesters, a cross section by branch, spot
heights by topic and year, and the corner of a report fading off its frame.
Every chart says "Illustrative data" on its face, and the page says it once
more before the first chart. Axis text and station marks are HTML positioned
over the plot by percentage rather than text inside the SVG, because a viewBox
scaled to a phone shrinks its type with it. The line draws with the same pen
motion a headline makes, as a `clip-path` crossing the plot. Every view is
cohort-level; none ranks an individual student.

**Campus Coach** describes the role, not a person. Its signature is a page from
a surveyor's field book: time, station, observation, and where the reading was
booked. The entries are invented and labelled so. Wide, it is a ruled table;
narrow, each entry stacks.

---

## The twelfth-of-October pass

A design-director review and a mechanical evidence pass ran on the live six
sheets, independently, and this is what they changed:

**A footer, mounted once in the layout.** Three columns a dean actually uses:
the ask in one line, the set (all six sheets, numbered, the current one marked)
and the studio (a name, the studio, an area, nothing more specific). Then the
title block, which now carries "Checked" with the founder's name where a
drawing carries a checker's initials. The sheet's name comes from the route,
so no page passes it down and none can forget to.

**The title block no longer says "Preliminary · Not for construction".** A dean
reads a drawing's revision line literally, and the one document they are being
asked to take to a trust was telling them it was a draft not to be acted on. It
now reads "Issued for discussion · 2026". Every other field in the block is true
and stays.

**Headlines a dean reads are plain English; survey vocabulary lives in the
notation.** "Campus training arrives at the wrong chainage" became "arrives too
late". The small mono labels keep their survey names because they are
decoration, and decoration is allowed to be in-world. Datum is glossed on first
use on each sheet.

**One verb for the ask.** The header, every page head and the foot of every
sheet say "Register your interest", which raises a three-field dialog (email,
college, city). The full six-field form stays at the foot for a conversation,
and its button is now "Request a conversation" rather than "Send it". The
button is never shown disabled before the reader has done anything: pressing it
with no human check mounted mounts the check.

**The overview does one page's work.** The interface study and the alongside
table each now live on one sheet (the platform and the partnership). The
overview dropped from about 6,900px to about 5,300px.

**Nothing counts up.** The four readings on the overview arrive with the same
fade as everything else. "1 college" counting from "0 college" was a lie for a
few hundred milliseconds.

**The phone register lists the page's sections** beneath the sheet list, so a
reader at 390px has the same wayfinding as one at 1440.

**Light rules darkened a step** so a ruled panel grid reads as ruled rather
than as faint grey boxes. (Superseded by the ink palette's own rule values.)

**Copy is shorter everywhere.** Openers and closers keep their length; every
other headline is a clause, every body a sentence or two. Hints sit under form
labels rather than vanishing as placeholders.

Left as is, deliberately: the floating section index overlaps content as any
fixed bar does, and the reader asked for it at the foot; the Wipro citation
stays on the platform sheet because it is the one checkable fact that makes
cross-branch pricing honest; and nobody is named on the site beyond the form's
"reaches Rigan directly", which is a decision for the founder, not the design.

---

## Honesty constraints

The product does not exist publicly. The page therefore carries no pricing,
names no pilot college, cites no customers, and claims no results. Any
interface shown is labelled as an illustrative study, and `src/data/surface.ts`
holds those invented values and says so.

These are design constraints, not legal ones. A page with nothing to prove has
to be built well enough that the build is the proof, and every claim it does
make has to survive a dean checking it.
