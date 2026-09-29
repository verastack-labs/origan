import { contourLines } from "@/lib/contours";
import { hero } from "@/data/content";
import { ContourField } from "./contour-field";
import { Reveal } from "./reveal";
import { Action } from "./action";
import { NorthArrow, ScaleBar } from "./survey-glyphs";

/**
 * The first viewport is the drawing. Lines are marched here, on the server, so
 * they ship in the HTML and the page never appears without its field.
 */
export function Hero() {
  const lines = contourLines({ width: 1440, height: 900 });

  return (
    <header
      id="top"
      className="relative flex min-h-[clamp(540px,88vh,880px)] flex-col justify-end overflow-hidden border-b border-line"
    >
      <div className="absolute -inset-[8%]">
        <ContourField lines={lines} />
      </div>

      {/* Protects the headline's contrast on the left while leaving the right
          of the frame clear, which is where the summit and the final station
          are. A radial wash centred behind the text smothered both. */}
      <div className="absolute inset-0 bg-[linear-gradient(101deg,var(--color-ground)_0%,var(--color-ground)_26%,color-mix(in_srgb,var(--color-ground)_74%,transparent)_46%,transparent_74%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_top,var(--color-ground),transparent)]" />

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
          className="mt-4 max-w-[14ch] text-[clamp(38px,7.6vw,96px)] font-extrabold leading-[0.95] tracking-[-0.043em]"
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
