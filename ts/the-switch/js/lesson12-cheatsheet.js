// Lesson 12: The cheat sheet. The page text is
// src/content/learn/js-to-ts/the-cheat-sheet.mdx.
//
// The JavaScript side of every row, under the same region names as the
// TypeScript file. Every row here runs. A row that would crash in JavaScript
// is written so it quietly gives the wrong answer instead, which is the point.

// ---- Basics ----------------------------------------------------------------

function rowAnnotate() {
  // region: annotate
  const city = "Pune";
  let seats = 40;
  let isOpen = true;
  // endregion
  return [city, seats, isOpen];
}

function rowInfer() {
  // region: infer
  const price = 10;
  const tag = "Rs " + price;
  // endregion
  return [price, tag];
}

function rowReassign() {
  // region: reassign
  let age = 21;
  age = "twenty-one";
  console.log(age + 1);
  // endregion
}

// ---- Shapes: objects, arrays, tuples ---------------------------------------

function rowObjectType() {
  // region: object-type
  const user = { name: "Asha", age: 21 };
  // endregion
  return user;
}

function rowOptional() {
  // region: optional
  const contact = { id: 1 };
  // endregion
  return contact;
}

function rowReadonly() {
  // region: readonly
  const config = { host: "localhost", port: 8080 };
  config.port = 9090;
  console.log(config.port);
  // endregion
}

function rowArray() {
  // region: array
  const scores = [90, 85];
  scores.push(77);
  // endregion
  return scores;
}

function rowTuple() {
  // region: tuple
  const ticket = ["B2", 14];
  const [coach, seat] = ticket;
  // endregion
  return [coach, seat];
}

// ---- Functions ----------------------------------------------------------------

function rowFnTypes() {
  // region: fn-types
  function total(prices) {
    return prices.reduce((sum, price) => sum + price, 0);
  }
  // endregion
  return total([10, 20]);
}

function rowFnDefaults() {
  // region: fn-defaults
  function greet(person, greeting = "Hello", suffix) {
    return greeting + ", " + person + (suffix ?? "");
  }
  // endregion
  return [greet("Asha"), greet("Asha", "Namaste", "!")];
}

function rowFnCallback() {
  // region: fn-callback
  const apply = (n, change) => change(n);
  // endregion
  return apply(5, (n) => n * 2);
}

// ---- Unions and narrowing ---------------------------------------------------------

function rowUnion() {
  // region: union
  function label(id) {
    return typeof id === "string" ? id.toUpperCase() : "No. " + id;
  }
  // endregion
  return [label("b2"), label(14)];
}

function rowInNarrow() {
  // region: in-narrow
  function score(player) {
    return "runs" in player ? player.runs : player.wickets;
  }
  // endregion
  return [score({ runs: 82 }), score({ wickets: 3 })];
}

function rowDiscriminated() {
  // region: discriminated
  function serve(order) {
    switch (order.kind) {
      case "chai":
        return order.sugar + " sugars";
      case "coffee":
        return order.strong ? "strong" : "mild";
    }
  }
  // endregion
  return [serve({ kind: "chai", sugar: 2 }), serve({ kind: "coffee", strong: true })];
}

function rowNever() {
  // region: never
  function price(drink) {
    switch (drink) {
      case "chai":
        return 10;
      case "coffee":
        return 20;
      default:
        return undefined;
    }
  }
  // endregion
  return [price("chai"), price("coffee")];
}

function rowLiteralUnion() {
  // region: literal-union
  function brew(strength) {
    return strength === "strong" ? "Two shots" : "One shot";
  }
  // endregion
  return [brew("mild"), brew("strong")];
}

function rowBadLiteral() {
  // region: bad-literal
  function brew(strength) {
    return strength === "strong" ? "Two shots" : "One shot";
  }

  console.log(brew("strong"));
  console.log(brew("medium"));
  // endregion
}

// ---- Missing values ----------------------------------------------------------------

function rowFind() {
  // region: find
  function nameOf(students, roll) {
    const found = students.find((s) => s.roll === roll);
    return found === undefined ? "No such student" : found.name;
  }
  // endregion
  return [nameOf([{ roll: 1, name: "Asha" }], 1), nameOf([], 9)];
}

function rowMaybeUndefined() {
  // region: maybe-undefined
  const students = [{ roll: 1, name: "Asha" }];

  function nameOf(roll) {
    return students.find((s) => s.roll === roll)?.name;
  }

  console.log(nameOf(1));
  console.log(nameOf(9));
  // endregion
}

function rowOptionalChain() {
  // region: optional-chain
  function cityOf(customer) {
    return customer.address?.city;
  }
  // endregion
  return [cityOf({ address: { city: "Pune" } }), cityOf({})];
}

function rowNullish() {
  // region: nullish
  function runsLabel(runs) {
    return "Runs: " + (runs || "did not bat");
  }
  // endregion
  return [runsLabel(0), runsLabel(undefined)];
}

