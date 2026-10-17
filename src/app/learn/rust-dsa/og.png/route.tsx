import { rustCourse } from "@/data/courses";
import { lessonCard } from "@/lib/og-card";

/** The social card for the section index. Generated at build, like the site's. */
export const dynamic = "force-static";

export function GET() {
  return lessonCard({
    kicker: `${rustCourse.descriptor} · Free lessons`,
    title: rustCourse.name,
    sub: rustCourse.summary,
  });
}
