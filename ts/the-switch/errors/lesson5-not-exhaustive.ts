// expect-error: TS2345
// expect-message: Argument of type 'LassiOrder' is not assignable to parameter of type 'never'.
// region: code
type ChaiOrder = { kind: "chai"; sugar: number };
type CoffeeOrder = { kind: "coffee"; strength: "mild" | "strong" };
type LassiOrder = { kind: "lassi"; flavour: string };
type Order = ChaiOrder | CoffeeOrder | LassiOrder;

function assertNever(value: never): never {
  throw new Error("Unserved order: " + JSON.stringify(value));
}

function serve(order: Order): string {
  switch (order.kind) {
    case "chai":
      return "Chai with " + order.sugar + " sugars";
    case "coffee":
      return order.strength + " coffee";
    default:
      return assertNever(order); // @error
  }
}
// endregion
export {};
