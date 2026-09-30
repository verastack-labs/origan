import { meshColumns, meshRows } from "@/lib/mesh";
import { hero } from "@/data/content";
import { SurfaceField } from "./surface-field";
import { Reveal } from "./reveal";
import { Action } from "./action";
import { NorthArrow, ScaleBar } from "./survey-glyphs";

/**
 * The first viewport is the drawing. The surface is built here, on the server,
 * so it ships in the HTML and the page never appears without its ground.
 */
export function Hero() {
  const rows = meshRows();
  const columns = meshColumns();

  return (
    <header
      id="top"
      className="relative flex min-h-[clamp(540px,88vh,880px)] flex-col justify-end overflow-hidden border-b border-line"
    >
      <div className="absolute -inset-[8%]">
        <SurfaceField rows={rows} columns={columns} />
      </div>

      {/* The surface is framed to leave this corner empty, so these are a
          guarantee rather than the mechanism: a thin wash that holds the
          headline's contrast at viewport shapes the framing did not anticipate.
          A veil heavy enough to carry the whole job is what made the previous
          version look like linework behind frosted glass. */}
      <div className="absolute inset-0 bg-[linear-gradient(104deg,var(--color-ground)_0%,color-mix(in_srgb,var(--color-ground)_55%,transparent)_30%,transparent_58%)]" />
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(to_top,var(--color-ground)_16%,transparent)]" />

      {/* Drawing furniture. A plan carries its orientation and its scale in
          the margin, and putting them here frames the whole page as a sheet. */}
      <div className="pointer-events-none absolute right-[clamp(18px,4vw,60px)] top-[clamp(28px,6vw,72px)] hidden text-survey-2 md:block">
        <NorthArrow size={38} />
      </div>
      <div className="pointer-events-none absolute right-[clamp(18px,4vw,60px)] bottom-[clamp(28px,4vw,50px)] hidden text-survey-2 lg:block">
        <ScaleBar />
      </div>

      <div className="relative mx-auto w-full max-w-[1240px] px-[clamp(18px,4vw,60px)] pb-[clamp(24px,4vw,46px)]">
        <Reveal variant="label" className="notation">
          {hero.notation}
        </Reveal>

        <Reveal
          as="h1"
          variant="plot"
          className="mt-4 max-w-[13ch] text-[clamp(40px,8vw,104px)] font-extrabold leading-[0.94] tracking-[-0.045em]"
        >
          {hero.headline.before}
          <em className="not-italic text-survey">{hero.headline.accent}</em>
          {hero.headline.after}
        </Reveal>

        <Reveal
          as="p"
          className="mt-5 max-w-[48ch] text-[clamp(16px,1.9vw,18.5px)] text-fg-2"
        >
          {hero.body}
        </Reveal>

        <Reveal className="mt-[26px] flex flex-wrap gap-3">
          <Action href={hero.primary.href}>{hero.primary.label}</Action>
          <Action href={hero.secondary.href} tone="secondary">
            {hero.secondary.label}
          </Action>
        </Reveal>
      </div>
    </header>
  );
}