function rowNonNull() {
  // region: non-null
  const seats = new Map([["A", 1]]);

  const next = seats.get("A") + 1;
  // endregion
  return next;
}

// ---- Generics -------------------------------------------------------------------

function rowGenericFn() {
  // region: generic-fn
  function first(items) {
    return items[0];
  }
  // endregion
  return [first([1, 2]), first(["a"])];
}

function rowBadConstraint() {
  // region: bad-constraint
  function longest(a, b) {
    return a.length >= b.length ? a : b;
  }

  console.log(longest("chai", "coffee"));
  console.log(longest(10, 20));
  // endregion
}

function rowGenericType() {
  // region: generic-type
  const lucky = { value: 7 };
  const note = { value: "Call Amma" };
  // endregion
  return [lucky, note];
}

// ---- Utility types ------------------------------------------------------------------

function rowPartialTypo() {
  // region: partial-typo
  function updateUser(user, changes) {
    return { ...user, ...changes };
  }

  const asha = { id: 1, name: "Asha", email: "asha@example.com", password: "chai123" };
  const renamed = updateUser(asha, { nmae: "Asha Rao" });
  console.log(renamed.name);
  // endregion
}

function rowPickOmit() {
  // region: pick-omit
  const user = { id: 1, name: "Asha", password: "chai123" };

  const preview = { id: user.id, name: user.name };
  const { password, ...publicUser } = user;
  // endregion
  return [preview, publicUser, password];
}

function rowRecord() {
  // region: record
  const prices = { chai: 10, coffee: 20 };
  // endregion
  return prices;
}

function rowReturnType() {
  // region: return-type
  function makeTicket(seat) {
    return { seat, paid: false };
  }
  // endregion
  return makeTicket(14);
}

// ---- Data from outside ---------------------------------------------------------------

function rowUnknownUse() {
  // region: unknown-use
  function shout(value) {
    return value.toUpperCase();
  }

  console.log(shout("chai"));
  // endregion
}

function rowUnknown() {
  // region: unknown
  function describe(value) {
    return typeof value === "string" ? value.toUpperCase() : "not text";
  }
  // endregion
  return [describe("chai"), describe(42)];
}

function rowGuard() {
  // region: guard
  function isTicket(value) {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.coach === "string" &&
      typeof value.seat === "number"
    );
  }
  // endregion
  return [isTicket({ coach: "B2", seat: 14 }), isTicket({ coach: "B2" })];
}

function rowFetch() {
  // region: fetch
  async function loadScores(url) {
    const response = await fetch(url);
    return response.json();
  }
  // endregion
  return loadScores;
}

// ---- Migrating ----------------------------------------------------------------------------

function rowRename() {
  // region: rename
  function lineTotal(price, quantity) {
    return price * quantity;
  }
  // endregion
  return lineTotal(10, 3);
}

function rowExpectError() {
  // region: expect-error
  function legacyTotal(prices) {
    return prices.reduce((sum, price) => sum + Number(price), 0);
  }

  legacyTotal("10,20".split(","));
  // endregion
}

// ---- Escape hatches -------------------------------------------------------------------------

function rowAsConst() {
  // region: as-const
  const order = { kind: "chai", sugar: 2 };
  // endregion
  return order;
}

function rowSatisfies() {
  // region: satisfies
  const prices = { chai: 10, coffee: 20 };
  // endregion
  return prices.chai;
}

function rowSatisfiesMiss() {
  // region: satisfies-miss
  const prices = { chai: 10, coffee: 20 };

  console.log(prices.chai);
  console.log(prices.lassi);
  // endregion
}

function rowUnionNotEnum() {
  // region: union-not-enum
  const sizes = ["small", "large"];
  // endregion
  return sizes;
}

function rowCast() {
  // region: cast
  const data = "12";
  const text = typeof data === "string" ? data : "";
  const price = Number(text);
  // endregion
  return price;
}

function rowBadCast() {
  // region: bad-cast
  const price = "12";
  // endregion
  return price;
}

const rows = [
  rowAnnotate, rowInfer, rowReassign, rowObjectType, rowOptional, rowReadonly, rowArray, rowTuple,
  rowFnTypes, rowFnDefaults, rowFnCallback, rowUnion, rowInNarrow, rowDiscriminated, rowNever,
  rowLiteralUnion, rowBadLiteral, rowFind, rowMaybeUndefined, rowOptionalChain, rowNullish, rowNonNull,
  rowGenericFn, rowBadConstraint, rowGenericType, rowPartialTypo, rowPickOmit, rowRecord, rowReturnType,
  rowUnknownUse, rowUnknown, rowGuard, rowFetch, rowRename, rowExpectError, rowAsConst, rowSatisfies,
  rowSatisfiesMiss, rowUnionNotEnum, rowCast, rowBadCast,
];

// Every row is run once, with its output thrown away, so a row that stops parsing or crashes fails the check.
const log = console.log;
console.log = () => {};
for (const row of rows) row();
console.log = log;
console.log(rows.length + " rows ran");
