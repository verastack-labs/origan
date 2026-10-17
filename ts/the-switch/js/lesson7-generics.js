// Lesson 7: Generics, just enough. The page text is
// src/content/learn/js-to-ts/generics.mdx.
//
// The JavaScript side. Run it with `node js/lesson7-generics.js`.

function demoCourier() {
  // region: courier
  function deliver(parcel) {
    return parcel;
  }

  const sweets = deliver("laddoo");
  const count = deliver(42);

  console.log(sweets.toUpperCase());
  console.log(count + 1);
  // endregion
}

function demoFirst() {
  // region: first
  function first(items) {
    return items[0];
  }

  const firstScore = first([90, 85, 72]);
  const firstName = first(["Asha", "Ravi"]);

  console.log(firstScore);
  console.log(firstScore.toUpperCase());
  // endregion
}

function demoConstraint() {
  // region: constraint
  function longest(a, b) {
    return a.length >= b.length ? a : b;
  }

  console.log(longest("chai", "coffee"));
  console.log(longest(10, 20)); // numbers have no length, so this quietly picks 20
  // endregion
}

// region: last-start
function last(items) {
  return items[items.length - 1];
}

console.log(last([1, 2, 3])); // 3
console.log(last(["a", "b"])); // "b"
console.log(last([])); // undefined
// endregion

// region: swap-start
function swap(entry) {
  return [entry[1], entry[0]];
}

console.log(swap(["Asha", 21])); // [ 21, 'Asha' ]
// endregion

// region: map-box-start
function mapBox(box, change) {
  return { value: change(box.value) };
}

console.log(mapBox({ value: 21 }, (n) => n + 1)); // { value: 22 }
console.log(mapBox({ value: "chai" }, (s) => s.length)); // { value: 4 }
// endregion

// demoFirst() ends with a TypeError on its second log, so it is not run here.
demoCourier();
demoConstraint();
