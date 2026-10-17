"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sheets, site } from "@/data/site";
import { studentReferral } from "@/data/content";
import { BenchmarkMark } from "./benchmark-mark";
import { InterestButton, ReferralButton } from "./interest";
import { TitleBlock } from "./title-block";

/**
 * The foot of every sheet, mounted once in the layout so it cannot drift
 * between pages.
 *
 * Three columns a dean actually uses, then the title block. The set, so a
 * reader who arrived on one forwarded page can find the other five. The ask,
 * in one line. And the people, because the question this site exists to
 * survive is "who are these people": a name, a studio, an area, and a link
 * to the studio. Nothing more specific than the area.
 *
 * The title block closes the sheet the way a drawing closes. It needs the
 * sheet's name, which the route gives it.
 */
export function SiteFooter() {
  const pathname = usePathname();
  const here = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const sheet = sheets.find((s) => s.href === here);

  return (
    <footer className="border-t border-line bg-ground">
      <div className="mx-auto max-w-[1240px] px-[clamp(18px,4vw,60px)] pb-[120px] pt-[clamp(44px,6vw,72px)]">
        <div className="grid gap-x-[clamp(28px,5vw,80px)] gap-y-10 md:grid-cols-[minmax(0,1.3fr)_auto_auto]">
          {/* The claim, and the ask. */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 text-[18px] font-bold tracking-[-0.02em]">
              <span className="text-survey">
                <BenchmarkMark size={17} />
              </span>
              {site.name}
            </Link>
            <p className="mt-4 max-w-[38ch] text-[15.5px] text-fg-2">{site.tagline}.</p>
            <div className="mt-6">
              <InterestButton tone="secondary" />
            </div>
            <div className="mt-5">
              <ReferralButton tone="link">{studentReferral.footerLink}</ReferralButton>
            </div>
          </div>

          {/* The set. */}
          <nav aria-label="All pages">
            <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-fg-3">The set</p>
            <ol className="mt-4 grid gap-2.5">
              {sheets.map((s, i) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    aria-current={s.href === here ? "page" : undefined}
                    className={`flex items-baseline gap-3 text-[15px] transition-colors hover:text-survey ${
                      s.href === here ? "text-survey" : "text-fg"
                    }`}
                  >
                    <span className="font-mono text-[10px] tabular-nums text-fg-3">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>

          {/* The people. */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-fg-3">Studio</p>
            <address className="mt-4 grid gap-1 text-[15px] not-italic text-fg">
              <span>{site.founder}</span>
              <a
                href={site.studioUrl}
                className="text-fg transition-colors hover:text-survey"
                rel="noopener"
              >
                {site.studio}
              </a>
              <span className="text-fg-2">{site.location}</span>
              <a href={`mailto:${site.email}`} className="mt-2 text-fg transition-colors hover:text-survey">
                {site.email}
              </a>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-fg transition-colors hover:text-survey">
                {site.phone}
              </a>
            </address>
            <p className="mt-5 max-w-[26ch] text-[13.5px] text-fg-3">
              Forms on this site reach one inbox, and nothing here is a mailing list. Visits are counted without cookies.
            </p>
          </div>
        </div>

        <TitleBlock sheet={sheet?.label ?? "Overview"} />

        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.11em] text-fg-3">
          <span>
            © {new Date().getFullYear()} {site.studio}
          </span>
          <span>Illustrative interfaces and data are labelled as such</span>
        </div>
      </div>
    </footer>
  );
}
