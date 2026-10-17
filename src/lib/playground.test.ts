import { execFile, spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { playgroundPrograms } from "./playground";

const DIR = join(process.cwd(), "src", "content", "learn", "rust-dsa");
const pages = readdirSync(DIR).filter((f) => f.endsWith(".mdx"));

describe("playgroundPrograms", () => {
  it("finds the link of every snippet and practice problem", () => {
    const mdx = [
      '<Snippet file="lesson0_setup" name="add" />',
      '<Snippet file="lesson0_setup" name="add" play={false} />',
      '<Practice',
      '  number={1}',
      '  file="lesson7_tree"',
      '  also="tree-node"',
      '  start="max-depth-start"',
      '  solution="max-depth"',
      '  hints={["a -> b"]}',
      '>',
      'Text',
      '</Practice>',
    ].join("\n");
    const found = playgroundPrograms(mdx, "x");
    expect(found.map((p) => p.label)).toEqual(["x: add", "x: max-depth-start", "x: max-depth"]);
  });
});

// Compiling needs rustc, so this runs where RUST_PLAYGROUND=1 is set: locally
// with `pnpm check:playground`, and in the CI job that already has Rust.
describe.skipIf(!process.env.RUST_PLAYGROUND)("Playground links compile on their own", () => {
  it(
    "every program on every lesson page builds with rustc",
    async () => {
      const probe = spawnSync("rustc", ["--version"]);
      expect(probe.status, "rustc must be on the PATH").toBe(0);

      const programs = pages.flatMap((page) =>
        playgroundPrograms(readFileSync(join(DIR, page), "utf8"), page.replace(/\.mdx$/, "")),
      );
      expect(programs.length).toBeGreaterThan(20);

      const work = mkdtempSync(join(tmpdir(), "playground-"));
      const failures: string[] = [];
      let next = 0;

      const compile = (index: number) =>
        new Promise<void>((done) => {
          const src = join(work, `p${index}.rs`);
          writeFileSync(src, programs[index].program);
          // Warnings are fine: starters hold todo!() on purpose.
          execFile(
            "rustc",
            ["--edition", "2021", "-A", "warnings", "-o", join(work, `p${index}.out`), src],
            (error, _out, stderr) => {
              if (error) failures.push(`${programs[index].label}\n${stderr.split("\n").slice(0, 8).join("\n")}`);
              done();
            },
          );
        });

      const worker = async () => {
        while (next < programs.length) await compile(next++);
      };
      await Promise.all(Array.from({ length: 4 }, worker));
      rmSync(work, { recursive: true, force: true });

      expect(failures, failures.join("\n\n")).toEqual([]);
    },
    600_000,
  );
});
