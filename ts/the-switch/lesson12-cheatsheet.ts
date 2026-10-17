// Lesson 12: The cheat sheet. The page text is
// src/content/learn/js-to-ts/the-cheat-sheet.mdx.
//
// One small region per row of the sheet, each in its own function so the names
// never collide. The JavaScript side of every row is in js/lesson12-cheatsheet.js
// under the same region name. Rows that show an error use a file in errors/.

// ---- Basics ----------------------------------------------------------------

function rowAnnotate() {
  // region: annotate
  const city: string = "Pune";
  let seats: number = 40;
  let isOpen: boolean = true;
  // endregion
  return [city, seats, isOpen];
}

function rowInfer() {
  // region: infer
  const price = 10; // number
  const tag = "Rs " + price; // string
  // endregion
  return [price, tag];
}

// ---- Shapes: objects, arrays, tuples ---------------------------------------

function rowObjectType() {
  // region: object-type
  type User = { name: string; age: number };

  const user: User = { name: "Asha", age: 21 };
  // endregion
  return user;
}

function rowOptional() {
  // region: optional
  type Contact = { readonly id: number; email?: string };

  const contact: Contact = { id: 1 };
  // endregion
  return contact;
}

function rowArray() {
  // region: array
  const scores: number[] = [90, 85];
  scores.push(77);
  // endregion
  return scores;
}

function rowTuple() {
  // region: tuple
  const ticket: [coach: string, seat: number] = ["B2", 14];
  const [coach, seat] = ticket;
  // endregion
  return [coach, seat];
}

// ---- Functions ----------------------------------------------------------------

function rowFnTypes() {
  // region: fn-types
  function total(prices: number[]): number {
    return prices.reduce((sum, price) => sum + price, 0);
  }
  // endregion
  return total([10, 20]);
}

function rowFnDefaults() {
  // region: fn-defaults
  function greet(person: string, greeting = "Hello", suffix?: string): string {
    return greeting + ", " + person + (suffix ?? "");
  }
  // endregion
  return [greet("Asha"), greet("Asha", "Namaste", "!")];
}

function rowFnCallback() {
  // region: fn-callback
  type Change = (n: number) => number;

  const apply = (n: number, change: Change): number => change(n);
  // endregion
  return apply(5, (n) => n * 2);
}

// ---- Unions and narrowing ---------------------------------------------------------

function rowUnion() {
  // region: union
  function label(id: string | number): string {
    return typeof id === "string" ? id.toUpperCase() : "No. " + id;
  }
  // endregion
  return [label("b2"), label(14)];
}

function rowInNarrow() {
  // region: in-narrow
  type Batter = { runs: number };
  type Bowler = { wickets: number };

  function score(player: Batter | Bowler): number {
    return "runs" in player ? player.runs : player.wickets;
  }
  // endregion
  return [score({ runs: 82 }), score({ wickets: 3 })];
}

