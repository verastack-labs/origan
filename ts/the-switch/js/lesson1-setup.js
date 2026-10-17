// Lesson 1: Setting up. The page text is
// src/content/learn/js-to-ts/setting-up.mdx.
//
// The JavaScript side. Run it with `node lesson1-setup.js`.

// region: hello
function shout(message) {
  return message.toUpperCase() + "!";
}

console.log(shout("hello, typescript"));
// endregion

// region: implicit
function double(n) {
  return n * 2;
}
// endregion

// region: describe-start
function describe(name, age) {
  return name + " is " + age + " years old";
}

console.log(describe("Asha", 21));
// endregion

// region: average-start
function average(a, b) {
  return (a + b) / 2;
}

console.log(average(4, 6));
console.log(average(4, "6")); // "46" is divided by 2, so 23
// endregion

// region: is-even-start
function isEven(n) {
  return n % 2 === 0;
}

console.log(isEven(4));
console.log(isEven("4")); // true, because "4" is quietly turned into 4
// endregion
