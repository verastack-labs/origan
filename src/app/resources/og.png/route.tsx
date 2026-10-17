import { resourcesPage } from "@/data/resources";
import { lessonCard } from "@/lib/og-card";

/** The social card for The Open Shelf. Generated at build, like the courses' cards. */
export const dynamic = "force-static";

export function GET() {
  return lessonCard({
    kicker: "Free courses",
    title: resourcesPage.notation,
    sub: resourcesPage.card,
  });
}
