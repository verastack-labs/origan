import { Reveal } from "./reveal";
import { InterestButton } from "./interest";
import { HeadingPair, type Pair } from "./heading-pair";

/**
 * Shared measurements. Every page is ruled to the same width and the same
 * vertical rhythm, which is most of why three separate routes read as one
 * drawing set rather than as three pages.
 */
export const shell = "mx-auto max-w-[1240px] px-[clamp(18px,4vw,60px)]";
export const section = "py-[clamp(60px,8.5vw,120px)]";

/**
 * The opening of a subpage. Deliberately not the home page's hero: the contour
 * field and the traverse belong to the first viewport of the site, and
 * repeating them on every route would spend the one image the site has.
 * A subpage opens with a ruled statement instead.
 */
export function PageHead({
  notation,
  pair,
  cta = true,
}: {
  notation: string;
  pair: Pair;
  /** The "Register your interest" button. The learning pages leave it off: their reader is a student. */
  cta?: boolean;
}) {
  return (
    <header className="border-b border-line bg-ground-2 pb-[clamp(50px,7vw,90px)] pt-[clamp(54px,8vw,110px)]">
      <div className={shell}>
        <Reveal variant="label" className="notation">
          {notation}
        </Reveal>
        <HeadingPair pair={pair} as="h1" size="page" className="mt-4" />
        {cta && (
          <Reveal className="mt-[26px]">
            <InterestButton />
          </Reveal>
        )}
      </div>
    </header>
  );
}
