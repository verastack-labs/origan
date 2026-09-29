import { notFound } from "next/navigation";
import { palette } from "@/lib/tokens";
import { surfaceGlyphs, NorthArrow, ScaleBar } from "@/components/survey-glyphs";
import { BenchmarkMark } from "@/components/benchmark-mark";

/**
 * A development-only view of the token layer and the glyph set.
 *
 * It 404s in production. This is a single public marketing page, and shipping a
 * route that documents the palette to anyone who guesses the URL is clutter at
 * best. In development it is the fastest way to see whether a token change has
 * broken a pairing.
 */
export const dynamic = "force-static";

const swatchGroups = [
  { title: "Surfaces", names: ["ground", "ground-2", "panel", "panel-2"] },
  { title: "Rules", names: ["line", "line-2"] },
  { title: "Text", names: ["fg", "fg-2", "fg-3"] },
  { title: "Accent", names: ["survey", "survey-2", "survey-ink"] },
  { title: "Signal", names: ["warn"] },
];

export default function DesignSystem() {
  if (process.env.NODE_ENV === "production") notFound();

  const p = palette();

  return (
    <main className="mx-auto max-w-[1100px] px-8 py-16">
      <h1 className="text-4xl font-bold tracking-[-0.03em]">Design system</h1>
      <p className="mt-3 max-w-[60ch] text-fg-2">
        Read from <code className="font-mono text-survey">globals.css</code> at build time.
        Development only. Run <code className="font-mono text-survey">pnpm check:contrast</code> for
        the measured pairings.
      </p>

      {swatchGroups.map((group) => (
        <section key={group.title} className="mt-12">
          <h2 className="notation">{group.title}</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {group.names.map((name) => (
              <div key={name} className="overflow-hidden rounded-panel border border-line">
                <div className="h-20" style={{ background: p[name] }} />
                <div className="border-t border-line bg-panel px-3 py-2.5">
                  <div className="font-mono text-[11px] text-fg">{name}</div>
                  <div className="font-mono text-[10px] uppercase text-fg-3">{p[name]}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="mt-12">
        <h2 className="notation">Survey glyphs</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {Object.entries(surfaceGlyphs).map(([name, Glyph]) => (
            <div
              key={name}
              className="flex min-w-[120px] flex-col items-center gap-2.5 rounded-panel border border-line bg-panel px-4 py-5 text-survey"
            >
              <Glyph size={22} />
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-fg-3">
                {name}
              </span>
            </div>
          ))}
          <div className="flex min-w-[120px] flex-col items-center gap-2.5 rounded-panel border border-line bg-panel px-4 py-5 text-survey">
            <BenchmarkMark size={22} />
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-fg-3">
              benchmark
            </span>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="notation">Drawing furniture</h2>
        <div className="mt-4 flex flex-wrap items-end gap-8 rounded-panel border border-line bg-panel px-6 py-6 text-survey-2">
          <NorthArrow size={44} />
          <ScaleBar />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="notation">Type scale</h2>
        <div className="mt-4 space-y-4">
          <p className="text-[clamp(38px,7.6vw,96px)] font-extrabold leading-[0.95] tracking-[-0.043em]">
            Display
          </p>
          <p className="text-[clamp(27px,4.6vw,50px)] font-bold leading-[1.05] tracking-[-0.035em]">
            Section heading
          </p>
          <p className="text-[17px] text-fg-2">Body copy at seventeen pixels.</p>
          <p className="notation">Notation label</p>
        </div>
      </section>
    </main>
  );
}
