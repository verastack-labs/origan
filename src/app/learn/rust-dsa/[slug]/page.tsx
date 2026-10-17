import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHead, shell } from "@/components/page-head";
import { components } from "@/components/dsa/mdx-components";
import { ContentsBlock, ContentsRail, LessonNav, StudioCredit } from "@/components/dsa/lesson-chrome";
import { ReadTick } from "@/components/dsa/read-tick";
import { lessonPath, lessonUrl, rustDsa } from "@/data/rust-dsa";
import { site } from "@/data/site";
import { getLesson, getLessons } from "@/lib/lessons";
import { compileLesson } from "@/lib/mdx";
import { jsonLdScript, lessonJsonLd } from "@/lib/rust-dsa-jsonld";

// Only the lessons that exist are routes. Anything else is a 404, which a
// static export needs spelled out.
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getLessons().map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) return {};

  const ogImage = `${lessonPath(slug)}og.png`;
  const title = `${lesson.title} · ${rustDsa.name}`;

  return {
    title: lesson.title,
    description: lesson.description,
    alternates: { canonical: lessonPath(slug) },
    openGraph: {
      type: "article",
      siteName: site.name,
      title,
      description: lesson.description,
      url: lessonUrl(slug),
      locale: "en_IN",
      modifiedTime: lesson.updated,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${lesson.title}, ${rustDsa.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: lesson.description,
      images: [ogImage],
    },
  };
}

export default async function LessonPage({ params }: Props) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const Content = await compileLesson(lesson.body);
  const lessons = getLessons();

  return (
    <>
      <script
        type="application/ld+json"
        // A literal we build, with `<` escaped; never user input.
        dangerouslySetInnerHTML={{ __html: jsonLdScript(lessonJsonLd(lesson)) }}
      />

      <PageHead
        notation={`${rustDsa.name} · Lesson ${lesson.order}`}
        pair={{ heading: lesson.title, sub: lesson.sub }}
        cta={false}
      />

      <div className={`${shell} pb-[clamp(60px,8vw,110px)] pt-[clamp(28px,4vw,52px)]`}>
        <div className="grid gap-x-[clamp(32px,5vw,80px)] lg:grid-cols-[minmax(0,720px)_220px] lg:justify-between">
          <article className="min-w-0">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
              <Link
                href={rustDsa.path}
                className="font-mono text-[10.5px] uppercase tracking-[0.11em] text-fg-2 transition-colors hover:text-survey"
              >
                <span aria-hidden="true">← </span>All lessons
              </Link>
              <StudioCredit />
            </div>

            <ContentsBlock />

            <Content components={components} />

            <div className="mt-[clamp(40px,5vw,64px)] flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
              <ReadTick slug={lesson.slug} />
              <p className="font-mono text-[10px] uppercase tracking-[0.11em] text-fg-3">
                Updated {lesson.updated}
              </p>
            </div>

            <div className="mt-8">
              <LessonNav lesson={lesson} lessons={lessons} />
            </div>

            <StudioCredit className="mt-8" />
          </article>

          <aside>
            <ContentsRail />
          </aside>
        </div>
      </div>
    </>
  );
}
