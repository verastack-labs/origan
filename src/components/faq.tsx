import { faq } from "@/data/content";
import { HeadingPair, plain } from "./heading-pair";
import { Reveal } from "./reveal";
import { section, shell } from "./page-head";

/**
 * The FAQPage structured data, built from the same list the rows render, so
 * the markup and the visible text cannot differ.
 */
export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/**
 * The questions, as native disclosure rows. Every answer is in the HTML from
 * the start, so a crawler, an answer engine and a reader without JavaScript all
 * get the same text.
 */
export function Faq() {
  return (
    <section id="faq" className={`border-t border-line ${section}`} aria-label={plain(faq.heading)}>
      <script
        type="application/ld+json"
        // A literal built from site data, never user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />
      <div className={shell}>
        <Reveal variant="label" className="notation">Questions</Reveal>
        <HeadingPair pair={faq} className="mt-3.5" />

        <div className="mt-9 max-w-[820px] border-t border-line">
          {faq.items.map((item) => (
            <Reveal as="details" key={item.q} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[clamp(17px,1.7vw,19.5px)] font-semibold leading-[1.3] tracking-[-0.015em] text-fg marker:content-none hover:text-survey focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-survey [&::-webkit-details-marker]:hidden">
                <span>{item.q}</span>
                <span
                  aria-hidden="true"
                  className="relative mt-[0.45em] h-3 w-3 shrink-0 text-survey before:absolute before:left-0 before:top-1/2 before:h-px before:w-full before:bg-current after:absolute after:left-1/2 after:top-0 after:h-full after:w-px after:bg-current after:transition-transform after:duration-200 group-open:after:scale-y-0"
                />
              </summary>
              <p className="max-w-[62ch] pb-6 pr-9 text-[16.5px] leading-[1.55] text-fg-2">{item.a}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
