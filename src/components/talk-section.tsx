import { Reveal } from "./reveal";
import { EnquiryForm } from "./enquiry-form";
import { talk } from "@/data/content";
import { InterestButton } from "./interest";

/**
 * The close, identical on every page. The nav's call to action points at
 * `#talk` from everywhere, so this section has to exist on every route or that
 * button becomes a link to nothing.
 */
export function TalkSection() {
  return (
    <section
      id="talk"
      className="border-t border-line bg-ground-2 py-[clamp(60px,8.5vw,120px)]"
    >
      <div className="mx-auto max-w-[1240px] px-[clamp(18px,4vw,60px)]">
        <Reveal variant="label" className="notation">
          Establishing the partnership
        </Reveal>
        <Reveal
          as="h2"
          variant="plot"
          className="mt-3.5 max-w-[17ch] text-[clamp(27px,4.6vw,50px)] font-bold leading-[1.05] tracking-[-0.035em]"
        >
          {talk.heading}
        </Reveal>
        <Reveal as="p" className="mt-[18px] max-w-[52ch] text-fg-2">
          {talk.body}
        </Reveal>

        <Reveal className="mt-7 flex max-w-[560px] flex-wrap items-center gap-x-5 gap-y-3 rounded-panel border border-line bg-panel px-5 py-4">
          <InterestButton tone="secondary" />
          <p className="text-[14.5px] text-fg-2">{talk.orRegister}</p>
        </Reveal>

        <EnquiryForm />

      </div>
    </section>
  );
}
