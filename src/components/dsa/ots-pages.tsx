import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleHead, PageHead, sectionCompact, shell } from "@/components/page-head";
import { HeadingPair } from "@/components/heading-pair";
import { Reveal } from "@/components/reveal";
import { ChaptersLayout, type Chapter, type ChaptersNav, type PartsBySlug } from "@/components/dsa/chapters";
import { LessonArticle } from "@/components/dsa/lesson-article";
import { ContentsBlock, StudioCredit } from "@/components/dsa/lesson-chrome";
import { inlineCode } from "@/components/dsa/inline-code";
import { ProseLink } from "@/components/dsa/prose-link";
import { articleComponents } from "@/components/dsa/mdx-components";
import {
  articlePath,
  articleUrl,
  offTheSyllabus,
  otsPlan,
  otsSeries,
  seriesOf,
} from "@/data/off-the-syllabus";
import { site } from "@/data/site";
import { articleJsonLd, collectionJsonLd, otsBreadcrumbJsonLd } from "@/lib/article-jsonld";
import { getArticle, getArticles, headingsOf, nextInSeries, readMinutes, type Article } from "@/lib/articles";
import { jsonLdScript } from "@/lib/course-jsonld";
import { compileLesson } from "@/lib/mdx";

/**
 * The pages of Off the Syllabus, written once. `src/app/learn/off-the-syllabus/`
 * holds thin route files that call these.
 *
 * An article is not a lesson, so none of the lesson machinery's seven parts or
 * read ticks is here. What is shared is the chapters sidebar, the page head,
 * the code blocks and the diagrams.
 */

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** 2026-10-18 as "18 October 2026". Done by hand so the build and the browser can never disagree. */
export function longDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${months[month - 1]} ${year}`;
}

// --- metadata ----------------------------------------------------------------------------

export function otsIndexMetadata(): Metadata {
  const ogImage = `${offTheSyllabus.path}og.png`;
  const title = `${offTheSyllabus.name} · ${offTheSyllabus.descriptor}`;
  return {
    title,
    description: offTheSyllabus.description,
    alternates: { canonical: offTheSyllabus.path },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: `${title} · ${site.name}`,
      description: offTheSyllabus.description,
      url: `${site.url}${offTheSyllabus.path}`,
      locale: "en_IN",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${offTheSyllabus.name}: free articles on the web and its tools` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${site.name}`,
      description: offTheSyllabus.description,
      images: [ogImage],
    },
  };
}

export function articleMetadata(slug: string): Metadata {
  const article = getArticle(slug);
  if (!article) return {};

  const ogImage = `${articlePath(slug)}og.png`;
  // The page title gets " · Origan" added by the layout, so keep the collection only while it fits.
  const withCollection = `${article.title} · ${offTheSyllabus.name}`;
  const title = withCollection.length <= 51 ? withCollection : article.title;

  return {
    title,
    description: article.description,
    alternates: { canonical: articlePath(slug) },
    openGraph: {
      type: "article",
      siteName: site.name,
      title,
      description: article.description,
      url: articleUrl(slug),
      locale: "en_IN",
      publishedTime: article.published,
      modifiedTime: article.checked,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${article.title}, ${offTheSyllabus.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: article.description,
      images: [ogImage],
    },
  };
}

// --- the index ------------------------------------------------------------------------------

const heroPair = {
  heading: offTheSyllabus.heading,
  sub: `${offTheSyllabus.tagline} Free, stand-alone, and every claim links to its source.`,
};

export function OtsIndex() {
  const articles = getArticles();
  const live = new Map(articles.map((a) => [a.slug, a]));
  const topics = [...new Set(articles.flatMap((a) => a.topics))];

  return (
    <>
      <script
        type="application/ld+json"
        // A literal we build, with `<` escaped; never user input.
        dangerouslySetInnerHTML={{ __html: jsonLdScript([collectionJsonLd(articles), otsBreadcrumbJsonLd()]) }}
      />

      <PageHead
        notation={`${offTheSyllabus.descriptor} · Free articles`}
        pair={heroPair}
        cta={false}
        compact
        crumbs={[{ label: "Resources", href: "/resources/" }]}
        current={offTheSyllabus.name}
      />

      <section id="articles" className={sectionCompact}>
        <div className={shell}>
          <Reveal variant="label" className="notation">
            Topics
          </Reveal>
          <ul aria-label="Topics covered" className="mt-4 flex max-w-[72ch] flex-wrap gap-1.5">
            {topics.map((topic) => (
              <li
                key={topic}
                className="rounded-full border border-line px-2.5 py-[3px] font-mono text-[11px] tracking-[0.02em] text-fg-2"
              >
                {topic}
              </li>
            ))}
          </ul>

          {otsSeries.map((series, index) => {
            const entries = otsPlan.filter((e) => e.series === series.id);
            return (
              <div
                key={series.id}
                id={series.id}
                className="mt-[clamp(40px,6vw,80px)] border-t border-line pt-[clamp(32px,5vw,64px)]"
              >
                <Reveal variant="label" className="notation">
                  {`Series ${index + 1} of ${otsSeries.length}`}
                </Reveal>
                <HeadingPair pair={{ heading: series.heading, sub: series.sub }} className="mt-3.5" />

                <ol className="mt-[clamp(24px,3.4vw,44px)] overflow-hidden rounded-panel border border-line">
                  {entries.map((entry) => {
                    const article = live.get(entry.slug);
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
                        {article ? (
                          <Link href={articlePath(entry.slug)} className={`${row} bg-panel transition-colors hover:bg-panel-2`}>
                            {num}
                            <span className="text-[clamp(17px,1.9vw,20px)] font-semibold tracking-[-0.02em] text-fg">
                              {entry.title}
                            </span>
                            {angle}
                            <span className="col-start-2 font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3 md:col-start-auto md:text-right">
                              {readMinutes(article)} min read
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
            );
          })}

          <p className="mt-[clamp(40px,6vw,72px)] max-w-[60ch] text-[15.5px] text-fg-2">
            Each article says when its facts were last checked, and links the official page behind every claim. Where
            a tool changes often, such as a pricing page, check the date before you trust it. Every code sample is a
            real file that is checked before the page is built.
          </p>
          <StudioCredit className="mt-6" />
        </div>
      </section>
    </>
  );
}

// --- an article --------------------------------------------------------------------------------

/** What the chapters sidebar lists: the whole plan, grouped by series, with the unwritten ones dimmed. */
function chaptersOf(published: ReadonlySet<string>): Chapter[] {
  return otsPlan.map((entry) => ({
    order: entry.order,
    slug: entry.slug,
    title: entry.title,
    part: 1,
    available: published.has(entry.slug),
    group: seriesOf(entry.series).name,
  }));
}

function ShortVersion({ lines }: { lines: readonly string[] }) {
  return (
    <aside
      aria-labelledby="short-version"
      className="my-6 rounded-panel border border-line border-l-2 border-l-survey bg-panel px-[clamp(16px,2.4vw,24px)] py-4"
    >
      <p id="short-version" className="notation">
        The short version
      </p>
      <ul className="mt-3 grid list-disc gap-2 pl-5 text-[17px] leading-[1.6] text-fg marker:text-survey-2">
        {lines.map((line) => (
          <li key={line}>{inlineCode(line)}</li>
        ))}
      </ul>
    </aside>
  );
}

function Sources({ article }: { article: Article }) {
  return (
    <section aria-labelledby="sources" className="mt-[clamp(40px,5.4vw,64px)] border-t border-line pt-[clamp(28px,4vw,44px)]">
      <h2
        id="sources"
        className="mb-2 scroll-mt-[132px] text-[clamp(22px,2.6vw,30px)] font-bold leading-[1.15] tracking-[-0.03em] text-fg lg:scroll-mt-[88px]"
      >
        Sources
      </h2>
      <p className="text-[15.5px] text-fg-2">
        Every fact above was compared with these pages on {longDate(article.checked)}.
      </p>
      <ul className="mt-4 grid gap-2.5">
        {article.sources.map((source) => (
          <li key={source.url} className="text-[16px] leading-snug">
            <ProseLink href={source.url}>{source.title}</ProseLink>
            <span className="mt-0.5 block font-mono text-[11px] tracking-[0.02em] text-fg-3 [overflow-wrap:anywhere]">
              {new URL(source.url).host}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function NextInSeries({ article, published }: { article: Article; published: ReadonlySet<string> }) {
  const next = nextInSeries(article.slug, published);
  const cell = "block h-full bg-panel p-[clamp(16px,2.2vw,24px)]";
  const title = "mt-2 block text-[17px] font-semibold tracking-[-0.01em]";

  return (
    <nav aria-label="Next in this series" className="overflow-hidden rounded-panel border border-line">
      {next.kind === "article" ? (
        <Link href={articlePath(next.entry.slug)} rel="next" scroll={false} className={`${cell} transition-colors hover:bg-panel-2`}>
          <span className="notation">Next in this series</span>
          <span className={`${title} text-fg`}>{next.entry.title}</span>
          <span className="mt-1 block text-[14.5px] text-fg-2">{next.entry.angle}</span>
        </Link>
      ) : next.kind === "coming" ? (
        <div className={cell}>
          <span className="notation">Next in this series, coming next</span>
          <span className={`${title} text-fg-2`}>{next.entry.title}</span>
          <span className="mt-1 block text-[14.5px] text-fg-3">{next.entry.angle}</span>
        </div>
      ) : (
        <Link href={`${offTheSyllabus.path}#${next.series.id}`} className={`${cell} transition-colors hover:bg-panel-2`}>
          <span className="notation">End of the series</span>
          <span className={`${title} text-fg`}>That was the last one in {next.series.name}</span>
          <span className="mt-1 block text-[14.5px] text-fg-2">See the other series</span>
        </Link>
      )}
    </nav>
  );
}

