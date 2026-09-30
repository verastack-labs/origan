import { Reveal } from "./reveal";
import { EnquiryForm } from "./enquiry-form";
import { TitleBlock } from "./title-block";
import { talk } from "@/data/content";

/**
 * The close, identical on all three pages. The nav's call to action points at
 * `#talk` from everywhere, so this section has to exist on every route or that
 * button becomes a link to nothing.
 */
export function TalkSection({ sheet }: { sheet?: string }) {
  return (
    <section
      id="talk"
      className="border-t border-line bg-ground-2 pt-[clamp(60px,8.5vw,120px)]"
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

        <EnquiryForm />

        {/* Extra room at the foot so the floating sheet index never sits on
            top of the title block. */}
        <footer className="pb-[120px] pt-[clamp(50px,7vw,90px)]">
          <TitleBlock sheet={sheet} />
        </footer>
      </div>
    </section>
  );
}
