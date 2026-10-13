import type { Metadata } from "next";
import { Action } from "@/components/action";
import { FeatureLegend } from "@/components/feature-legend";
import { PageHead, section, shell } from "@/components/page-head";
import { Reveal } from "@/components/reveal";
import { HeadingPair } from "@/components/heading-pair";
import { TalkSection } from "@/components/talk-section";
import { featuresPage } from "@/data/features";

export const metadata: Metadata = {
  title: "Features",
  description: featuresPage.description,
  alternates: { canonical: "/features/" },
};

export default function Features() {
  const { ai, datum } = featuresPage;

  return (
    <>
      <PageHead notation={featuresPage.notation} pair={featuresPage} />

      <section id="legend" className={section}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            Legend of marks
          </Reveal>
          <HeadingPair pair={{ heading: "What a student works with." }} className="mt-3.5" />
          <FeatureLegend />
        </div>
      </section>

      <section id="ai" className={`border-y border-line bg-ground-2 ${section}`}>
        <div className={`${shell} grid gap-[clamp(28px,5vw,72px)] md:grid-cols-2`}>
          <div>
            <Reveal variant="label" className="notation">
              Instrumentation
            </Reveal>
            <HeadingPair pair={ai} className="mt-3.5" />
            <Reveal as="p" className="mt-5 max-w-[52ch] text-fg-2">
              {ai.body}
            </Reveal>
          </div>

          <Reveal className="self-end rounded-panel border border-survey-2 bg-panel p-[clamp(22px,3vw,34px)]">
            <HeadingPair pair={datum} as="h3" size="card" />
            <div className="mt-6">
              <Action href={datum.link.href} tone="secondary">
                {datum.link.label}
              </Action>
            </div>
          </Reveal>
        </div>
      </section>

      <TalkSection />
    </>
  );
}