const headingsWithSources = (article: Article) => [...headingsOf(article.body), { id: "sources", label: "Sources" }];

/**
 * The layout every article shares, above `[slug]` in a route group, so the
 * sidebar stays mounted while the article beside it is replaced.
 */
export function ArticlesShell({ children }: { children: ReactNode }) {
  const articles = getArticles();
  const published = new Set(articles.map((a) => a.slug));
  const nav: ChaptersNav = {
    id: "off-the-syllabus",
    name: offTheSyllabus.name,
    descriptor: offTheSyllabus.descriptor,
    path: offTheSyllabus.path,
    partNames: {},
    kicker: "Free articles",
    reads: false,
  };
  const partsBySlug: PartsBySlug = Object.fromEntries(articles.map((a) => [a.slug, headingsWithSources(a)]));

  return (
    <ChaptersLayout
      course={nav}
      chapters={chaptersOf(published)}
      partsBySlug={partsBySlug}
      contentClass={`${shell} pb-[clamp(60px,8vw,110px)] pt-[clamp(28px,4vw,52px)]`}
    >
      {children}
    </ChaptersLayout>
  );
}

export async function ArticleView({ slug }: { slug: string }) {
  const article = getArticle(slug);
  if (!article) notFound();

  const Content = await compileLesson(article.body);
  const articles = getArticles();
  const published = new Set(articles.map((a) => a.slug));
  const series = seriesOf(article.series);
  const headings = headingsWithSources(article);

  return (
    <>
      <script
        type="application/ld+json"
        // A literal we build, with `<` escaped; never user input.
        dangerouslySetInnerHTML={{ __html: jsonLdScript([articleJsonLd(article), otsBreadcrumbJsonLd(article)]) }}
      />

      <LessonArticle title={article.title}>
        <ArticleHead
          notation={`${offTheSyllabus.name} · ${series.name}`}
          pair={{ heading: article.title, sub: article.sub }}
          crumbs={[
            { label: "Resources", href: "/resources/" },
            { label: offTheSyllabus.name, href: offTheSyllabus.path },
          ]}
          current={`Article ${article.order}`}
          meta={
            <p className="flex flex-wrap items-center gap-x-5 gap-y-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-fg-3">
              <span>{readMinutes(article)} min read</span>
              <span aria-hidden="true" className="hidden h-3 w-px bg-line sm:block" />
              <span>
                Last checked <time dateTime={article.checked}>{longDate(article.checked)}</time>
              </span>
            </p>
          }
        />

        <div className="mb-6 flex flex-wrap items-center justify-end gap-x-6 gap-y-2">
          <StudioCredit />
        </div>

        <ContentsBlock parts={headings} />

        <ShortVersion lines={article.short} />

        <Content components={articleComponents()} />

        <Sources article={article} />

        <div className="mt-[clamp(32px,4vw,48px)]">
          <NextInSeries article={article} published={published} />
        </div>

        <StudioCredit className="mt-8" />
      </LessonArticle>
    </>
  );
}
