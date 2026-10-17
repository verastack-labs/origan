import { notFound } from "next/navigation";
import { rustDsa } from "@/data/rust-dsa";
import { getLesson, getLessons } from "@/lib/lessons";
import { lessonCard } from "@/lib/og-card";

/** One social card per published lesson, generated at build. */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getLessons().map((lesson) => ({ slug: lesson.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  return lessonCard({
    kicker: `${rustDsa.name} · Lesson ${lesson.order}`,
    title: lesson.title,
    sub: lesson.sub,
  });
}
