import type { ReactNode } from "react";
import { CourseLessonsShell } from "@/components/dsa/course-pages";
import { switchCourse } from "@/data/courses";

// The chapters sidebar lives here, above `[slug]`, so it is not rebuilt when
// the reader moves from one lesson to the next.
export default function LessonsLayout({ children }: { children: ReactNode }) {
  return <CourseLessonsShell course={switchCourse}>{children}</CourseLessonsShell>;
}
