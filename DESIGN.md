# Origan — Design

Written from the built result, not from the brief. Everything below is what
shipped; where the intention and the outcome differ, this records the outcome
and says why it moved.

The surface is **Persuade**: three pages whose job is to survive the search a
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

Thirteen tokens, defined in `src/app/globals.css` and nowhere else.
`pnpm check:components` fails the build if a hex literal appears in any other
file, including the generated social card, which reads the stylesheet at build
time rather than carrying a copy.

| Token | Value | What it is |
| --- | --- | --- |
| `ground` | `#0d1815` | The page |
| `ground-2` | `#101f1b` | A banded section |
| `panel` | `#13251f` | A bordered panel |
| `panel-2` | `#16302a` | The selected state inside one |
| `line` | `#22423a` | Rules, the heavier weight |
| `line-2` | `#1a332c` | Rules, the lighter weight |
| `fg` | `#eef3f0` | Body and headings |
| `fg-2` | `#9db3aa` | Secondary copy |
| `fg-3` | `#708f86` | Notation labels |
| `survey` | `#5fd9a8` | The one saturated colour |
| `survey-2` | `#3e7f6b` | Its dimmed partner, for linework |
| `survey-ink` | `#06251a` | Type on a survey fill |
| `warn` | `#e2b24a` | A genuinely different hue |

**Three surface steps, two rule weights, three text levels, one accent.** The
accent is used for the thing being measured and never for emphasis in general;
`warn` exists so that "where a two-week programme would begin" is a different
colour rather than a lighter shade of the same one, which would have read as a
variant of Origan rather than as the alternative to it.

Dark is not a category default here. The page carries a drawing, and drawings
on this subject are read as light lines on a dark field.

**Contrast.** `pnpm check:contrast` measures sixteen pairs against WCAG 2.1 AA
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

- Hero headline `clamp(40px, 7.6vw, 100px)`, at `max-w-[13ch]`
- Page headline `clamp(32px, 6vw, 68px)`
- Section heading `clamp(27px, 4.6vw, 50px)`, at `max-w-[17ch]`
- Body 17px, secondary 15.5px, notation 9.5–11px

The character-count limits do more work than the sizes. A headline capped at
13ch breaks where it should at every width without a single breakpoint.

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
sections are `py-[clamp(60px,8.5vw,120px)]`. Three routes read as one drawing
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

Below `md` the header cannot fit three page labels beside a wordmark and a call
to action, so it drops them and the floating bar at the foot carries the pages
instead. Above `md` the header has them and the bar carries the current page's
sections. This is not a nicety: with the pages hidden above and sections shown
below, a reader on a phone had no route to the other two pages at all.

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
the ground itself. The consultant is a levelling staff, because a staff is the
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

## Honesty constraints

The product does not exist publicly. The page therefore carries no pricing,
names no pilot college, cites no customers, and claims no results. Any
interface shown is labelled as an illustrative study, and `src/data/surface.ts`
holds those invented values and says so.

These are design constraints, not legal ones. A page with nothing to prove has
to be built well enough that the build is the proof, and every claim it does
make has to survive a dean checking it.
