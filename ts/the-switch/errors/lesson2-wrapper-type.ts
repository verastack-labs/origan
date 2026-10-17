// expect-error: TS2345
// expect-message: Argument of type 'String' is not assignable to parameter of type 'string'. 'string' is a primitive, but 'String' is a wrapper object. Prefer using 'string' when possible.
// region: code
function shout(text: string): string {
  return text.toUpperCase();
}

const label: String = "Chai";
shout(label); // @error
// endregion
export {};
