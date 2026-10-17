import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHead, section, shell } from "@/components/page-head";
import { HeadingPair } from "@/components/heading-pair";
import { Reveal } from "@/components/reveal";
import { ChaptersLayout, type Chapter } from "@/components/dsa/chapters";
import { ContentsBlock, LessonNav, StudioCredit } from "@/components/dsa/lesson-chrome";
import { componentsFor } from "@/components/dsa/mdx-components";
import { ReadMark, ReadTick } from "@/components/dsa/read-tick";
import { coursePath, courseUrl, navOf, type Course } from "@/data/courses";
import { partOf } from "@/data/rust-dsa";
import { site } from "@/data/site";
import { courseJsonLd, jsonLdScript, lessonJsonLd } from "@/lib/course-jsonld";
import { getLesson, getLessons } from "@/lib/lessons";
import { compileLesson } from "@/lib/mdx";

/**
 * The pages of a course, written once. `src/app/learn/<course>/` holds thin
 * route files that name the course and call these, so DSA in Rust and Java
 * Collections cannot drift apart.
 */

export function indexMetadata(course: Course): Metadata {
  const ogImage = `${course.path}og.png`;
  return {
    title: course.name,
    description: course.description,
    alternates: { canonical: course.path },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: `${course.name} · ${site.name}`,
      description: course.description,
      url: `${site.url}${course.path}`,
      locale: "en_IN",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${course.name}, free lessons` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${course.name} · ${site.name}`,
      description: course.description,
      images: [ogImage],
    },
  };
}

export function lessonMetadata(course: Course, slug: string): Metadata {
  const lesson = getLesson(slug, course);
  if (!lesson) return {};

  const ogImage = `${coursePath(course, slug)}og.png`;
  const title = `${lesson.title} · ${course.name}`;

  return {
    title: lesson.title,
    description: lesson.description,
    alternates: { canonical: coursePath(course, slug) },
    openGraph: {
      type: "article",
      siteName: site.name,
      title,
      description: lesson.description,
      url: courseUrl(course, slug),
      locale: "en_IN",
      modifiedTime: lesson.updated,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${lesson.title}, ${course.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: lesson.description,
      images: [ogImage],
    },
  };
}

const numbers = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];

const capital = (word: string) => word[0].toUpperCase() + word.slice(1);

export function CourseIndex({ course }: { course: Course }) {
  const lessons = getLessons(course);
  const live = new Map(lessons.map((l) => [l.slug, l]));
  const partNumbers = [...new Set(course.curriculum.map(partOf))].sort((a, b) => a - b);

  return (
    <>
      <script
        type="application/ld+json"
        // A literal we build, with `<` escaped; never user input.
        dangerouslySetInnerHTML={{ __html: jsonLdScript(courseJsonLd(course, lessons)) }}
      />

      <PageHead
        notation="Free lessons · Made by VeraStack Labs"
        pair={course.hero}
        cta={false}
        crumbs={[{ label: "Resources", href: "/resources/" }]}
        current={course.name}
      />

      <section id="lessons" className={section}>
        <div className={shell}>
          {partNumbers.map((part, index) => {
            const entries = course.curriculum.filter((entry) => partOf(entry) === part);
            const total = entries.length;
            const ready = entries.filter((entry) => live.has(entry.slug)).length;
            const listing = {
              heading:
                part === 1 ? course.listingHeading : (course.partHeadings?.[part] ?? `Part ${part}`),
              sub: `${capital(numbers[total])} lessons planned. ${capital(numbers[ready])} ${ready === 1 ? "is" : "are"} ready${ready === total ? "" : ", and the rest are coming next"}.`,
            };

            return (
              <div
                key={part}
                id={`part-${part}`}
                className={index === 0 ? "" : "mt-[clamp(48px,7vw,96px)] border-t border-line pt-[clamp(40px,6vw,80px)]"}
              >
                <Reveal variant="label" className="notation">
                  {course.partNames[part]}
                </Reveal>
                <HeadingPair pair={listing} className="mt-3.5" />

                <ol className="mt-[clamp(24px,3.4vw,44px)] overflow-hidden rounded-panel border border-line">
                  {entries.map((entry) => {
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
                            href={coursePath(course, entry.slug)}
                            className={`${row} bg-panel transition-colors hover:bg-panel-2`}
                          >
                            {num}
                            <span className="text-[clamp(17px,1.9vw,20px)] font-semibold tracking-[-0.02em] text-fg">
                              {entry.title}
                            </span>
                            {angle}
                            <span className="col-start-2 md:col-start-auto md:text-right">
                              <ReadMark course={course.id} slug={entry.slug} />
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
            {course.parts.map((part, i) => (
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

          <p className="mt-8 max-w-[60ch] text-[15.5px] text-fg-2">{course.verifiedNote}</p>
          <StudioCredit className="mt-6" />
        </div>
      </section>
    </>
  );
}

export async function LessonView({ course, slug }: { course: Course; slug: string }) {
  const lesson = getLesson(slug, course);
  if (!lesson) notFound();

  const Content = await compileLesson(lesson.body);
  const lessons = getLessons(course);
  const published = new Set(lessons.map((l) => l.slug));
  const chapters: Chapter[] = course.curriculum.map((entry) => ({
    order: entry.order,
    slug: entry.slug,
    title: entry.title,
    part: partOf(entry),
    available: published.has(entry.slug),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        // A literal we build, with `<` escaped; never user input.
        dangerouslySetInnerHTML={{ __html: jsonLdScript(lessonJsonLd(course, lesson)) }}
      />

      <ChaptersLayout
        course={navOf(course)}
        chapters={chapters}
        current={lesson.slug}
        contentClass={`${shell} pb-[clamp(60px,8vw,110px)] pt-[clamp(28px,4vw,52px)]`}
        head={
          <PageHead
            notation={`${course.name} · Lesson ${lesson.order}`}
            pair={{ heading: lesson.title, sub: lesson.sub }}
            cta={false}
            crumbs={[
              { label: "Resources", href: "/resources/" },
              { label: course.name, href: course.path },
            ]}
            current={`Lesson ${lesson.order}`}
          />
        }
      >
        <article className="lesson-article min-w-0">
          <div className="mb-6 flex flex-wrap items-center justify-end gap-x-6 gap-y-2">
            <StudioCredit />
          </div>

          <ContentsBlock parts={course.parts} />

          <Content components={componentsFor(course)} />

          <div className="mt-[clamp(40px,5vw,64px)] flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
            <ReadTick course={course.id} slug={lesson.slug} />
            <p className="font-mono text-[10px] uppercase tracking-[0.11em] text-fg-3">
              Updated {lesson.updated}
            </p>
          </div>

          <div className="mt-8">
            <LessonNav course={course} lesson={lesson} lessons={lessons} />
          </div>

          <StudioCredit className="mt-8" />
        </article>
      </ChaptersLayout>
    </>
  );
}
