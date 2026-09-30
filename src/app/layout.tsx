import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Archivo, Azeret_Mono } from "next/font/google";
import { site } from "@/data/site";
import { JsonLd } from "@/components/json-ld";
import { SiteNav } from "@/components/site-nav";
import { SectionIndex } from "@/components/section-index";
import { PageTransition } from "@/components/page-transition";
import "./globals.css";

/**
 * Archivo carries the display voice. Azeret Mono carries every piece of
 * notation: chainage readouts, section labels, data columns. Both are
 * self-hosted by next/font at build time, so the static export has no
 * runtime dependency on Google.
 */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const azeret = Azeret_Mono({
  variable: "--font-azeret",
  subsets: ["latin"],
  display: "swap",
});

const DIRECTION_CONTRACT = `<!--
THESIS: Preparation is a distance, and Origan marks the ground the whole way. Refuses the
edtech hero with its gradient, stock students and feature cards, and refuses the generic
dark SaaS page, by committing to survey drawing as the page's working language.
OWN-WORLD: Ink-green ground in three steps, contour linework marched from a height function
at build time and drifting continuously, survey mint as the only saturated colour, two rule
weights, 2-3px radii. Archivo for display, Azeret Mono for all notation. Bordered panels,
never cards.
STORY: A dean reads four years as measured ground with named halts, operates the profile and
the student surface, and asks for a conversation.
FIRST VIEWPORT: Drifting contour field under a radial mask, 96px statement at lower left,
two controls beneath it. A live chainage readout in the nav tracks scroll position.
FORM: Survey and levelling notation. Candidate 5 of 7, chosen after an external roll.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    locale: "en_IN",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name}. ${site.tagline}.` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  // Search Console verification. Set GOOGLE_SITE_VERIFICATION in the Pages
  // workflow once the property exists; until then the tag is simply omitted
  // rather than shipped empty, which Google treats as a failed check.
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

// Typed explicitly rather than with Next's generated `LayoutProps`, which
// only exists after a build has run. CI typechecks before building, so
// depending on it makes the check fail on a clean checkout.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${azeret.variable} h-full antialiased`}
      // Set before first paint so the reveal styles can hide content only when
      // there is JavaScript to bring it back. Without this the hiding class
      // arrives in an effect, and every heading paints, vanishes, then
      // animates in, which reads as a bug rather than as an entrance.
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body className="min-h-full">
        {/* The direction contract, emitted into the built markup so it can be
            audited against the render rather than only against intent. */}
        <div hidden dangerouslySetInnerHTML={{ __html: DIRECTION_CONTRACT }} />
        <JsonLd />
        {/* The header and the section index live here rather than in each
            page, so navigating between sheets does not tear them down and
            rebuild them. Only the content between them changes. */}
        <SiteNav />
        <PageTransition>{children}</PageTransition>
        <SectionIndex />
      </body>
    </html>
  );
}
