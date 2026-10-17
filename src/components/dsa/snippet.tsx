import { rustCourse, type Course } from "@/data/courses";
import { region, snippetProgram } from "@/lib/snippets";
import { CodeBlock } from "./code-block";

/**
 * A region of the tested crate, shown on the page.
 *
 * `file` is the module (`lesson1_vec`), `name` the region. The Playground gets
 * the snippet plus the `<name>-demo` region as its `main`, if there is one.
 * `also` lists regions the snippet depends on, which go to the Playground but
 * are not repeated on the page, and `demo` names a different demo region.
 * `play={false}` leaves the link off a snippet
 * that cannot run on its own, such as a test module. Only Rust has a
 * Playground; a Java snippet gets the jshell tip from the code block.
 */
export async function Snippet({
  file,
  name,
  also,
  demo: demoRegion,
  play = true,
  course = rustCourse,
  tip = true,
}: {
  file: string;
  name: string;
  also?: string;
  demo?: string;
  play?: boolean;
  course?: Course;
  /** Java: set false for a whole program that is saved and compiled, not pasted. */
  tip?: boolean;
}) {
  const source = course.snippets;
  const code = region(file, name, source);

  if (course.language === "java") return <CodeBlock code={code} lang="java" tip={tip} />;

  // The same function the Playground check compiles, so the check tests the real links.
  const program = snippetProgram({ file, name, also, demo: demoRegion, play }, source);

  return <CodeBlock code={code} lang="rust" program={program} />;
}
