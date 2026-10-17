// Lesson 4: Arrays, tuples and functions. The page text is
// src/content/learn/js-to-ts/arrays-tuples-functions.mdx.
//
// The JavaScript side. Run it with `node js/lesson4-functions.js`.

function demoScores() {
  // region: scores
  const scores = [90, 85, 72];
  scores.push("77");

  let total = 0;
  for (const score of scores) {
    total += score;
  }
  console.log(total);
  // endregion
}

function demoTuple() {
  // region: tuple
  const ticket = ["B2", 14];

  const [coach, seat] = ticket;
  console.log(coach + ", seat " + seat);
  console.log(ticket[2]);
  // endregion
}

function demoGreet() {
  // region: greet
  function greet(name, greeting = "Hello") {
    return greeting + ", " + name;
  }

  console.log(greet("Asha"));
  console.log(greet("Asha", "Namaste"));
  // endregion
}

// region: total-start
function total(prices) {
  let sum = 0;
  for (const price of prices) {
    sum += price;
  }
  return sum;
}

console.log(total([10, 20, 30])); // 60
console.log(total([10, 20, "5"])); // "305", because "5" turns the sum into text
// endregion

// region: min-max-start
function minMax(numbers) {
  return [Math.min(...numbers), Math.max(...numbers)];
}

const [low, high] = minMax([3, 1, 2]);
console.log(low, high); // 1 3
// endregion

// region: pad-left-start
function padLeft(text, width, fill) {
  const missing = Math.max(0, width - text.length);
  return (fill || " ").repeat(missing) + text;
}

console.log(padLeft("7", 3, "0")); // "007"
console.log(padLeft("7", 3)); // "  7"
// endregion

demoScores();
demoTuple();
demoGreet();
