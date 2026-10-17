// expect-error: TS2554
// expect-message: Expected 2 arguments, but got 1.
// region: code
function addGst(price: number, rate: number): number {
  return price + price * rate;
}

console.log(addGst(100)); // @error
// endregion
export {};
