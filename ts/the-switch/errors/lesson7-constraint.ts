// expect-error: TS2345
// expect-message: Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.
// region: code
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

console.log(longest("chai", "coffee"));
console.log(longest(10, 20)); // @error
// endregion
export {};
