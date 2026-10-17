import { codeToHtml } from "shiki";
import { narrowingSteps } from "@/lib/narrowing-steps";
import { region } from "@/lib/snippets";
import { TS_SOURCE } from "@/lib/ts-snippets";
import { NarrowingStepperView } from "./narrowing-stepper-view";
import { theme } from "./ts-code";

/**
 * Lesson 5's chai stall, stepped through one branch at a time. Next and Back
 * move through the `switch`, and at each step the current lines are lit and
 * the type of `order` at that point is shown.
 *
 * The code is the lesson's own `exhaustive` region, and the types come from
 * `src/lib/narrowing-steps.ts`, which a test checks against the compiler. All
 * of that is settled here, at build time. The client half is only the buttons.
 */
export async function NarrowingStepper({ file = "lesson5-unions", name = "exhaustive" }: { file?: string; name?: string }) {
  const code = region(file, name, TS_SOURCE);
  const steps = narrowingSteps(code);
  // Step one is what a reader sees before any script has run, so its lines are lit in the markup.
  const first = new Set(steps[0].lines);

  const html = await codeToHtml(code, {
    lang: "typescript",
    theme,
    transformers: [
      {
        line(node, line) {
          if (first.has(line - 1)) this.addClassToHast(node, "is-on");
        },
        // Lines are blocks here, so the newline between them would be a second line break.
        code(node) {
          node.children = node.children.filter((child) => !(child.type === "text" && child.value === "\n"));
        },
      },
    ],
  });

  return <NarrowingStepperView html={html} steps={steps} />;
}
