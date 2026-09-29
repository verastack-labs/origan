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

`DESIGN.md` is written from the built result once the work is finished, not
before, so it describes what shipped rather than what was intended.

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
│   ├── llms.txt/  a plain-text brief for answer engines
│   └── og.png/    social card, generated at build from the token layer
├── components/    one file per section, plus the survey glyph set
├── data/          every word and every illustrative value on the page
└── lib/           pure geometry: contours, the traverse, the profile, chainage
```

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