function rowDiscriminated() {
  // region: discriminated
  type Order = { kind: "chai"; sugar: number } | { kind: "coffee"; strong: boolean };

  function serve(order: Order): string {
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
  type Drink = "chai" | "coffee";

  function assertNever(value: never): never {
    throw new Error("Unhandled: " + value);
  }

  function price(drink: Drink): number {
    switch (drink) {
      case "chai":
        return 10;
      case "coffee":
        return 20;
      default:
        return assertNever(drink);
    }
  }
  // endregion
  return [price("chai"), price("coffee")];
}

function rowLiteralUnion() {
  // region: literal-union
  type Strength = "mild" | "strong";

  function brew(strength: Strength): string {
    return strength === "strong" ? "Two shots" : "One shot";
  }
  // endregion
  return [brew("mild"), brew("strong")];
}

// ---- Missing values ----------------------------------------------------------------

function rowFind() {
  // region: find
  type Student = { roll: number; name: string };

  function nameOf(students: Student[], roll: number): string {
    const found = students.find((s) => s.roll === roll);
    return found === undefined ? "No such student" : found.name;
  }
  // endregion
  return [nameOf([{ roll: 1, name: "Asha" }], 1), nameOf([], 9)];
}

function rowOptionalChain() {
  // region: optional-chain
  type Customer = { address?: { city: string } };

  function cityOf(customer: Customer): string | undefined {
    return customer.address?.city;
  }
  // endregion
  return [cityOf({ address: { city: "Pune" } }), cityOf({})];
}

function rowNullish() {
  // region: nullish
  function runsLabel(runs: number | undefined): string {
    return "Runs: " + (runs ?? "did not bat");
  }
  // endregion
  return [runsLabel(0), runsLabel(undefined)];
}

function rowNonNull() {
  // region: non-null
  const seats = new Map<string, number>([["A", 1]]);

  // Only when the line above proves it is there.
  const next = seats.get("A")! + 1;
  // endregion
  return next;
}

// ---- Generics -------------------------------------------------------------------

function rowGenericFn() {
  // region: generic-fn
  function first<T>(items: T[]): T | undefined {
    return items[0];
  }
  // endregion
  return [first([1, 2]), first(["a"])];
}

function rowConstraint() {
  // region: constraint
  function longest<T extends { length: number }>(a: T, b: T): T {
    return a.length >= b.length ? a : b;
  }
  // endregion
  return [longest("chai", "coffee"), longest([1], [1, 2])];
}

function rowGenericType() {
  // region: generic-type
  type Box<T> = { value: T };

  const lucky: Box<number> = { value: 7 };
  const note: Box<string> = { value: "Call Amma" };
  // endregion
  return [lucky, note];
}

// ---- Utility types ------------------------------------------------------------------

function rowPartial() {
  // region: partial
  type User = { id: number; name: string; email: string };

  function update(user: User, changes: Partial<User>): User {
    return { ...user, ...changes };
  }
  // endregion
  return update({ id: 1, name: "Asha", email: "a@example.com" }, { name: "Asha Rao" });
}

function rowPickOmit() {
  // region: pick-omit
  type User = { id: number; name: string; password: string };

  type Preview = Pick<User, "id" | "name">;
  type PublicUser = Omit<User, "password">;
  // endregion
  const preview: Preview = { id: 1, name: "Asha" };
  const publicUser: PublicUser = { id: 1, name: "Asha" };
  return [preview, publicUser];
}

function rowRecord() {
  // region: record
  type Drink = "chai" | "coffee";

  const prices: Record<Drink, number> = { chai: 10, coffee: 20 };
  // endregion
  return prices;
}

function rowReturnType() {
  // region: return-type
  function makeTicket(seat: number) {
    return { seat, paid: false };
  }

  type Ticket = ReturnType<typeof makeTicket>;
  // endregion
  const ticket: Ticket = makeTicket(14);
  return ticket;
}

// ---- Data from outside ---------------------------------------------------------------

function rowUnknown() {
  // region: unknown
  function describe(value: unknown): string {
    return typeof value === "string" ? value.toUpperCase() : "not text";
  }
  // endregion
  return [describe("chai"), describe(42)];
}

function rowGuard() {
  // region: guard
  type Ticket = { coach: string; seat: number };

  function isTicket(value: unknown): value is Ticket {
    return (
      typeof value === "object" &&
      value !== null &&
      "coach" in value &&
      typeof value.coach === "string" &&
      "seat" in value &&
      typeof value.seat === "number"
    );
  }
  // endregion
  return [isTicket({ coach: "B2", seat: 14 }), isTicket({ coach: "B2" })];
}

function rowFetch() {
  // region: fetch
  function isNumberList(value: unknown): value is number[] {
    return Array.isArray(value) && value.every((item) => typeof item === "number");
  }

  async function loadScores(url: string): Promise<number[]> {
    const response = await fetch(url);
    const data: unknown = await response.json();
    return isNumberList(data) ? data : [];
  }
  // endregion
  return loadScores;
}

// ---- Migrating ----------------------------------------------------------------------------

function rowRename() {
  // region: rename
  function lineTotal(price: number, quantity: number): number {
    return price * quantity;
  }
  // endregion
  return lineTotal(10, 3);
}

function rowExpectError() {
  // region: expect-error
  function legacyTotal(prices: number[]): number {
    return prices.reduce((sum, price) => sum + Number(price), 0);
  }

  // @ts-expect-error an old caller passes text. Fix it in the next change.
  legacyTotal("10,20".split(","));
  // endregion
}

// ---- Escape hatches -------------------------------------------------------------------------

function rowAsConst() {
  // region: as-const
  const order = { kind: "chai", sugar: 2 } as const;
  // endregion
  return order;
}

function rowSatisfies() {
  // region: satisfies
  type Prices = Record<string, number>;

  const prices = { chai: 10, coffee: 20 } satisfies Prices;
  // endregion
  return prices.chai;
}

function rowUnionNotEnum() {
  // region: union-not-enum
  type Size = "small" | "large";

  const sizes: Size[] = ["small", "large"];
  // endregion
  return sizes;
}

function rowCast() {
  // region: cast
  const data: unknown = "12";
  const text = typeof data === "string" ? data : "";
  const price = Number(text);
  // endregion
  return price;
}

/** Every row, so a test can run them all. */
export const rows = [
  rowAnnotate,
  rowInfer,
  rowObjectType,
  rowOptional,
  rowArray,
  rowTuple,
  rowFnTypes,
  rowFnDefaults,
  rowFnCallback,
  rowUnion,
  rowInNarrow,
  rowDiscriminated,
  rowNever,
  rowLiteralUnion,
  rowFind,
  rowOptionalChain,
  rowNullish,
  rowNonNull,
  rowGenericFn,
  rowConstraint,
  rowGenericType,
  rowPartial,
  rowPickOmit,
  rowRecord,
  rowReturnType,
  rowUnknown,
  rowGuard,
  rowFetch,
  rowRename,
  rowExpectError,
  rowAsConst,
  rowSatisfies,
  rowUnionNotEnum,
  rowCast,
];
