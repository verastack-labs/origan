import type { Metadata } from "next";
import { PageHead, h2, section, shell } from "@/components/page-head";
import { Reveal } from "@/components/reveal";
import { Glyph, GlyphChain, type GlyphName } from "@/components/survey-glyphs";
import { Alongside } from "@/components/alongside";
import { TalkSection } from "@/components/talk-section";
import { partnership } from "@/data/content";

export const metadata: Metadata = {
  title: "The partnership",
  description: partnership.body,
  alternates: { canonical: "/partnership/" },
};

export default function Partnership() {
  return (
    <>
      <PageHead
        notation={partnership.notation}
        headline={partnership.headline}
        body={partnership.body}
      />

      <section id="shape" className={section}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            What is being agreed
          </Reveal>
          <div className="mt-[clamp(20px,3vw,36px)] grid gap-px overflow-hidden rounded-panel border border-line bg-line md:grid-cols-2">
            {partnership.shape.map((part) => (
              <Reveal key={part.key} className="bg-panel p-[clamp(22px,3vw,36px)]">
                <Glyph name={part.glyph as GlyphName} size={19} />
                <p className="notation mt-4">{part.role}</p>
                <h2 className="mt-3 text-[clamp(21px,2.6vw,28px)] font-bold tracking-[-0.025em]">
                  {part.key}
                </h2>
                <p className="mt-3.5 text-[15.5px] text-fg-2">{part.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Alongside />

      <section id="modes" className={section}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            Modes of engagement
          </Reveal>
          <Reveal as="h2" variant="plot" className={h2}>
            {partnership.modes.heading}
          </Reveal>
          <Reveal as="p" className="mt-[18px] max-w-[54ch] text-fg-2">
            {partnership.modes.body}
          </Reveal>

          <div className="mt-[clamp(24px,3.4vw,44px)] grid gap-px overflow-hidden rounded-panel border border-line bg-line md:grid-cols-2">
            {partnership.modes.items.map((mode) => (
              <Reveal key={mode.key} className="bg-panel p-[clamp(22px,3vw,34px)]">
                <Glyph name={mode.glyph as GlyphName} />
                <h3 className="mt-4 font-mono text-[10px] uppercase tracking-[0.11em] text-survey">
                  {mode.key}
                </h3>
                <p className="mt-3.5 text-[15.5px] text-fg-2">{mode.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="term" className={`border-y border-line bg-ground-2 ${section}`}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            Term and delivery
          </Reveal>
          <Reveal as="h2" variant="plot" className={h2}>
            {partnership.term.heading}
          </Reveal>
          <Reveal as="p" className="mt-[18px] max-w-[54ch] text-fg-2">
            {partnership.term.body}
          </Reveal>

          {/* A levelling schedule: chainage on the left, what was observed on
              the right. The same table a survey report closes with. */}
          <Reveal className="mt-[clamp(24px,3.4vw,44px)] overflow-hidden rounded-panel border border-line">
            {partnership.term.timeline.map((row) => (
              <div
                key={row.when}
                className="grid grid-cols-1 gap-x-6 gap-y-1.5 border-b border-line-2 bg-panel px-[clamp(18px,2.4vw,26px)] py-4 last:border-b-0 sm:grid-cols-[minmax(150px,auto)_1fr]"
              >
                <span className="flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-survey">
                  <GlyphChain size={14} />
                  {row.when}
                </span>
                <span className="text-[15.5px] text-fg-2">{row.what}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className={section}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            {partnership.who.heading}
          </Reveal>
          <div className="mt-[clamp(20px,3vw,36px)] grid gap-px overflow-hidden rounded-panel border border-line bg-line lg:grid-cols-3">
            {partnership.who.items.map((item) => (
              <Reveal key={item.role} className="bg-panel p-[clamp(20px,2.6vw,30px)]">
                <Glyph name={item.glyph as GlyphName} />
                <h3 className="mt-4 text-[16.5px] font-semibold text-fg">{item.role}</h3>
                <p className="mt-2.5 text-[15px] text-fg-2">{item.body}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-[clamp(24px,3.4vw,44px)] max-w-[66ch] rounded-panel border border-survey-2 bg-panel p-[clamp(22px,3vw,34px)]">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.11em] text-survey">
              {partnership.accreditation.label}
            </h3>
            <p className="mt-3.5 text-[16px] text-fg-2">{partnership.accreditation.body}</p>
            <p className="mt-3 text-[16px] text-fg-2">{partnership.accreditation.aside}</p>
            <p className="mt-4 border-t border-line-2 pt-3 font-mono text-[11px] leading-[1.5] text-fg-3">
              {partnership.accreditation.source}
            </p>
          </Reveal>

          <Reveal className="mt-[clamp(20px,2.6vw,32px)] max-w-[62ch] border-l border-warn/50 pl-5">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.11em] text-fg-3">
              {partnership.cost.heading}
            </h3>
            <p className="mt-3 text-[16px] text-fg-2">{partnership.cost.body}</p>
          </Reveal>
        </div>
      </section>

      <TalkSection sheet="The partnership" />
    </>
  );
}
