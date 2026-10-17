// expect-error: TS2339
// expect-message: Property 'sugar' does not exist on type 'Order'. Property 'sugar' does not exist on type 'CoffeeOrder'.
// region: code
type ChaiOrder = { kind: "chai"; sugar: number };
type CoffeeOrder = { kind: "coffee"; strength: "mild" | "strong" };
type Order = ChaiOrder | CoffeeOrder;

function describeOrder(order: Order): string {
  return order.kind + ": " + order.sugar + " sugars"; // @error
}

console.log(describeOrder({ kind: "chai", sugar: 2 }));
console.log(describeOrder({ kind: "coffee", strength: "strong" }));
// endregion
export {};
