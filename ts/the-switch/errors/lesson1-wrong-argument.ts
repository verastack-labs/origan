// expect-error: TS2345
// expect-message: Argument of type 'number' is not assignable to parameter of type 'string'.
// region: code
function shout(message: string): string {
  return message.toUpperCase() + "!";
}

console.log(shout(42)); // @error
// endregion
export {};
