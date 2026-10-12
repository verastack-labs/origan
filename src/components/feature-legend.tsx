import { Reveal } from "./reveal";
import { Glyph, type GlyphName } from "./survey-glyphs";
import { featuresPage, type Feature } from "@/data/features";

/**
 * The features as a map legend: a mark, a name, what it is, and what it
 * records. A legend rather than a card grid, because a legend is how a drawing
 * explains its own symbols, and because a grid of equal tiles says "here is
 * everything" when the brief is to entice rather than enumerate.
 *
 * After a few rows the legend keeps going but fades into the ground, with
 * "And more" set over the fade. The faded rows are real features in real text,
 * so a screen reader still gets all of them.
 */
function Row({ feature }: { feature: Feature }) {
  const name = feature.ai ? feature.name.replace(/\s*AI$/, "") : feature.name;

  return (
    <div className="grid grid-cols-[36px_minmax(0,1fr)] gap-x-4 gap-y-3 border-b border-line-2 bg-panel px-[clamp(16px,2.6vw,28px)] py-[clamp(18px,2.4vw,26px)] lg:grid-cols-[36px_minmax(190px,0.75fr)_minmax(0,1.6fr)_minmax(170px,0.7fr)] lg:gap-x-8">
      <Glyph name={feature.glyph as GlyphName} />

      <div>
        {/* Labelled with the full name, because the tag beside it is a separate
            box and would otherwise be read as "ElevationAI". */}
        <h3
          aria-label={feature.name}
          className="flex flex-wrap items-center gap-2 text-[clamp(20px,2.2vw,24px)] font-bold leading-[1.15] tracking-[-0.025em]"
        >
          {name}
          {feature.ai && (
            <span className="rounded-control border border-survey-2 px-1.5 py-[3px] font-mono text-[10px] font-semibold leading-none tracking-[0.1em] text-survey">
              AI
            </span>
          )}
        </h3>
        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3">
          {feature.descriptor}
        </p>
      </div>

      <p className="col-start-2 text-[15.5px] text-fg-2 lg:col-start-auto">{feature.body}</p>

      <p className="col-start-2 flex items-start gap-2 font-mono text-[11px] leading-[1.5] text-fg-2 lg:col-start-auto">
        <span className="shrink-0 uppercase tracking-[0.1em] text-fg-3">Records</span>
        <span>{feature.records}</span>
      </p>
    </div>
  );
}

export function FeatureLegend() {
  const { legend, shown, faded } = featuresPage;

  return (
    <div className="mt-[clamp(24px,3.4vw,44px)]">
      <Reveal className="overflow-hidden rounded-t-panel border-x border-t border-line">
        <div className="flex justify-between gap-3 border-b border-line bg-panel px-4 py-[11px]">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-fg-2">
            {legend.caption}
          </span>
        </div>
        {shown.map((feature) => (
          <Row key={feature.name} feature={feature} />
        ))}
      </Reveal>

      {/* The legend runs on past what is spelled out, and fades out. */}
      <div className="border-x border-line [mask-image:linear-gradient(to_bottom,black,rgba(0,0,0,0.45)_40%,transparent)]">
        {faded.map((feature) => (
          <Row key={feature.name} feature={feature} />
        ))}
      </div>

      <div className="relative -mt-[clamp(70px,9vw,110px)] flex flex-col items-center px-4 text-center">
        <span aria-hidden="true" className="mb-4 h-12 w-px bg-linear-to-b from-transparent to-survey-2" />
        <p className="text-[clamp(28px,3.8vw,44px)] font-bold tracking-[-0.035em] text-fg">
          {legend.more}
        </p>
        <p className="mt-2 max-w-[40ch] text-[15px] text-fg-2">{legend.moreBody}</p>
      </div>
    </div>
  );
}
