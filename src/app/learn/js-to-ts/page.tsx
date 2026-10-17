import { CourseIndex, indexMetadata } from "@/components/dsa/course-pages";
import { switchCourse } from "@/data/courses";

export const metadata = indexMetadata(switchCourse);

export default function TheSwitch() {
  return <CourseIndex course={switchCourse} />;
}
