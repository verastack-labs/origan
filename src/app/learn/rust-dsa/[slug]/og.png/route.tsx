import { notFound } from "next/navigation";
import { rustCourse } from "@/data/courses";
import { getLesson, getLessons } from "@/lib/lessons";
import { lessonCard } from "@/lib/og-card";

/** One social card per published lesson, generated at build. */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getLessons(rustCourse).map((lesson) => ({ slug: lesson.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug, rustCourse);
  if (!lesson) notFound();

  return lessonCard({
    kicker: `${rustCourse.name} · ${rustCourse.descriptor} · Lesson ${lesson.order}`,
    title: lesson.title,
    sub: lesson.sub,
  });
}
