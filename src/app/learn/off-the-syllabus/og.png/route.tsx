import { offTheSyllabus } from "@/data/off-the-syllabus";
import { lessonCard } from "@/lib/og-card";

/** The social card for the collection index. Generated at build, like the site's. */
export const dynamic = "force-static";

export function GET() {
  return lessonCard({
    // The descriptor rides in the kicker so the title stays big enough to read in a feed.
    kicker: `${offTheSyllabus.descriptor} · Free articles`,
    title: offTheSyllabus.name,
    sub: offTheSyllabus.summary,
  });
}
