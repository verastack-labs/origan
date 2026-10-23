import { Hero } from "@/components/hero";
import { FourProblems } from "@/components/four-problems";
import { LongitudinalProfile } from "@/components/longitudinal-profile";
import { Strands } from "@/components/strands";
import { ConsultantStats } from "@/components/consultant-stats";
import { Reveal } from "@/components/reveal";
import { Action } from "@/components/action";
import { InterestButton } from "@/components/interest";
import { Faq } from "@/components/faq";
import { TalkSection } from "@/components/talk-section";
import { StudentBand } from "@/components/student-band";
import { section, shell } from "@/components/page-head";
import { close, consultant, datum, profile, strandsHead } from "@/data/content";
import { HeadingPair } from "@/components/heading-pair";

export default function Home() {
  return (
    <>
      <Hero />
      <FourProblems />

      <div className={shell}>
        {/* The record heads the section it introduces, and the profile
            follows immediately, so there is more room above than below. */}
        <section className="border-b border-line-2 pb-[clamp(44px,6vw,80px)] pt-[clamp(56px,8.5vw,120px)]">
          <HeadingPair pair={datum} />
          <Reveal as="p" className="mt-4 max-w-[54ch] text-fg-2">
            {datum.body}
          </Reveal>
        </section>
      </div>

      <section id="profile" className={`border-y border-line bg-ground-2 ${section}`}>
        <div className={shell}>
          <Reveal variant="label" className="notation">{profile.notation}</Reveal>
          <HeadingPair pair={profile} className="mt-3.5" />
          <LongitudinalProfile />
        </div>
      </section>

      <section id="strands" className={section}>
        <div className={shell}>
          <Reveal variant="label" className="notation">{strandsHead.notation}</Reveal>
          <HeadingPair pair={strandsHead} className="mt-3.5" />
          <Strands />
        </div>
      </section>

      <section id="consultant" className={section}>
        <div className={shell}>
          <Reveal variant="label" className="notation">Field observation</Reveal>
          <HeadingPair pair={consultant} className="mt-3.5" />
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
          <HeadingPair pair={close} className="mt-3.5" />
          <Reveal className="mt-7 flex flex-wrap gap-3">
            <InterestButton />
            <Action href={close.secondary.href} tone="secondary">
              {close.secondary.label}
            </Action>
          </Reveal>
        </div>
      </section>

      <Faq />
      <TalkSection />
      <StudentBand />
    </>
  );
}
