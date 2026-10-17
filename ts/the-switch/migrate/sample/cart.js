// A small, untyped file, used to see what each rung of the strictness ladder finds.
// The tests compile it with each tsconfig in the folder above.
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

console.log(lineTotal(10, 3).toFixed("2"));
console.log(findItem(cart, "chai"));

const first = cart.find((item) => item.price > 12);
console.log(first.name);
