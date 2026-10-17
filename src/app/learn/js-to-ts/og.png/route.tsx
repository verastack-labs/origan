import { switchCourse } from "@/data/courses";
import { lessonCard } from "@/lib/og-card";

/** The social card for the section index. Generated at build, like the site's. */
export const dynamic = "force-static";

export function GET() {
  return lessonCard({
    // The descriptor rides in the kicker so the title stays big enough to read in a feed.
    kicker: `${switchCourse.descriptor} · Free lessons`,
    title: switchCourse.name,
    sub: switchCourse.summary,
  });
}
