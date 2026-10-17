// expect-error: TS2551
// expect-message: Property 'prise' does not exist on type '{ item: string; quantity: number; price: number; }'. Did you mean 'price'?
// region: code
const order = { item: "chai", quantity: 2, price: 15 };
const total = order.quantity * order.prise; // @error
console.log(total);
// endregion
export {};
