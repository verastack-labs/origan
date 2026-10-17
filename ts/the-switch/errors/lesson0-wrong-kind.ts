// expect-error: TS2345
// expect-message: Argument of type 'string' is not assignable to parameter of type 'number'.
// region: code
function doubleIt(n: number): number {
  return n + n;
}

console.log(doubleIt("21")); // @error
// endregion
export {};
