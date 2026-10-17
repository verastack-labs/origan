// Lesson 4: Arrays, tuples and functions. The page text is
// src/content/learn/js-to-ts/arrays-tuples-functions.mdx.
//
// The TypeScript side. Snippets that are meant to fail are in errors/.

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

function demoScores() {
  // region: scores
  const scores: number[] = [90, 85, 72];
  scores.push(77);

  let total = 0;
  for (const score of scores) {
    total += score;
  }
  console.log(total);
  // endregion
}

function demoTuple() {
  // region: tuple
  const ticket: [coach: string, seat: number] = ["B2", 14];

  const [coach, seat] = ticket;
  console.log(coach + ", seat " + seat);
  // endregion
}

function demoGreet() {
  // region: greet
  function greet(name: string, greeting = "Hello"): string {
    return greeting + ", " + name;
  }

  console.log(greet("Asha"));
  console.log(greet("Asha", "Namaste"));
  // endregion
}

function demoCallbacks() {
  // region: callbacks
  const prices = [10, 20, 30];

  // The callback has no labels. TypeScript knows price is a number, because
  // prices is a number[], and map hands each item to the callback.
  const doubled = prices.map((price) => price * 2);
  const labels = prices.map((price) => "Rs " + price);
  // endregion
  const checks: [Equal<typeof doubled, number[]>, Equal<typeof labels, string[]>] = [true, true];
  return { doubled, labels, checks };
}

function demoFunctionType() {
  // region: function-type
  type Discount = (price: number) => number;

  const tenOff: Discount = (price) => price * 0.9;

  function applyDiscount(price: number, discount: Discount): number {
    return Math.round(discount(price));
  }

  console.log(applyDiscount(200, tenOff));
  // endregion
}

function demoOptionalParam() {
  // region: optional-param
  function formatName(first: string, last?: string): string {
    return last === undefined ? first : first + " " + last;
  }

  console.log(formatName("Asha"));
  console.log(formatName("Asha", "Rao"));
  // endregion
}

function demoRest() {
  // region: rest
  function sumAll(...numbers: number[]): number {
    let sum = 0;
    for (const n of numbers) {
      sum += n;
    }
    return sum;
  }

  console.log(sumAll(1, 2, 3, 4));
  // endregion
}

// region: total
function total(prices: number[]): number {
  let sum = 0;
  for (const price of prices) {
    sum += price;
  }
  return sum;
}

total([10, 20, 30]); // 60
// endregion

// region: min-max
function minMax(numbers: number[]): [number, number] {
  return [Math.min(...numbers), Math.max(...numbers)];
}

const [low, high] = minMax([3, 1, 2]); // 1 and 3
// endregion

// region: pad-left
function padLeft(text: string, width: number, fill = " "): string {
  const missing = Math.max(0, width - text.length);
  return fill.repeat(missing) + text;
}

padLeft("7", 3, "0"); // "007"
// endregion

export {
  demoScores,
  demoTuple,
  demoGreet,
  demoCallbacks,
  demoFunctionType,
  demoOptionalParam,
  demoRest,
  total,
  minMax,
  padLeft,
  low,
  high,
};
