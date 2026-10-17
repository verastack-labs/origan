// expect-error: TS2322
// expect-message: Type 'number' is not assignable to type 'object'.
// region: code
const anything: {} = 42;
const onlyObjects: object = 42; // @error
// endregion
export {};
