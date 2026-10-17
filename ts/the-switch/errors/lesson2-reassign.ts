// expect-error: TS2322
// expect-message: Type 'string' is not assignable to type 'number'.
// region: code
let age = 21;
age = "twenty-one"; // @error
console.log(age + 1);
// endregion
export {};
