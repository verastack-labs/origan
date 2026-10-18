import type { Metadata } from "next";
import { LessonView, lessonMetadata } from "@/components/dsa/course-pages";
import { rustCourse } from "@/data/courses";
import { getLessons } from "@/lib/lessons";

// Only the lessons that exist are routes. Anything else is a 404, which a
// static export needs spelled out.
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getLessons(rustCourse).map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return lessonMetadata(rustCourse, slug);
}

export default async function LessonPage({ params }: Props) {
  const { slug } = await params;
  return <LessonView course={rustCourse} slug={slug} />;
}
