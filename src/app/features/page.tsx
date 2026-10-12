import type { Metadata } from "next";
import { Action } from "@/components/action";
import { FeatureLegend } from "@/components/feature-legend";
import { PageHead, h2, section, shell } from "@/components/page-head";
import { Reveal } from "@/components/reveal";
import { TalkSection } from "@/components/talk-section";
import { featuresPage } from "@/data/features";

export const metadata: Metadata = {
  title: "Features",
  description: featuresPage.body,
  alternates: { canonical: "/features/" },
};

export default function Features() {
  const { ai, datum } = featuresPage;

  return (
    <>
      <PageHead
        notation={featuresPage.notation}
        headline={featuresPage.headline}
        body={featuresPage.body}
      />

      <section id="legend" className={section}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            Legend of marks
          </Reveal>
          <Reveal as="h2" variant="plot" className={h2}>
            What a student works with.
          </Reveal>
          <FeatureLegend />
        </div>
      </section>

      <section id="ai" className={`border-y border-line bg-ground-2 ${section}`}>
        <div className={`${shell} grid gap-[clamp(28px,5vw,72px)] md:grid-cols-2`}>
          <div>
            <Reveal variant="label" className="notation">
              Instrumentation
            </Reveal>
            <Reveal as="h2" variant="plot" className={h2}>
              {ai.heading}
            </Reveal>
            <Reveal as="p" className="mt-[18px] max-w-[52ch] text-fg-2">
              {ai.body}
            </Reveal>
          </div>

          <Reveal className="self-end rounded-panel border border-survey-2 bg-panel p-[clamp(22px,3vw,34px)]">
            <h3 className="text-[clamp(21px,2.6vw,28px)] font-bold tracking-[-0.025em]">
              {datum.heading}
            </h3>
            <p className="mt-3.5 max-w-[46ch] text-[15.5px] text-fg-2">{datum.body}</p>
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
