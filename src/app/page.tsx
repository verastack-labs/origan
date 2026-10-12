import { Hero } from "@/components/hero";
import { LongitudinalProfile } from "@/components/longitudinal-profile";
import { Strands } from "@/components/strands";
import { ConsultantStats } from "@/components/consultant-stats";
import { Reveal } from "@/components/reveal";
import { Action } from "@/components/action";
import { InterestButton } from "@/components/interest";
import { TalkSection } from "@/components/talk-section";
import { h2, section, shell } from "@/components/page-head";
import { close, consultant, datum } from "@/data/content";

export default function Home() {
  return (
    <>
      <Hero />

      <div className={shell}>
        {/* More room above the statement than below it: it belongs to the
            section it introduces, and the profile follows immediately. */}
        <section className="border-b border-line-2 pb-[clamp(44px,6vw,80px)] pt-[clamp(70px,11vw,150px)]">
          <Reveal
            as="p"
            variant="plot"
            className="max-w-[20ch] text-[clamp(25px,4.4vw,48px)] font-semibold leading-[1.16] tracking-[-0.032em]"
          >
            {datum.statement.before}
            <em className="not-italic text-survey">{datum.statement.accent}</em>
            {datum.statement.after}
          </Reveal>
          <Reveal as="p" className="mt-[22px] max-w-[46ch] text-[17px] text-fg-2">
            {datum.body}
          </Reveal>
        </section>
      </div>

      <section id="profile" className={`border-y border-line bg-ground-2 ${section}`}>
        <div className={shell}>
          <Reveal variant="label" className="notation">Longitudinal section</Reveal>
          <Reveal as="h2" variant="plot" className={h2}>
            Eight semesters, marked.
          </Reveal>
          <Reveal as="p" className="mt-[18px] max-w-[52ch] text-fg-2">
            Select a semester.
          </Reveal>
          <LongitudinalProfile />
        </div>
      </section>

      <section id="strands" className={section}>
        <div className={shell}>
          <Reveal variant="label" className="notation">Levels observed</Reveal>
          <Reveal as="h2" variant="plot" className={h2}>
            Four strands, running the <em className="not-italic text-survey">whole way</em>.
          </Reveal>
          <Strands />
        </div>
      </section>

      <section id="consultant" className={section}>
        <div className={shell}>
          <Reveal variant="label" className="notation">Field observation</Reveal>
          <Reveal as="h2" variant="plot" className={h2}>
            {consultant.heading}
          </Reveal>
          <Reveal as="p" className="mt-[18px] max-w-[52ch] text-fg-2">
            {consultant.body}
          </Reveal>
          <ConsultantStats />
          <Reveal className="mt-7">
            <Action href="/coach/" tone="secondary">
              Meet the Campus Coach
            </Action>
          </Reveal>
        </div>
      </section>

      <section className={section}>
        <div className={shell}>
          <Reveal variant="label" className="notation">The terms, in short</Reveal>
          <Reveal as="h2" variant="plot" className={h2}>
            {close.heading}
          </Reveal>
          <Reveal as="p" className="mt-[18px] max-w-[52ch] text-fg-2">
            {close.body}
          </Reveal>
          <Reveal className="mt-7 flex flex-wrap gap-3">
            <InterestButton />
            <Action href={close.secondary.href} tone="secondary">
              {close.secondary.label}
            </Action>
          </Reveal>
        </div>
      </section>

      <TalkSection />
    </>
  );
}
