// expect-error: TS7006
// expect-message: Parameter 'price' implicitly has an 'any' type.
// region: code
function lineTotal(price, quantity) { // @error
  return price * quantity;
}

console.log(lineTotal(10, 3));
// endregion
export {};
