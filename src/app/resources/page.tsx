import type { Metadata } from "next";
import { PageHead, sectionCompact, shell } from "@/components/page-head";
import { Reveal } from "@/components/reveal";
import { StudioCredit } from "@/components/dsa/lesson-chrome";
import { liveResources, resourcesPage } from "@/data/resources";
import { javaCourse, rustCourse, switchCourse } from "@/data/courses";
import { getLessons } from "@/lib/lessons";
import { getArticles } from "@/lib/articles";
import { buildSearchIndex } from "@/lib/search-index";
import { ResourceSearch } from "@/components/resource-search";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "The Open Shelf",
  description: resourcesPage.description,
  alternates: { canonical: "/resources/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `The Open Shelf · Free courses · ${site.name}`,
    description: resourcesPage.description,
    url: `${site.url}/resources/`,
    locale: "en_IN",
    images: [{ url: "/resources/og.png", width: 1200, height: 630, alt: "The Open Shelf: free courses by VeraStack Labs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `The Open Shelf · Free courses · ${site.name}`,
    description: resourcesPage.description,
    images: ["/resources/og.png"],
  },
};

/** How many pieces each resource has so far. A new resource adds its own line here. */
const counts: Record<string, number> = {
  "dsa-in-rust": getLessons(rustCourse).length,
  "java-collections": getLessons(javaCourse).length,
  "the-switch": getLessons(switchCourse).length,
  "off-the-syllabus": getArticles().length,
};

export default function Resources() {
  const index = buildSearchIndex();

  return (
    <>
      <PageHead
        notation={resourcesPage.notation}
        pair={{ heading: resourcesPage.heading, sub: resourcesPage.sub }}
        cta={false}
        compact
      />

      <section id="study" className={sectionCompact}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            On the shelf
          </Reveal>
          <div className="mt-5" />

          <ResourceSearch index={index} resources={liveResources} counts={counts} />

          <p className="mt-8 max-w-[52ch] text-[15.5px] text-fg-2">
            More will be added here as they are ready.
          </p>
          <StudioCredit className="mt-6" />
        </div>
      </section>
    </>
  );
}
