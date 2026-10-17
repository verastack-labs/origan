import type { Metadata } from "next";
import Link from "next/link";
import { PageHead, section, shell } from "@/components/page-head";
import { Reveal } from "@/components/reveal";
import { StudioCredit } from "@/components/dsa/lesson-chrome";
import { resources, resourcesPage } from "@/data/resources";
import { javaCourse, rustCourse } from "@/data/courses";
import { getLessons } from "@/lib/lessons";

export const metadata: Metadata = {
  title: "Resources",
  description: resourcesPage.description,
  alternates: { canonical: "/resources/" },
};

/** How many pieces each resource has so far. A new resource adds its own line here. */
const counts: Record<string, number> = {
  "dsa-in-rust": getLessons(rustCourse).length,
  "java-collections": getLessons(javaCourse).length,
};

export default function Resources() {
  return (
    <>
      <PageHead
        notation={resourcesPage.notation}
        pair={{ heading: resourcesPage.heading, sub: resourcesPage.sub }}
        cta={false}
      />

      <section id="study" className={section}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            Study material
          </Reveal>

          <ul className="mt-6 overflow-hidden rounded-panel border border-line">
            {resources.map((resource) => {
              const count = counts[resource.id] ?? 0;
              const [one, many] = resource.unit;

              return (
                <Reveal as="li" key={resource.id} className="border-b border-line-2 bg-panel last:border-b-0">
                  <Link
                    href={resource.href}
                    className="group flex h-full flex-col p-[clamp(20px,2.6vw,32px)] transition-colors hover:bg-panel-2"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.13em] text-fg-3">
                      Free · {count} {count === 1 ? one : many}
                    </span>
                    <span className="mt-3 text-[clamp(22px,2.6vw,30px)] font-bold tracking-[-0.03em] text-fg">
                      {resource.name}
                    </span>
                    <span className="mt-2.5 max-w-[44ch] text-[15.5px] text-fg-2">{resource.summary}</span>
                    <span className="mt-6 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-survey">
                      Open the lessons{" "}
                      <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </ul>

          <p className="mt-8 max-w-[52ch] text-[15.5px] text-fg-2">
            More will be added here as they are ready.
          </p>
          <StudioCredit className="mt-6" />
        </div>
      </section>
    </>
  );
}
