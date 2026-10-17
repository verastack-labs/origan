// Lesson 7: Generics, just enough. The page text is
// src/content/learn/js-to-ts/generics.mdx.
//
// The TypeScript side. Snippets that are meant to fail are in errors/.

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

function demoCourier() {
  // region: courier
  function deliver<T>(parcel: T): T {
    return parcel;
  }

  const sweets = deliver("laddoo");
  const count = deliver(42);

  console.log(sweets.toUpperCase());
  console.log(count + 1);
  // endregion
}

function demoAny() {
  // region: any-version
  function deliverAny(parcel: any): any {
    return parcel;
  }

  const count = deliverAny(42);
  // No error here, and none for count.toUpperCase() either: any switches the checker off.
  console.log(count + 1);
  // endregion
}

function demoFirst() {
  // region: first-checked
  function first<T>(items: T[]): T | undefined {
    return items[0];
  }

  const firstScore = first([90, 85, 72]);
  const firstName = first(["Asha", "Ravi"]);

  console.log(firstScore);
  console.log(firstName?.toUpperCase());
  // endregion
}

function demoExplicit() {
  // region: explicit
  function first<T>(items: T[]): T | undefined {
    return items[0];
  }

  // Normally TypeScript works T out. You can also say it yourself.
  const empty = first<string>([]);
  console.log(empty);
  // endregion
}

function demoPair() {
  // region: pair
  function pair<A, B>(left: A, right: B): [A, B] {
    return [left, right];
  }

  const entry = pair("Asha", 21);
  console.log(entry);
  // endregion
  return entry;
}

function demoConstraint() {
  // region: constraint
  function longest<T extends { length: number }>(a: T, b: T): T {
    return a.length >= b.length ? a : b;
  }

  console.log(longest("chai", "coffee"));
  console.log(longest([1, 2, 3], [4, 5]));
  // endregion
}

function demoGetField() {
  // region: get-field
  type User = { name: string; age: number };

  function getField<T, K extends keyof T>(item: T, key: K): T[K] {
    return item[key];
  }

  const user: User = { name: "Asha", age: 21 };
  console.log(getField(user, "name"));
  console.log(getField(user, "age"));
  // endregion
}

function demoBox() {
  // region: box
  type Box<T> = { value: T };

  function openBox<T>(box: Box<T>): T {
    return box.value;
  }

  const luckyNumber: Box<number> = { value: 7 };
  const note: Box<string> = { value: "Call Amma" };

  console.log(openBox(luckyNumber) + 1);
  console.log(openBox(note).toUpperCase());
  // endregion
}

function demoBuiltIn() {
  // region: built-in
  const scores: Array<number> = [90, 85];
  const ages = new Map<string, number>();
  ages.set("Asha", 21);

  const later: Promise<string> = Promise.resolve("done");
  // endregion
  return { scores, ages, later };
}

function demoDefault() {
  // region: default-type
  type Result<T = string> = { ok: boolean; value: T };

  const text: Result = { ok: true, value: "saved" };
  const count: Result<number> = { ok: true, value: 3 };
  // endregion
  return { text, count };
}

function inferenceChecks() {
  function deliver<T>(parcel: T): T {
    return parcel;
  }
  function first<T>(items: T[]): T | undefined {
    return items[0];
  }
  function getField<T, K extends keyof T>(item: T, key: K): T[K] {
    return item[key];
  }

  const a = deliver("laddoo");
  const aIsString: Equal<typeof a, "laddoo"> = true;
  const b = deliver(42);
  const bIsNumber: Equal<typeof b, 42> = true;
  const c = first([1, 2]);
  const cIsMaybe: Equal<typeof c, number | undefined> = true;
  const d = getField({ name: "Asha", age: 21 }, "age");
  const dIsNumber: Equal<typeof d, number> = true;
  return [aIsString, bIsNumber, cIsMaybe, dIsNumber];
}

// region: last
function last<T>(items: T[]): T | undefined {
  return items[items.length - 1];
}

last([1, 2, 3]); // 3
last(["a", "b"]); // "b"
last([]); // undefined
// endregion

// region: swap
function swap<A, B>(entry: [A, B]): [B, A] {
  return [entry[1], entry[0]];
}

swap(["Asha", 21]); // [21, "Asha"]
// endregion

// region: map-box
type Box<T> = { value: T };

function mapBox<T, U>(box: Box<T>, change: (value: T) => U): Box<U> {
  return { value: change(box.value) };
}

mapBox({ value: 21 }, (n) => n + 1); // { value: 22 }
mapBox({ value: "chai" }, (s) => s.length); // { value: 4 }
// endregion

export {
  demoCourier,
  demoAny,
  demoFirst,
  demoExplicit,
  demoPair,
  demoConstraint,
  demoGetField,
  demoBox,
  demoBuiltIn,
  demoDefault,
  inferenceChecks,
  last,
  swap,
  mapBox,
};
