// Lesson 11: Traps and escape hatches. The page text is
// src/content/learn/js-to-ts/traps-and-escape-hatches.mdx.
//
// The JavaScript side. Run it with `node js/lesson11-traps.js`.

// The next two end in a crash, so they are not called.
function demoAnyPass() {
  // region: any-pass
  function shout(text) {
    return text.toUpperCase();
  }

  console.log(shout("chai"));
  console.log(shout(42));
  // endregion
}

function demoAsPass() {
  // region: as-pass
  const data = JSON.parse('{"name": "Asha"}');
  const user = data;

  console.log(user.name);
  console.log(user.age.toFixed(0));
  // endregion
}

function demoEnumOutput() {
  // region: enum-output
  var Drink;
  (function (Drink) {
    Drink[Drink["Chai"] = 0] = "Chai";
    Drink[Drink["Coffee"] = 1] = "Coffee";
    Drink[Drink["Lassi"] = 2] = "Lassi";
  })(Drink || (Drink = {}));
  // endregion
  return Drink;
}

// region: length-of-start
function lengthOf(value) {
  return value.length;
}

console.log(lengthOf("chai")); // 4
console.log(lengthOf([1, 2, 3])); // 3
// lengthOf(42) gives undefined, and lengthOf(null) crashes
// endregion

// region: size-price-start
const Size = { Small: "small", Large: "large" };

function sizePrice(size) {
  if (size === Size.Small) {
    return 10;
  }
  return 20;
}

console.log(sizePrice("large")); // 20
console.log(sizePrice("huge")); // 20, anything that is not small is priced as large
// endregion

// region: satisfies-prices-start
const menuPrices = {
  chai: 10,
  coffee: 20,
};

console.log(menuPrices.chai); // 10
console.log(menuPrices.lassi); // undefined, and nothing warned us
// endregion

console.log(Object.keys(demoEnumOutput()).length);
