// expect-error: TS2322
// expect-message: Type 'unknown' is not assignable to type 'string'.
// region: code
const data: unknown = JSON.parse('{"item": "chai"}');
const item: string = data; // @error
// endregion
export {};
