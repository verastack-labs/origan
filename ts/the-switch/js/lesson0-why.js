// Lesson 0: Why switch? The page text is
// src/content/learn/js-to-ts/why-switch.mdx.
//
// This is the JavaScript side. Run it with `node lesson0-why.js`. The last demo
// crashes on purpose, which is the point of it.
// expect-throw: TypeError

function demoTypo() {
  // region: typo
  const order = { item: "chai", quantity: 2, price: 15 };
  const total = order.quantity * order.prise;
  console.log(total);
  // endregion
}

function demoMissingArgument() {
  // region: missing-argument
  function addGst(price, rate) {
    return price + price * rate;
  }

  console.log(addGst(100));
  // endregion
}

function demoWrongKind() {
  // region: wrong-kind
  function doubleIt(n) {
    return n + n;
  }

  console.log(doubleIt("21"));
  // endregion
}

function demoRuntime() {
  // region: runtime
  const fromServer = JSON.parse('{"nam": "Asha"}');
  console.log(fromServer.name.toUpperCase());
  // endregion
}

// region: double-start
function double(n) {
  return n + n;
}

console.log(double("21")); // "2121", not 42
// endregion

// region: area-start
function area(width, height) {
  return width * height;
}

console.log(area(5)); // NaN, because height is missing
// endregion

// region: greet-start
function greet(name) {
  return "Hello, " + name;
}

console.log(greet()); // "Hello, undefined"
// endregion

demoTypo();
demoMissingArgument();
demoWrongKind();
// The one that crashes goes last, so everything above it has already run.
demoRuntime();
