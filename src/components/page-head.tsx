import { Reveal } from "./reveal";

/**
 * Shared measurements. Every page is ruled to the same width and the same
 * vertical rhythm, which is most of why three separate routes read as one
 * drawing set rather than as three pages.
 */
export const shell = "mx-auto max-w-[1240px] px-[clamp(18px,4vw,60px)]";
export const section = "py-[clamp(60px,8.5vw,120px)]";
export const h2 =
  "mt-3.5 max-w-[17ch] text-[clamp(27px,4.6vw,50px)] font-bold leading-[1.05] tracking-[-0.035em]";

/**
 * The opening of a subpage. Deliberately not the home page's hero: the contour
 * field and the traverse belong to the first viewport of the site, and
 * repeating them on every route would spend the one image the site has.
 * A subpage opens with a ruled statement instead.
 */
export function PageHead({
  notation,
  headline,
  body,
}: {
  notation: string;
  headline: { before: string; accent: string; after: string };
  body: string;
}) {
  return (
    <header className="border-b border-line bg-ground-2 pb-[clamp(50px,7vw,90px)] pt-[clamp(54px,8vw,110px)]">
      <div className={shell}>
        <Reveal variant="label" className="notation">
          {notation}
        </Reveal>
        <Reveal
          as="h1"
          variant="plot"
          className="mt-4 max-w-[19ch] text-[clamp(32px,6vw,68px)] font-bold leading-[1.02] tracking-[-0.04em]"
        >
          {headline.before}
          <em className="not-italic text-survey">{headline.accent}</em>
          {headline.after}
        </Reveal>
        <Reveal as="p" className="mt-[22px] max-w-[54ch] text-[17px] text-fg-2">
          {body}
        </Reveal>
      </div>
    </header>
  );
}
