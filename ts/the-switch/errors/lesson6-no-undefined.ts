// expect-error: TS2322
// expect-message: Type 'undefined' is not assignable to type 'string'.
// region: code
function firstWord(text: string): string {
  const space = text.indexOf(" ");
  if (space === -1) {
    return undefined; // @error
  }
  return text.slice(0, space);
}
// endregion
export {};
