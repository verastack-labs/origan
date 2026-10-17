// Lesson 10: Migrating a real project. The page text is
// src/content/learn/js-to-ts/migrating-a-project.mdx.
//
// JavaScript with JSDoc types. scripts/check-ts-snippets.mjs checks it as
// JavaScript (allowJs and checkJs, strict on) and runs it.

// region: jsdoc-checked
// @ts-check

/**
 * @param {number} price
 * @param {number} quantity
 * @returns {number}
 */
function lineTotal(price, quantity) {
  return price * quantity;
}

console.log(lineTotal(10, 3));
// endregion

// region: jsdoc-typedef
/** @typedef {{ name: string, price: number }} Item */

/**
 * @param {Item[]} items
 * @param {string} name
 * @returns {Item | undefined}
 */
function findItem(items, name) {
  return items.find((item) => item.name === name);
}

/** @type {Item[]} */
const menu = [{ name: "chai", price: 10 }];
console.log(findItem(menu, "chai"));
// endregion
