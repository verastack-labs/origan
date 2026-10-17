import { rustDsa } from "@/data/rust-dsa";
import { lessonCard } from "@/lib/og-card";

/** The social card for the section index. Generated at build, like the site's. */
export const dynamic = "force-static";

export function GET() {
  return lessonCard({
    kicker: "Free lessons",
    title: rustDsa.name,
    sub: "Data structures, taught in Rust, with code that is compiled and tested.",
  });
}
