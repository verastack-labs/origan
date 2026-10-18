import { notFound } from "next/navigation";
import { offTheSyllabus, seriesOf } from "@/data/off-the-syllabus";
import { getArticle, getArticles } from "@/lib/articles";
import { lessonCard } from "@/lib/og-card";

/** One social card per published article, generated at build. */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getArticles().map((article) => ({ slug: article.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return lessonCard({
    kicker: `${offTheSyllabus.name} · ${seriesOf(article.series).name}`,
    title: article.title,
    sub: article.sub,
  });
}
