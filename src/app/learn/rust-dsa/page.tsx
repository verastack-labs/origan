import type { Metadata } from "next";
import Link from "next/link";
import { PageHead, section, shell } from "@/components/page-head";
import { HeadingPair } from "@/components/heading-pair";
import { Reveal } from "@/components/reveal";
import { StudioCredit } from "@/components/dsa/lesson-chrome";
import { ReadMark } from "@/components/dsa/read-tick";
import { curriculum, lessonParts, lessonPath, rustDsa } from "@/data/rust-dsa";
import { site } from "@/data/site";
import { getLessons } from "@/lib/lessons";
import { courseJsonLd, jsonLdScript } from "@/lib/rust-dsa-jsonld";

const ogImage = `${rustDsa.path}og.png`;

export const metadata: Metadata = {
  title: rustDsa.name,
  description: rustDsa.description,
  alternates: { canonical: rustDsa.path },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${rustDsa.name} · ${site.name}`,
    description: rustDsa.description,
    url: `${site.url}${rustDsa.path}`,
    locale: "en_IN",
    images: [{ url: ogImage, width: 1200, height: 630, alt: `${rustDsa.name}, free lessons` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${rustDsa.name} · ${site.name}`,
    description: rustDsa.description,
    images: [ogImage],
  },
};

const numbers = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen"];

const capital = (word: string) => word[0].toUpperCase() + word.slice(1);

export default function RustDsa() {
  const lessons = getLessons();
  const live = new Map(lessons.map((l) => [l.slug, l]));
  const ready = lessons.length;
  const total = curriculum.length;

  const listing = {
    heading: "Part 1: data [structures]",
    sub: `${capital(numbers[total])} lessons planned. ${numbers[ready]} ${ready === 1 ? "is" : "are"} ready, and the rest are coming next.`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        // A literal we build, with `<` escaped; never user input.
        dangerouslySetInnerHTML={{ __html: jsonLdScript(courseJsonLd(lessons)) }}
      />

      <PageHead
        notation="Free lessons · Made by VeraStack Labs"
        pair={{ heading: "DSA in [Rust]", sub: "Data structures, one working build at a time." }}
        cta={false}
      />

      <section id="lessons" className={section}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            {rustDsa.partNames[1]}
          </Reveal>
          <HeadingPair pair={listing} className="mt-3.5" />

          <ol className="mt-[clamp(24px,3.4vw,44px)] overflow-hidden rounded-panel border border-line">
            {curriculum.map((entry) => {
              const lesson = live.get(entry.slug);
              const row =
                "grid grid-cols-[36px_minmax(0,1fr)] gap-x-4 gap-y-1 px-[clamp(16px,2.6vw,28px)] py-[clamp(16px,2.2vw,22px)] md:grid-cols-[36px_minmax(0,1.1fr)_minmax(0,1fr)_110px] md:items-center md:gap-x-8";
              const num = (
                <span className="font-mono text-[11px] tabular-nums text-fg-3">
                  {String(entry.order).padStart(2, "0")}
                </span>
              );
              const angle = (
                <span className="col-start-2 text-[14.5px] text-fg-2 md:col-start-auto">{entry.angle}</span>
              );

              return (
                <li key={entry.slug} className="border-b border-line-2 last:border-b-0">
                  {lesson ? (
                    <Link
                      href={lessonPath(entry.slug)}
                      className={`${row} bg-panel transition-colors hover:bg-panel-2`}
                    >
                      {num}
                      <span className="text-[clamp(17px,1.9vw,20px)] font-semibold tracking-[-0.02em] text-fg">
                        {entry.title}
                      </span>
                      {angle}
                      <span className="col-start-2 md:col-start-auto md:text-right">
                        <ReadMark slug={entry.slug} />
                      </span>
                    </Link>
                  ) : (
                    <div className={`${row} bg-ground`}>
                      {num}
                      <span className="text-[clamp(17px,1.9vw,20px)] font-semibold tracking-[-0.02em] text-fg-2">
                        {entry.title}
                      </span>
                      {angle}
                      <span className="col-start-2 font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3 md:col-start-auto md:text-right">
                        Coming next
                      </span>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section id="shape" className={`border-t border-line bg-ground-2 ${section}`}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            How a lesson is built
          </Reveal>
          <HeadingPair
            pair={{ heading: "Seven parts, every [time]", sub: "So you always know where the cost table is." }}
            className="mt-3.5"
          />

          <ol className="mt-[clamp(24px,3.4vw,44px)] overflow-hidden rounded-panel border border-line">
            {lessonParts.map((part, i) => (
              <Reveal
                key={part.id}
                as="li"
                className="flex items-baseline gap-4 border-b border-line-2 bg-panel px-[clamp(16px,2.6vw,28px)] py-4 last:border-b-0"
              >
                <span className="font-mono text-[11px] tabular-nums text-fg-3">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[17px] font-semibold tracking-[-0.02em] text-fg">{part.label}</span>
              </Reveal>
            ))}
          </ol>

          <p className="mt-8 max-w-[60ch] text-[15.5px] text-fg-2">
            Every piece of Rust on these pages is a real file that is compiled and tested before the page is built, so
            the code you read is the code that ran. Your progress is kept in this browser only. Nothing is sent
            anywhere.
          </p>
          <StudioCredit className="mt-6" />
        </div>
      </section>
    </>
  );
}
