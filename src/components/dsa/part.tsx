import { HeadingPair } from "@/components/heading-pair";
import { Reveal } from "@/components/reveal";
import { rustCourse, type LessonPart } from "@/data/courses";

/**
 * The start of one of a lesson's seven parts. Every lesson has the same seven,
 * in the same order, so a reader always knows where the cost table is.
 *
 * The heading is a pair, like every heading on the site: one short line, then
 * a line that lands it.
 */
export function Part({
  id,
  heading,
  sub,
  parts = rustCourse.parts,
}: {
  id: string;
  heading: string;
  sub: string;
  parts?: readonly LessonPart[];
}) {
  const index = parts.findIndex((p) => p.id === id);
  if (index < 0) throw new Error(`Unknown lesson part "${id}"`);

  return (
    <div
      id={id}
      className="mt-[clamp(40px,5.4vw,64px)] scroll-mt-[132px] lg:scroll-mt-[88px] border-t border-line pt-[clamp(32px,4.4vw,52px)] first:mt-0 first:border-t-0 first:pt-0"
    >
      <Reveal variant="label" className="notation">
        {`Part ${index + 1} of 7 · ${parts[index].label}`}
      </Reveal>
      <HeadingPair pair={{ heading, sub }} as="h2" size="card" className="mb-5 mt-3" />
    </div>
  );
}
