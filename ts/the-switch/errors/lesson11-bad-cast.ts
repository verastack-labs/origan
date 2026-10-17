// expect-error: TS2352
// expect-message: Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
// region: code
const price = "12" as number; // @error
// endregion
export {};
