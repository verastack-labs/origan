// expect-error: TS2578
// expect-message: Unused '@ts-expect-error' directive.
// region: code
function lineTotal(price: number, quantity: number): number {
  return price * quantity;
}

// @ts-expect-error this was a known problem, and somebody fixed it // @error
console.log(lineTotal(10, 3));
// endregion
export {};
