import { CourseIndex, indexMetadata } from "@/components/dsa/course-pages";
import { javaCourse } from "@/data/courses";

export const metadata = indexMetadata(javaCourse);

export default function JavaCollections() {
  return <CourseIndex course={javaCourse} />;
}
