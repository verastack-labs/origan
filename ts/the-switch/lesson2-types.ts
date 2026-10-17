// Lesson 2: Your first types. The page text is
// src/content/learn/js-to-ts/your-first-types.mdx.
//
// The TypeScript side. What the lesson says about inferred types is checked
// here: `Equal` is a type that is `true` only when two types are identical, and
// a tuple of `true`s will not compile if a comment in the lesson is wrong.

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

function demoAnnotations() {
  // region: annotations
  let price: number = 499;
  let item: string = "Chai";
  let inStock: boolean = true;
  // endregion
  return [price, item, inStock];
}

function demoFunctionLabels() {
  // region: function-labels
  function area(width: number, height: number) {
    return width * height;
  }

  console.log(area(5, 4));
  // endregion
  const checks: [Equal<ReturnType<typeof area>, number>] = [true];
  return checks;
}

function demoInference() {
  // region: inference
  const city = "Pune"; // type "Pune", because a const can never change
  let town = "Pune"; // type string, because a let may change to another string
  const stops = 3; // type 3
  let total = 3; // type number
  // endregion
  const checks: [Equal<typeof city, "Pune">, Equal<typeof town, string>, Equal<typeof stops, 3>, Equal<typeof total, number>] = [
    true,
    true,
    true,
    true,
  ];
  return checks;
}

function demoAnyHole() {
  // region: any-hole
  let anything: any = 5;
  anything = "now a string";
  console.log(anything.toFixed(2));
  // endregion
}

// region: to-fahrenheit
function toFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

toFahrenheit(100); // 212
// endregion

// region: describe-price
function describePrice(item: string, price: number, inStock: boolean) {
  const text = item + " costs " + price;
  return inStock ? text : text + " (sold out)";
}

describePrice("Chai", 15, true); // "Chai costs 15"
// endregion

// region: count-vowels
function countVowels(text: string): number {
  let count = 0;
  for (const letter of text.toLowerCase()) {
    if ("aeiou".includes(letter)) {
      count += 1;
    }
  }
  return count;
}

countVowels("Origan"); // 3
// endregion

export {
  demoAnnotations,
  demoFunctionLabels,
  demoInference,
  demoAnyHole,
  toFahrenheit,
  describePrice,
  countVowels,
};
