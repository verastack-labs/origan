// expect-error: TS2345
// expect-message: Argument of type 'number' is not assignable to parameter of type 'string'.
// region: code
function shout(text: string): string {
  return text.toUpperCase();
}

console.log(shout("chai"));
console.log(shout(42)); // @error
// endregion
export {};
