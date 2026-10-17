import { evaluate, type EvaluateOptions } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";

/**
 * Compile a lesson's MDX to a React component, at build time.
 *
 * Done with `@mdx-js/mdx` directly rather than through `@next/mdx`, because the
 * lessons are content read from a folder and rendered by one dynamic route,
 * not files that are routes themselves. Every route that calls this is
 * prerendered, so nothing is compiled in the browser.
 */
export async function compileLesson(body: string) {
  const { default: Content } = await evaluate(body, {
    ...(runtime as unknown as EvaluateOptions),
    remarkPlugins: [remarkGfm],
  });
  return Content;
}
