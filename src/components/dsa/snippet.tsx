import { hasRegion, playgroundCode, region } from "@/lib/snippets";
import { CodeBlock } from "./code-block";

/**
 * A region of the tested crate, shown on the page.
 *
 * `file` is the module (`lesson1_vec`), `name` the region. The Playground gets
 * the snippet plus the `<name>-demo` region as its `main`, if there is one.
 * `also` lists regions the snippet depends on, which go to the Playground but
 * are not repeated on the page, and `demo` names a different demo region.
 * `play={false}` leaves the link off a snippet
 * that cannot run on its own, such as a test module.
 */
export async function Snippet({
  file,
  name,
  also,
  demo: demoRegion,
  play = true,
}: {
  file: string;
  name: string;
  also?: string;
  demo?: string;
  play?: boolean;
}) {
  const code = region(file, name);
  const demoName = demoRegion ?? `${name}-demo`;
  const demo = hasRegion(file, demoName) ? region(file, demoName) : undefined;
  const before = also ? also.split(",").map((r) => region(file, r.trim())) : [];
  const program = play ? playgroundCode([...before, code].join("\n\n"), demo) : undefined;

  return <CodeBlock code={code} lang="rust" program={program} />;
}
