import { site } from "@/data/site";

/**
 * Structured data, kept deliberately thin.
 *
 * Only facts that are true today. No `offers`, because there is no public
 * price. No `aggregateRating` or `review`, because there are no customers. An
 * inflated graph is worse than a small one: search engines discount markup that
 * does not match the page, and an answer engine will happily repeat a number
 * that was invented to fill a schema field.
 */
export function JsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#studio`,
        name: site.studio,
        url: site.studioUrl,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bangalore",
          addressCountry: "IN",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: `${site.url}/`,
        name: site.name,
        description: site.description,
        publisher: { "@id": `${site.url}/#studio` },
        inLanguage: "en-IN",
      },
      {
        "@type": "Service",
        "@id": `${site.url}/#service`,
        name: site.name,
        serviceType: "Software placement preparation partnership",
        description: site.description,
        provider: { "@id": `${site.url}/#studio` },
        areaServed: { "@type": "Country", name: "India" },
        audience: {
          "@type": "EducationalAudience",
          educationalRole: "student",
          audienceType: "Engineering college students preparing for software placements",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Structured data must be a script tag to be read, and the content is a
      // literal we construct, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
