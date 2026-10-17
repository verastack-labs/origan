import { studentBand } from "@/data/content";
import { HeadingPair } from "./heading-pair";
import { ReferralButton } from "./interest";
import { Reveal } from "./reveal";

/**
 * A short, quiet band for students whose college is not yet on Origan. It sits
 * just above the footer, after the close, so it never competes with the asks
 * aimed at deans and placement officers, who are the site's first audience.
 */
export function StudentBand() {
  return (
    <section className="border-t border-line-2 py-[clamp(36px,5vw,64px)]">
      <div className="mx-auto grid max-w-[1240px] gap-[clamp(18px,3vw,40px)] px-[clamp(18px,4vw,60px)] md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <HeadingPair pair={studentBand} size="card" />
        <Reveal>
          <ReferralButton />
        </Reveal>
      </div>
    </section>
  );
}
