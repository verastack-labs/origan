# Origan — Landing page

The public landing page for Origan, a software placement preparation partnership
for engineering colleges. Built as a static export for GitHub Pages.

Planning docs, the partnership plan and product decisions live in
[`verastack-labs/origan-internal`](https://github.com/verastack-labs/origan-internal).
The application source will live in `origan-app`.

## Requirements

- Node 22+ and pnpm 11+
- pnpm only. Do not use npm or yarn.

## Getting started

```bash
pnpm install
pnpm dev
```

Runs at `http://localhost:3000`. Local development serves from `/`; the deployed
site serves from `/origan`, which `NEXT_PUBLIC_BASE_PATH` handles in CI.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server with hot reload |
| `pnpm build` | Static export into `.next-build` |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint over the project |
| `pnpm test` | Vitest, unit tests for the drawing maths and the checks |
| `pnpm check:contrast` | Every colour pair the design uses, against WCAG AA |
| `pnpm check:components` | No hardcoded colours or refused structures outside the token layer |
| `pnpm check` | All five of the above, which is what CI runs |

## Design system

**`src/app/globals.css` is the only place a colour is defined.** Components
reference tokens through Tailwind utilities or `var(--…)`. `pnpm check:components`
fails if a hex literal appears anywhere else, including in the generated social
card, which reads the token layer at build time rather than carrying its own copy.

[`DESIGN.md`](DESIGN.md) describes what shipped: the tokens, the type split,
the motion set, why the hero is what it is after two versions that failed, and
what the design refuses. It is written from the built result, not from the
brief, so it is worth re-reading before changing anything visual.

There is no `/design-system` route. Under `output: export` a page cannot be
excluded from production cleanly: `notFound()` still writes an HTML file, which
Pages serves with a 200 as a soft 404, and an empty `generateStaticParams` fails
the build. `pnpm check:contrast` prints every measured pairing, which was the
useful part of that page.

## Layout

```
scripts/           check:contrast and check:components, with their own tests
src/
├── app/           routes. globals.css is the token layer
│   ├── partnership/  how the partnership is structured
│   ├── product/      what the platform is
│   ├── llms.txt/  a plain-text brief for answer engines
│   └── og.png/    social card, generated at build from the token layer
├── components/    one file per section, plus the survey glyph set
├── data/          every word and every illustrative value on the page
└── lib/           pure geometry: the hero figure, the profile, chainage
```

Three pages, one drawing set. `src/data/site.ts` holds the sheet list and the
per-sheet section anchors. The header renders the sheets and the floating bar
at the foot renders the current sheet's sections, except below `md`, where the
header has no room for three page labels and the bar carries the sheets
instead. `src/data/site.test.ts` fails if a sheet is added to one list and
forgotten in the other.

## The hero

`src/lib/figure.ts` is a triangulation figure: four stations, the legs between
them, two sights closing the figure, three range arcs and one measured datum.
About a dozen marks, placed in the right of the frame so the headline has the
left to itself.

Two earlier versions, a contour field and then a surface mesh, both failed the
same way: dozens of long lines across the whole frame, which is texture, and
texture behind a headline is wallpaper however finely it is ruled. The tests in
`figure.test.ts` hold the replacement to what made it work, including a cap on
the number of marks and a check that the stations are never collinear, which is
what makes the closing sights draw triangles rather than retrace the legs.

## Icons

Icons are drawn in `src/components/survey-glyphs.tsx` from survey and levelling
notation: a traverse, a levelling staff, a bench mark, a peg, a reciprocal
observation. A general-purpose icon set would put a generic book and a generic
user next to copy that spent its whole length establishing a different world,
which is the one thing this design refuses. `lucide-react` is installed for
ordinary interface furniture where a generic mark is the correct one.

## The enquiry form

Posts to Web3Forms, because a static export has no server. The access key and
the hCaptcha site key in `src/data/site.ts` are both public by design and are
committed deliberately, not leaked: the key names a destination inbox and the
site key's secret half never leaves Web3Forms. Domain restriction is a paid
feature there, so what actually guards the inbox is the hCaptcha token, which
they verify server side, plus a 250-a-month cap.

hCaptcha must also be selected as the captcha in the Web3Forms dashboard. The
markup alone does nothing; the endpoint ignores the token unless the form is
configured to require one.

## Deployment

Pushing to `main` builds and publishes through `.github/workflows/pages.yml`.
CI runs typecheck, lint, tests and both checks before anything is published,
because this is the only workflow whose output the public sees.

## Search Console

The property `https://verastack-labs.github.io/origan/` is verified, automatically,
by inheriting the already-verified parent property for the host. No verification
tag was needed. The `GOOGLE_SITE_VERIFICATION` repository variable is still wired
up and stays unset: it would be needed if this ever moves to its own domain,
where there is no verified parent to inherit from.

**`robots.txt` here is decorative.** Crawlers only read it from the host root,
`https://verastack-labs.github.io/robots.txt`, which is served by the org site
repo. Origan's sitemap has to be listed there to be discovered that way; it is
submitted directly in Search Console regardless.

## Conventions

Work happens on branches and lands through pull requests. `main` is never
committed to directly.

## Honesty constraints

The product does not exist publicly yet. This page therefore carries no pricing,
names no pilot college, cites no customers and claims no results. Any interface
shown is labelled as an illustrative study. `src/data/surface.ts` holds those
invented values and says so. Do not remove those labels or add claims that are
not yet true.
