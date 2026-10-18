import type { Metadata } from "next";
import { ArticleView, articleMetadata } from "@/components/dsa/ots-pages";
import { getArticles } from "@/lib/articles";

// Only the articles that exist are routes. Anything else is a 404, which a
// static export needs spelled out.
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return articleMetadata(slug);
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  return <ArticleView slug={slug} />;
}
