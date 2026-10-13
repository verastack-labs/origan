import type { Metadata } from "next";
import {
  BranchBars,
  ReportSheet,
  TopicGrid,
  TrajectoryChart,
} from "@/components/analytics-charts";
import { PageHead, section, shell } from "@/components/page-head";
import { Reveal } from "@/components/reveal";
import { HeadingPair } from "@/components/heading-pair";
import { TalkSection } from "@/components/talk-section";
import { analyticsPage } from "@/data/analytics";

export const metadata: Metadata = {
  title: "Analytics",
  description: analyticsPage.description,
  alternates: { canonical: "/analytics/" },
};

export default function Analytics() {
  const { trajectory, branches, topics, report, principle } = analyticsPage;

  return (
    <>
      <PageHead notation={analyticsPage.notation} pair={analyticsPage} />

      {/* Said once, plainly, before any chart, and again on every chart. */}
      <div className="border-b border-line">
        <div className={`${shell} flex items-start gap-3 py-4`}>
          <span className="mt-[3px] shrink-0 font-mono text-[9.5px] uppercase tracking-[0.1em] text-warn">
            {analyticsPage.disclaimer}
          </span>
          <p className="max-w-[70ch] text-[14px] text-fg-2">{analyticsPage.direction}</p>
        </div>
      </div>

      <section id="trajectory" className={section}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            Longitudinal section
          </Reveal>
          <HeadingPair pair={trajectory} className="mt-3.5" />
          <TrajectoryChart />
        </div>
      </section>

      <section id="branches" className={`border-y border-line bg-ground-2 ${section}`}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            Cross section
          </Reveal>
          <HeadingPair pair={branches} className="mt-3.5" />
          <BranchBars />
        </div>
      </section>

      <section id="topics" className={section}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            Spot heights
          </Reveal>
          <HeadingPair pair={topics} className="mt-3.5" />
          <TopicGrid />
        </div>
      </section>

      <section id="report" className={`border-y border-line bg-ground-2 ${section}`}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            Report of survey
          </Reveal>
          <HeadingPair pair={report} className="mt-3.5" />
          <ReportSheet />

          <Reveal className="mt-[clamp(28px,4vw,48px)] max-w-[62ch] border-l border-survey-2 pl-5">
            <HeadingPair pair={principle} as="h3" size="card" />
          </Reveal>
        </div>
      </section>

      <TalkSection />
    </>
  );
}
