/**
 * The steps of the narrowing stepper in lesson 5: which lines of the chai
 * stall's `serve` function to light up, and what type `order` has at that point.
 *
 * The types shown are not written from memory. `narrowing-steps.test.ts` asks
 * the TypeScript compiler for the type of the named expression on the named
 * line, under `strict`, and fails if it disagrees with what is written here.
 * Lines are found by their text, so editing the snippet without updating the
 * steps fails loudly instead of lighting up the wrong line.
 */
export type StepSpec = {
  /** The lines to light up, by their text (trimmed). */
  show: string[];
  /** The line to ask the compiler about, by its text (trimmed). */
  probe: string;
  /** The expression on that line whose type is shown, such as `order` or `order.kind`. */
  expr: string;
  /** The type the compiler prints for it. */
  type: string;
  /** When the type is a union, its members as the compiler lists them. */
  members?: string;
  /** One plain sentence about what just happened. */
  note: string;
};

export const stepSpecs: readonly StepSpec[] = [
  {
    show: ["function serve(order: Order): string {"],
    probe: "function serve(order: Order): string {",
    expr: "order",
    type: "Order",
    members: "ChaiOrder | CoffeeOrder | LassiOrder",
    note: "Before any check, order could be any of the three kinds.",
  },
  {
    show: ["switch (order.kind) {"],
    probe: "switch (order.kind) {",
    expr: "order.kind",
    type: '"chai" | "coffee" | "lassi"',
    note: "The switch looks at kind. Each kind is an exact word, so each case can tell the options apart.",
  },
  {
    show: ['case "chai":', 'return "Chai with " + order.sugar + " sugars";'],
    probe: 'return "Chai with " + order.sugar + " sugars";',
    expr: "order",
    type: "ChaiOrder",
    note: 'Inside case "chai", the kind must be "chai", so order is a ChaiOrder. That is why order.sugar is allowed.',
  },
  {
    show: ['case "coffee":', 'return order.strength + " coffee";'],
    probe: 'return order.strength + " coffee";',
    expr: "order",
    type: "CoffeeOrder",
    note: "The chai option is already used up, so here it is a CoffeeOrder, and order.strength is allowed.",
  },
  {
    show: ['case "lassi":', 'return order.flavour + " lassi";'],
    probe: 'return order.flavour + " lassi";',
    expr: "order",
    type: "LassiOrder",
    note: "Only one option is left, so order is a LassiOrder.",
  },
  {
    show: ["default:", "return assertNever(order);"],
    probe: "return assertNever(order);",
    expr: "order",
    type: "never",
    note: "Every kind has been handled, so nothing is left. order is never, which assertNever accepts. Forget a case above and this line turns red.",
  },
];

export type NarrowingStep = {
  /** Zero-based line numbers to light up. */
  lines: number[];
  expr: string;
  type: string;
  members?: string;
  note: string;
};

/** The zero-based index of the one line whose trimmed text is `text`. Throws if there is not exactly one. */
export function lineIndex(code: string, text: string): number {
  const found = code
    .split("\n")
    .map((line, i) => (line.trim() === text ? i : -1))
    .filter((i) => i >= 0);
  if (found.length !== 1) throw new Error(`narrowing stepper: expected exactly one line "${text}", found ${found.length}`);
  return found[0];
}

export function narrowingSteps(code: string): NarrowingStep[] {
  return stepSpecs.map((spec) => ({
    lines: spec.show.map((text) => lineIndex(code, text)),
    expr: spec.expr,
    type: spec.type,
    members: spec.members,
    note: spec.note,
  }));
}
