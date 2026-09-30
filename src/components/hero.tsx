import { hero } from "@/data/content";
import { FigureField } from "./figure-field";
import { Reveal } from "./reveal";
import { Action } from "./action";
import { NorthArrow } from "./survey-glyphs";

/**
 * The first viewport is the drawing, and the drawing is a triangulation
 * figure: a dozen marks in the right of the frame, the rest of the sheet left
 * empty for the headline.
 */
export function Hero() {
  return (
    <header
      id="top"
      className="relative flex min-h-[clamp(540px,88vh,880px)] flex-col justify-end overflow-hidden border-b border-line"
    >
      {/* Only a little larger than the frame. The old field was oversized so
          its texture ran off every edge; a figure that is placed wants to stay
          where it was placed. */}
      <div className="absolute -inset-[3%]">
        <FigureField />
      </div>

      {/* The figure is set out clear of the words, so this is a guarantee
          rather than the mechanism: a thin wash holding the headline's
          contrast at viewport shapes the placement did not anticipate. A veil
          heavy enough to carry the whole job is what made the earlier versions
          look like linework behind frosted glass. */}
      <div className="absolute inset-0 bg-[linear-gradient(104deg,var(--color-ground)_0%,color-mix(in_srgb,var(--color-ground)_50%,transparent)_34%,transparent_62%)]" />

      {/* Drawing furniture. One mark, not two: the figure already carries a
          measured datum, and the scale bar that used to sit down here was a
          second scale saying the same thing in an emptier composition. */}
      <div className="pointer-events-none absolute right-[clamp(18px,4vw,60px)] top-[clamp(28px,6vw,72px)] hidden text-survey-2 md:block">
        <NorthArrow size={38} />
      </div>

      {/* Sits off the bottom rather than on it. The content used to end a few
          pixels above the fold, which reads as the page having run out of room
          rather than as a composition. */}
      <div className="relative mx-auto w-full max-w-[1240px] px-[clamp(18px,4vw,60px)] pb-[clamp(78px,11vw,150px)]">
        <Reveal variant="label" className="notation">
          {hero.notation}
        </Reveal>

        <Reveal
          as="h1"
          variant="plot"
          className="mt-4 max-w-[13ch] text-[clamp(40px,7.6vw,100px)] font-extrabold leading-[0.94] tracking-[-0.045em]"
        >
          {hero.headline.before}
          <em className="not-italic text-survey">{hero.headline.accent}</em>
          {hero.headline.after}
        </Reveal>

        <Reveal as="p" className="mt-5 max-w-[44ch] text-[clamp(16px,1.9vw,18.5px)] text-fg-2">
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
