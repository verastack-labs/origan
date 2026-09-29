import { Hero } from "@/components/hero";
import { Alongside } from "@/components/alongside";
import { LongitudinalProfile } from "@/components/longitudinal-profile";
import { Strands } from "@/components/strands";
import { ConsultantStats } from "@/components/consultant-stats";
import { SurfaceStudy } from "@/components/surface-study";
import { SiteNav } from "@/components/site-nav";
import { Reveal } from "@/components/reveal";
import { Action } from "@/components/action";
import { TitleBlock } from "@/components/title-block";
import { close, consultant, datum } from "@/data/content";

const shell = "mx-auto max-w-[1240px] px-[clamp(18px,4vw,60px)]";
const section = "py-[clamp(60px,8.5vw,120px)]";
const h2 = "mt-3.5 max-w-[17ch] text-[clamp(27px,4.6vw,50px)] font-bold leading-[1.05] tracking-[-0.035em]";

export default function Home() {
  return (
    <>
      <SiteNav />
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
            The ground covered, semester by semester.
          </Reveal>
          <Reveal as="p" className="mt-[18px] max-w-[52ch] text-fg-2">
            Select a semester to read what happens there.
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

      <Alongside />

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
        </div>
      </section>

      <section id="surface" className={`border-t border-line bg-ground-2 ${section}`}>
        <div className={shell}>
          <Reveal variant="label" className="notation">The surface</Reveal>
          <Reveal as="h2" variant="plot" className={h2}>
            What a student opens on a Tuesday.
          </Reveal>
          <Reveal as="p" className="mt-[18px] max-w-[52ch] text-fg-2">
            Move through it.
          </Reveal>
          <SurfaceStudy />
          <p className="mt-[11px] font-mono text-[9.5px] uppercase tracking-[0.08em] text-fg-3">
            Interface study. Values are illustrative and no deployment exists yet.
          </p>
        </div>
      </section>

      <section id="talk" className={`border-t border-line bg-ground-2 ${section} pb-0`}>
        <div className={shell}>
          <Reveal variant="label" className="notation">Establishing the partnership</Reveal>
          <Reveal as="h2" variant="plot" className={h2}>
            {close.heading}
          </Reveal>
          <Reveal as="p" className="mt-[18px] max-w-[52ch] text-fg-2">
            {close.body}
          </Reveal>
          <Reveal className="mt-7 flex flex-wrap gap-3">
            <Action href={close.primary.href}>{close.primary.label}</Action>
            <Action href={close.secondary.href} tone="secondary">
              {close.secondary.label}
            </Action>
          </Reveal>

          <footer className="pb-[clamp(44px,6vw,80px)]">
            <TitleBlock />
          </footer>
        </div>
      </section>
    </>
  );
}
