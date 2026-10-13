import type { Metadata } from "next";
import { Action } from "@/components/action";
import { FieldBook } from "@/components/field-book";
import { PageHead, section, shell } from "@/components/page-head";
import { Reveal } from "@/components/reveal";
import { HeadingPair, accented } from "@/components/heading-pair";
import { Glyph, type GlyphName } from "@/components/survey-glyphs";
import { TalkSection } from "@/components/talk-section";
import { coachPage } from "@/data/coach";

export const metadata: Metadata = {
  title: "The Campus Coach",
  description: coachPage.description,
  alternates: { canonical: "/coach/" },
};

export default function Coach() {
  const { role, modes, continuity } = coachPage;

  return (
    <>
      <PageHead notation={coachPage.notation} pair={coachPage} />

      <section id="role" className={section}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            Duties of the station
          </Reveal>
          <HeadingPair pair={role} className="mt-3.5" />

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
          <HeadingPair pair={coachPage.day} className="mt-3.5" />
          <FieldBook />
        </div>
      </section>

      <section className={section}>
        <div className={`${shell} flex flex-wrap items-center justify-between gap-x-10 gap-y-5`}>
          <Reveal as="p" className="max-w-[52ch] text-[clamp(18px,2.2vw,24px)] font-semibold tracking-[-0.02em]">
            {accented(modes.heading)} <span className="font-normal text-fg-2">{modes.sub}</span>
          </Reveal>
          <Reveal>
            <Action href={modes.link.href} tone="secondary">
              {modes.link.label}
            </Action>
          </Reveal>
        </div>
      </section>

      <section id="continuity" className={`border-t border-line bg-ground-2 ${section}`}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            Reference that holds
          </Reveal>
          <HeadingPair pair={continuity} className="mt-3.5" />

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

      <TalkSection />
    </>
  );
}
