// Lesson 10: Migrating a real project. The page text is
// src/content/learn/js-to-ts/migrating-a-project.mdx.
//
// The TypeScript side. Snippets that are meant to fail are in errors/. The
// JavaScript with JSDoc types is in jsdoc/, and the tsconfig ladder is in migrate/.

function demoConverted() {
  // region: converted
  type Item = { name: string; price: number };

  const cart: Item[] = [
    { name: "chai", price: 10 },
    { name: "samosa", price: 15 },
  ];

  function lineTotal(price: number, quantity: number): number {
    return price * quantity;
  }

  function findItem(items: Item[], itemName: string): Item | undefined {
    return items.find((item) => item.name === itemName);
  }

  console.log(lineTotal(10, 3));
  console.log(findItem(cart, "chai"));
  // endregion
}

function demoTemporaryAny() {
  // region: temporary-any
  // First pass on a big file: say "any" out loud, and come back to it.
  // TODO(types): replace these any with Item once the callers are typed.
  function lineTotal(price: any, quantity: any): number {
    return price * quantity;
  }

  console.log(lineTotal(10, 3));
  // endregion
}

// region: rename
type Product = { name: string; price: number };

function discount(price: number, percent: number): number {
  return price - (price * percent) / 100;
}

function label(product: Product): string {
  return product.name + " (Rs " + product.price + ")";
}

discount(200, 10); // 180
label({ name: "chai", price: 10 }); // "chai (Rs 10)"
// endregion

// region: expect-error
function legacyTotal(prices: number[]): number {
  return prices.reduce((sum, price) => sum + Number(price), 0);
}

legacyTotal([10, 20]); // 30
// @ts-expect-error an old caller still passes text. Fix it in the next change.
legacyTotal("10,20".split(","));
// endregion

// region: strict-null
type MenuItem = { name: string; price: number };

const menu: MenuItem[] = [
  { name: "chai", price: 10 },
  { name: "samosa", price: 15 },
];

function priceOfItem(itemName: string): number | undefined {
  return menu.find((item) => item.name === itemName)?.price;
}

priceOfItem("chai"); // 10
priceOfItem("vada"); // undefined
// endregion

export { demoConverted, demoTemporaryAny, discount, label, legacyTotal, priceOfItem };
