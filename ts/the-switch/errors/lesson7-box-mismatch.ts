// expect-error: TS2322
// expect-message: Type 'string' is not assignable to type 'number'.
// region: code
type Box<T> = { value: T };

const luckyNumber: Box<number> = { value: "seven" }; // @error
// endregion
export {};
