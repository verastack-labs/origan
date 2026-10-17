// Lesson 10: Migrating a real project. The page text is
// src/content/learn/js-to-ts/migrating-a-project.mdx.
//
// The JavaScript side. Run it with `node js/lesson10-migrate.js`.

function demoConverted() {
  // region: converted
  const cart = [
    { name: "chai", price: 10 },
    { name: "samosa", price: 15 },
  ];

  function lineTotal(price, quantity) {
    return price * quantity;
  }

  function findItem(items, itemName) {
    return items.find((item) => item.name === itemName);
  }

  console.log(lineTotal(10, 3));
  console.log(findItem(cart, "chai"));
  // endregion
}

function demoRenameFirst() {
  // region: rename-first
  function lineTotal(price, quantity) {
    return price * quantity;
  }

  console.log(lineTotal(10, 3));
  // endregion
}

// region: rename-start
function discount(price, percent) {
  return price - (price * percent) / 100;
}

function label(product) {
  return product.name + " (Rs " + product.price + ")";
}

console.log(discount(200, 10)); // 180
console.log(label({ name: "chai", price: 10 })); // "chai (Rs 10)"
// endregion

// region: expect-error-start
function legacyTotal(prices) {
  return prices.reduce((sum, price) => sum + Number(price), 0);
}

console.log(legacyTotal([10, 20])); // 30
console.log(legacyTotal("10,20".split(","))); // 30, an old caller passes text
// endregion

// region: strict-null-start
const menu = [
  { name: "chai", price: 10 },
  { name: "samosa", price: 15 },
];

function priceOfItem(itemName) {
  return menu.find((item) => item.name === itemName).price;
}

console.log(priceOfItem("chai")); // 10
// priceOfItem("vada") would crash: find gave back undefined
// endregion

demoConverted();
demoRenameFirst();
