// expect-error: TS7006
// expect-message: Parameter 'n' implicitly has an 'any' type.
// region: code
function double(n) { // @error
  return n * 2;
}
// endregion
export {};
