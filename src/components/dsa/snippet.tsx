import { rustCourse, type Course } from "@/data/courses";
import { region, snippetProgram } from "@/lib/snippets";
import { JS_SOURCE } from "@/lib/ts-snippets";
import { CodeBlock } from "./code-block";
import { TsBlock } from "./ts-code";

/**
 * A region of the tested crate, shown on the page.
 *
 * `file` is the module (`lesson1_vec`), `name` the region. The Playground gets
 * the snippet plus the `<name>-demo` region as its `main`, if there is one.
 * `also` lists regions the snippet depends on, which go to the Playground but
 * are not repeated on the page, and `demo` names a different demo region.
 * `play={false}` leaves the link off a snippet
 * that cannot run on its own, such as a test module. Rust has its Playground,
 * TypeScript has the TypeScript Playground, and a Java snippet gets the jshell
 * tip from the code block.
 */
export async function Snippet({
  file,
  name,
  also,
  demo: demoRegion,
  play = true,
  course = rustCourse,
  tip = true,
  js = false,
}: {
  file: string;
  name: string;
  also?: string;
  demo?: string;
  play?: boolean;
  course?: Course;
  /** Java: set false for a whole program that is saved and compiled, not pasted. */
  tip?: boolean;
  /** The Switch: show the plain JavaScript version of the region instead of the TypeScript one. */
  js?: boolean;
}) {
  const source = course.snippets;

  if (course.language === "typescript") {
    const text = region(file, name, js ? JS_SOURCE : source);
    return <TsBlock code={text} lang={js ? "javascript" : "typescript"} play={play} />;
  }
  const code = region(file, name, source);

  if (course.language === "java") return <CodeBlock code={code} lang="java" tip={tip} />;

  // The same function the Playground check compiles, so the check tests the real links.
  const program = snippetProgram({ file, name, also, demo: demoRegion, play }, source);

  return <CodeBlock code={code} lang="rust" program={program} />;
}
