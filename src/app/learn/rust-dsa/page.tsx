import { CourseIndex, indexMetadata } from "@/components/dsa/course-pages";
import { rustCourse } from "@/data/courses";

export const metadata = indexMetadata(rustCourse);

export default function RustDsa() {
  return <CourseIndex course={rustCourse} />;
}
