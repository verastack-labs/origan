// Lesson 2: Your first types. The page text is
// src/content/learn/js-to-ts/your-first-types.mdx.
//
// The JavaScript side. Run it with `node js/lesson2-types.js`.

function demoReassign() {
  // region: reassign
  let age = 21;
  age = "twenty-one";
  console.log(age + 1);
  // endregion
}

function demoAnnotations() {
  // region: annotations
  let price = 499;
  let item = "Chai";
  let inStock = true;
  // endregion
  return [price, item, inStock];
}

function demoFunctionLabels() {
  // region: function-labels
  function area(width, height) {
    return width * height;
  }

  console.log(area(5, 4));
  // endregion
}

function demoInference() {
  // region: inference
  const city = "Pune";
  let town = "Pune";
  const stops = 3;
  let total = 3;
  // endregion
  return [city, town, stops, total];
}

// region: to-fahrenheit-start
function toFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

console.log(toFahrenheit(100)); // 212
console.log(toFahrenheit("hot")); // NaN
// endregion

// region: describe-price-start
function describePrice(item, price, inStock) {
  const text = item + " costs " + price;
  return inStock ? text : text + " (sold out)";
}

console.log(describePrice("Chai", 15, true));
console.log(describePrice("Samosa", "ten", false));
// endregion

// region: count-vowels-start
function countVowels(text) {
  let count = 0;
  for (const letter of text.toLowerCase()) {
    if ("aeiou".includes(letter)) {
      count += 1;
    }
  }
  return count;
}

console.log(countVowels("Origan")); // 3
// endregion

demoReassign();
demoAnnotations();
demoFunctionLabels();
demoInference();
