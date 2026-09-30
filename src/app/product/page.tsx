import type { Metadata } from "next";
import { PageHead, h2, section, shell } from "@/components/page-head";
import { Reveal } from "@/components/reveal";
import { Glyph, type GlyphName } from "@/components/survey-glyphs";
import { SurfaceStudy } from "@/components/surface-study";
import { TalkSection } from "@/components/talk-section";
import { product } from "@/data/content";

export const metadata: Metadata = {
  title: "The platform",
  description: product.body,
  alternates: { canonical: "/product/" },
};

export default function Product() {
  return (
    <>
      <PageHead notation={product.notation} headline={product.headline} body={product.body} />

      <section id="roadmap" className={section}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            Setting out
          </Reveal>
          <Reveal as="h2" variant="plot" className={h2}>
            {product.roadmap.heading}
          </Reveal>
          <Reveal as="p" className="mt-[18px] max-w-[54ch] text-fg-2">
            {product.roadmap.body}
          </Reveal>

          <div className="mt-[clamp(24px,3.4vw,44px)] grid gap-px overflow-hidden rounded-panel border border-line bg-line md:grid-cols-3">
            {product.roadmap.points.map((point) => (
              <Reveal key={point.label} className="bg-panel p-[clamp(20px,2.6vw,30px)]">
                <Glyph name={point.glyph as GlyphName} />
                <h3 className="mt-4 font-mono text-[10px] uppercase tracking-[0.11em] text-survey">
                  {point.label}
                </h3>
                <p className="mt-3.5 text-[15.5px] text-fg-2">{point.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="practice" className={`border-y border-line bg-ground-2 ${section}`}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            Repeated observation
          </Reveal>
          <Reveal as="h2" variant="plot" className={h2}>
            {product.practice.heading}
          </Reveal>
          <Reveal as="p" className="mt-[18px] max-w-[54ch] text-fg-2">
            {product.practice.body}
          </Reveal>

          <Reveal className="mt-[clamp(24px,3.4vw,44px)] flex max-w-[64ch] gap-4 rounded-panel border border-survey-2 bg-panel p-[clamp(22px,3vw,34px)]">
            <Glyph name={product.practice.aptitude.glyph as GlyphName} />
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.11em] text-survey">
                {product.practice.aptitude.label}
              </h3>
              <p className="mt-3 text-[16px] text-fg-2">{product.practice.aptitude.body}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="avsar" className={section}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            The terminal station
          </Reveal>
          <Reveal as="h2" variant="plot" className={h2}>
            {product.avsar.heading}
          </Reveal>
          <Reveal as="p" className="mt-[18px] max-w-[54ch] text-fg-2">
            {product.avsar.body}
          </Reveal>
          <Reveal
            as="p"
            className="mt-6 max-w-[54ch] border-l border-survey-2 pl-5 text-[15.5px] text-fg-3"
          >
            {product.avsar.aside}
          </Reveal>
        </div>
      </section>

      <section className={`border-y border-line bg-ground-2 ${section}`}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            {product.rest.heading}
          </Reveal>
          <div className="mt-[clamp(20px,3vw,36px)] grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {product.rest.items.map((item) => (
              <Reveal key={item.name} className="flex gap-3.5 bg-panel p-[clamp(18px,2.4vw,26px)]">
                <Glyph name={item.glyph as GlyphName} />
                <div>
                  <h3 className="text-[16px] font-semibold text-fg">{item.name}</h3>
                  <p className="mt-1.5 text-[15px] text-fg-2">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={section}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            The surface
          </Reveal>
          <Reveal as="h2" variant="plot" className={h2}>
            What a student opens on a Tuesday.
          </Reveal>
          <SurfaceStudy />
          <p className="mt-[11px] font-mono text-[9.5px] uppercase tracking-[0.08em] text-fg-3">
            Interface study. Values are illustrative and no deployment exists yet.
          </p>
        </div>
      </section>

      <TalkSection sheet="The platform" />
    </>
  );
}
