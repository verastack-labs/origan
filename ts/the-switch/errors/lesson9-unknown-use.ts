// expect-error: TS18046
// expect-message: 'value' is of type 'unknown'.
// region: code
function shout(value: unknown): string {
  return value.toUpperCase(); // @error
}
// endregion
export {};
