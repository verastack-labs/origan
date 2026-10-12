import type { Metadata } from "next";
import { Action } from "@/components/action";
import { FieldBook } from "@/components/field-book";
import { PageHead, h2, section, shell } from "@/components/page-head";
import { Reveal } from "@/components/reveal";
import { Glyph, type GlyphName } from "@/components/survey-glyphs";
import { TalkSection } from "@/components/talk-section";
import { coachPage } from "@/data/coach";

export const metadata: Metadata = {
  title: "The Campus Coach",
  description: coachPage.body,
  alternates: { canonical: "/coach/" },
};

export default function Coach() {
  const { role, modes, continuity } = coachPage;

  return (
    <>
      <PageHead notation={coachPage.notation} headline={coachPage.headline} body={coachPage.body} />

      <section id="role" className={section}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            Duties of the station
          </Reveal>
          <Reveal as="h2" variant="plot" className={h2}>
            {role.heading}
          </Reveal>
          <Reveal as="p" className="mt-[18px] max-w-[54ch] text-fg-2">
            {role.body}
          </Reveal>

          {/* A ruled schedule rather than a grid of tiles: five duties read
              down a page the way a specification lists them. */}
          <ol className="mt-[clamp(24px,3.4vw,44px)] overflow-hidden rounded-panel border border-line">
            {role.duties.map((duty) => (
              <Reveal
                as="li"
                key={duty.label}
                className="grid grid-cols-[36px_minmax(0,1fr)] gap-x-4 gap-y-2 border-b border-line-2 bg-panel px-[clamp(16px,2.6vw,28px)] py-[clamp(18px,2.4vw,24px)] last:border-b-0 md:grid-cols-[36px_minmax(200px,0.6fr)_minmax(0,1.4fr)] md:gap-x-8"
              >
                <Glyph name={duty.glyph as GlyphName} />
                <h3 className="self-center text-[clamp(18px,2vw,21px)] font-semibold tracking-[-0.02em]">
                  {duty.label}
                </h3>
                <p className="col-start-2 text-[15.5px] text-fg-2 md:col-start-auto md:self-center">
                  {duty.body}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section id="day" className={`border-y border-line bg-ground-2 ${section}`}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            Booked on the day
          </Reveal>
          <Reveal as="h2" variant="plot" className={h2}>
            {coachPage.day.heading}
          </Reveal>
          <Reveal as="p" className="mt-[18px] max-w-[54ch] text-fg-2">
            {coachPage.day.body}
          </Reveal>
          <FieldBook />
        </div>
      </section>

      <section className={section}>
        <div
          className={`${shell} grid gap-[clamp(28px,5vw,72px)] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end`}
        >
          <div>
            <Reveal variant="label" className="notation">
              Modes of engagement
            </Reveal>
            <Reveal as="h2" variant="plot" className={h2}>
              {modes.heading}
            </Reveal>
          </div>
          <div>
            <Reveal as="p" className="max-w-[48ch] text-fg-2">
              {modes.body}
            </Reveal>
            <Reveal className="mt-6">
              <Action href={modes.link.href} tone="secondary">
                {modes.link.label}
              </Action>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="continuity" className={`border-t border-line ${section}`}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            Reference that holds
          </Reveal>
          <Reveal as="h2" variant="plot" className={h2}>
            {continuity.heading}
          </Reveal>
          <Reveal as="p" className="mt-[18px] max-w-[58ch] text-fg-2">
            {continuity.body}
          </Reveal>

          <div className="mt-[clamp(24px,3.4vw,44px)] grid gap-px overflow-hidden rounded-panel border border-line bg-line md:grid-cols-3">
            {continuity.not.map((item) => (
              <Reveal key={item.label} className="bg-panel p-[clamp(20px,2.6vw,30px)]">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.11em] text-warn">
                  {item.label}
                </h3>
                <p className="mt-3.5 text-[15.5px] text-fg-2">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <TalkSection sheet="The Campus Coach" />
    </>
  );
}
