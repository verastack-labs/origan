import type { Metadata } from "next";
import { PageHead, section, shell } from "@/components/page-head";
import { Action } from "@/components/action";
import { Reveal } from "@/components/reveal";
import { HeadingPair } from "@/components/heading-pair";
import { Glyph, type GlyphName } from "@/components/survey-glyphs";
import { SurfaceStudy } from "@/components/surface-study";
import { TalkSection } from "@/components/talk-section";
import { product } from "@/data/content";

export const metadata: Metadata = {
  title: "The platform",
  description: product.description,
  alternates: { canonical: "/product/" },
};

export default function Product() {
  return (
    <>
      <PageHead notation={product.notation} pair={product} />

      <section id="roadmap" className={section}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            Setting out
          </Reveal>
          <HeadingPair pair={product.roadmap} className="mt-3.5" />

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
          <HeadingPair pair={product.practice} className="mt-3.5" />

          <Reveal className="mt-[clamp(24px,3.4vw,44px)] flex max-w-[64ch] gap-4 rounded-panel border border-survey-2 bg-panel p-[clamp(22px,3vw,34px)]">
            <Glyph name={product.practice.aptitude.glyph as GlyphName} />
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.11em] text-survey">
                {product.practice.aptitude.label}
              </h3>
              <p className="mt-3 text-[16px] text-fg-2">{product.practice.aptitude.body}</p>
              <p className="mt-4 border-t border-line-2 pt-3 font-mono text-[11px] leading-[1.5] text-fg-3">
                {product.practice.aptitude.source}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="avsar" className={section}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            The terminal station
          </Reveal>
          <HeadingPair pair={product.avsar} className="mt-3.5" />
          <Reveal
            as="p"
            className="mt-6 max-w-[54ch] border-l border-survey-2 pl-5 text-[15.5px] text-fg-3"
          >
            {product.avsar.aside}
          </Reveal>
        </div>
      </section>

      <section className={`border-y border-line bg-ground-2 ${section}`}>
        <div className={`${shell} grid gap-[clamp(24px,4vw,56px)] md:grid-cols-[minmax(0,1fr)_auto] md:items-end`}>
          <div>
            <Reveal variant="label" className="notation">
              {product.rest.notation}
            </Reveal>
            <HeadingPair pair={product.rest} className="mt-3.5" />
          </div>
          <Reveal>
            <Action href={product.rest.link.href} tone="secondary">
              {product.rest.link.label}
            </Action>
          </Reveal>
        </div>
      </section>

      <section className={section}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            The surface
          </Reveal>
          <HeadingPair pair={{ heading: "What a student opens on a Tuesday." }} className="mt-3.5" />
          <SurfaceStudy />
          <p className="mt-[11px] font-mono text-[9.5px] uppercase tracking-[0.08em] text-fg-3">
            Interface study. Values are illustrative and no deployment exists yet.
          </p>
        </div>
      </section>

      <TalkSection />
    </>
  );
}
