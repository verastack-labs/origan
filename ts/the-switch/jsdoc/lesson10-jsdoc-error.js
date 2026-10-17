// expect-error: TS2345
// expect-message: Argument of type 'string' is not assignable to parameter of type 'number'.
// region: code
// @ts-check

/**
 * @param {number} price
 * @param {number} quantity
 * @returns {number}
 */
function lineTotal(price, quantity) {
  return price * quantity;
}

console.log(lineTotal("10", 3)); // @error
// endregion
