import type { Metadata } from "next";
import {
  BranchBars,
  ReportSheet,
  TopicGrid,
  TrajectoryChart,
} from "@/components/analytics-charts";
import { PageHead, h2, section, shell } from "@/components/page-head";
import { Reveal } from "@/components/reveal";
import { TalkSection } from "@/components/talk-section";
import { analyticsPage } from "@/data/analytics";

export const metadata: Metadata = {
  title: "Analytics",
  description: analyticsPage.body,
  alternates: { canonical: "/analytics/" },
};

export default function Analytics() {
  const { trajectory, branches, topics, report, principle } = analyticsPage;

  return (
    <>
      <PageHead
        notation={analyticsPage.notation}
        headline={analyticsPage.headline}
        body={analyticsPage.body}
      />

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
          <Reveal as="h2" variant="plot" className={h2}>
            {trajectory.heading}
          </Reveal>
          <Reveal as="p" className="mt-[18px] max-w-[56ch] text-fg-2">
            {trajectory.body}
          </Reveal>
          <TrajectoryChart />
        </div>
      </section>

      <section id="branches" className={`border-y border-line bg-ground-2 ${section}`}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            Cross section
          </Reveal>
          <Reveal as="h2" variant="plot" className={h2}>
            {branches.heading}
          </Reveal>
          <Reveal as="p" className="mt-[18px] max-w-[56ch] text-fg-2">
            {branches.body}
          </Reveal>
          <BranchBars />
        </div>
      </section>

      <section id="topics" className={section}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            Spot heights
          </Reveal>
          <Reveal as="h2" variant="plot" className={h2}>
            {topics.heading}
          </Reveal>
          <Reveal as="p" className="mt-[18px] max-w-[56ch] text-fg-2">
            {topics.body}
          </Reveal>
          <TopicGrid />
        </div>
      </section>

      <section id="report" className={`border-y border-line bg-ground-2 ${section}`}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            Report of survey
          </Reveal>
          <Reveal as="h2" variant="plot" className={h2}>
            {report.heading}
          </Reveal>
          <Reveal as="p" className="mt-[18px] max-w-[56ch] text-fg-2">
            {report.body}
          </Reveal>
          <ReportSheet />

          <Reveal className="mt-[clamp(28px,4vw,48px)] max-w-[62ch] border-l border-survey-2 pl-5">
            <h3 className="text-[clamp(20px,2.4vw,26px)] font-bold tracking-[-0.025em]">
              {principle.heading}
            </h3>
            <p className="mt-3 text-[16px] text-fg-2">{principle.body}</p>
          </Reveal>
        </div>
      </section>

      <TalkSection sheet="Analytics" />
    </>
  );
}
