// expect-error: TS2741
// expect-message: Property 'lassi' is missing in type '{ chai: number; coffee: number; }' but required in type 'Record<Drink, number>'.
// region: code
type Drink = "chai" | "coffee" | "lassi";

const prices: Record<Drink, number> = { // @error
  chai: 10,
  coffee: 20,
};
// endregion
export {};
