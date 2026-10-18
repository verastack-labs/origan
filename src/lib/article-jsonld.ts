import { articleUrl, indexUrl, offTheSyllabus, seriesOf } from "@/data/off-the-syllabus";
import { liveResources } from "@/data/resources";
import { site } from "@/data/site";
import type { Article } from "@/lib/articles";

/**
 * Structured data for Off the Syllabus, kept as small as the pages are.
 * Every field is something the page already says in words: the headline is
 * the title, the dates are the dates shown, the topics are the topic pills.
 * Nothing here is a claim the page does not make.
 */
const publisher = () => ({
  "@type": "Organization",
  name: offTheSyllabus.provider.name,
  url: offTheSyllabus.provider.url,
});

const collection = () => ({
  "@type": "CollectionPage",
  name: `${offTheSyllabus.name}: ${offTheSyllabus.descriptor}`,
  url: indexUrl(),
});

/** One article, as an Article (the type Google's article guide documents) that is part of the collection. */
export function articleJsonLd(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: articleUrl(article.slug),
    mainEntityOfPage: articleUrl(article.slug),
    image: `${articleUrl(article.slug)}og.png`,
    inLanguage: "en",
    isAccessibleForFree: true,
    datePublished: article.published,
    // "Last checked" is the date every fact was last compared with its source.
    dateModified: article.checked,
    articleSection: seriesOf(article.series).name,
    author: publisher(),
    publisher: publisher(),
    isPartOf: collection(),
    about: article.topics.map((name) => ({ "@type": "Thing", name })),
  };
}

/** The index, as a CollectionPage whose parts are the articles that exist today. */
export function collectionJsonLd(articles: readonly Article[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${offTheSyllabus.name}: ${offTheSyllabus.descriptor}`,
    alternateName: offTheSyllabus.descriptor,
    description: offTheSyllabus.description,
    url: indexUrl(),
    inLanguage: "en",
    isAccessibleForFree: true,
    // The day the collection first went live, from the shelf's own data.
    datePublished: liveResources.find((r) => r.id === "off-the-syllabus")?.published,
    publisher: publisher(),
    hasPart: articles.map((a) => ({
      "@type": "Article",
      headline: a.title,
      url: articleUrl(a.slug),
    })),
  };
}

/** Origan > Resources > Off the Syllabus, and the article on an article page. */
export function otsBreadcrumbJsonLd(article?: Article) {
  const trail = [
    { name: site.name, url: `${site.url}/` },
    { name: "Resources", url: `${site.url}/resources/` },
    { name: offTheSyllabus.name, url: indexUrl() },
    ...(article ? [{ name: article.title, url: articleUrl(article.slug) }] : []),
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: step.name,
      item: step.url,
    })),
  };
}
