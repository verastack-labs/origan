import { playgroundCode, snippetProgram, type SnippetProps } from "./snippets";

/** One Playground link on a lesson page, with enough to say where it came from. */
export type PlaygroundProgram = { label: string; program: string };

const attr = (text: string, key: string) => new RegExp(`(?:^|\\s)${key}="([^"]*)"`, "m").exec(text)?.[1];

function snippetProps(tag: string): SnippetProps | undefined {
  const file = attr(tag, "file");
  const name = attr(tag, "name");
  if (!file || !name) return undefined;
  return {
    file,
    name,
    also: attr(tag, "also"),
    demo: attr(tag, "demo"),
    play: !/play=\{false\}/.test(tag),
  };
}

/**
 * Every Playground program on a lesson page: each `<Snippet>`, the starter and
 * the solution of each `<Practice>`, and any fenced `rust` block.
 */
export function playgroundPrograms(mdx: string, page: string): PlaygroundProgram[] {
  const out: PlaygroundProgram[] = [];
  const add = (label: string, props: SnippetProps) => {
    const program = snippetProgram(props);
    if (program) out.push({ label: `${page}: ${label}`, program });
  };

  for (const m of mdx.matchAll(/<Snippet\s+([\s\S]*?)\/>/g)) {
    const props = snippetProps(m[1]);
    if (props) add(props.name, props);
  }

  for (const m of mdx.matchAll(/<Practice\b([\s\S]*?)<\/Practice>/g)) {
    // The attributes sit one per line at the start of the tag, before the hints.
    const head = m[1];
    const file = attr(head, "file");
    const start = attr(head, "start");
    const solution = attr(head, "solution");
    const also = attr(head, "also");
    if (!file || !start || !solution) continue;
    add(start, { file, name: start, also });
    add(solution, { file, name: solution, also });
  }

  for (const m of mdx.matchAll(/^```rust\n([\s\S]*?)\n```$/gm)) {
    out.push({ label: `${page}: fenced rust block`, program: playgroundCode(m[1]) });
  }
  return out;
}
