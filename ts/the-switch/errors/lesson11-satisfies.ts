// expect-error: TS2339
// expect-message: Property 'lassi' does not exist on type '{ chai: number; coffee: number; }'.
// region: code
type Prices = Record<string, number>;

const prices = { chai: 10, coffee: 20 } satisfies Prices;

console.log(prices.chai);
console.log(prices.lassi); // @error
// endregion
export {};
