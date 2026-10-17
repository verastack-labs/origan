// Lesson 9: Data from outside. The page text is
// src/content/learn/js-to-ts/data-from-outside.mdx.
//
// The TypeScript side. Snippets that are meant to fail are in errors/.

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

function demoTrust() {
  // region: trust
  type Order = { id: number; item: string };

  const text = '{"id": "7", "item": "chai"}';
  const order: Order = JSON.parse(text);

  console.log(order.id + 1);
  // endregion
}

function demoUnknown() {
  // region: unknown-checked
  function describe(value: unknown): string {
    if (typeof value === "string") {
      return value.toUpperCase();
    }
    if (typeof value === "number") {
      return value.toFixed(1);
    }
    return "something else";
  }

  console.log(describe("chai"));
  console.log(describe(21));
  console.log(describe(null));
  // endregion
}

// Never called: the first line is the point. any lets this compile and then crash.
function demoAnyHole() {
  // region: any-hole
  const loose: any = "chai";
  loose.nothing.here();
  // endregion
}

function demoGuard() {
  // region: type-guard
  type Order = { id: number; item: string };

  function isOrder(value: unknown): value is Order {
    return (
      typeof value === "object" &&
      value !== null &&
      "id" in value &&
      typeof value.id === "number" &&
      "item" in value &&
      typeof value.item === "string"
    );
  }

  function parseOrder(text: string): Order | undefined {
    const data: unknown = JSON.parse(text);
    return isOrder(data) ? data : undefined;
  }

  console.log(parseOrder('{"id": 7, "item": "chai"}'));
  console.log(parseOrder('{"id": "7", "item": "chai"}'));
  // endregion
}

function demoCatch() {
  // region: catch-unknown
  type Order = { id: number; item: string };

  function parseOrderSafely(text: string): Order | string {
    try {
      return JSON.parse(text) as Order;
    } catch (error) {
      if (error instanceof SyntaxError) {
        return "That was not valid JSON";
      }
      throw error;
    }
  }

  console.log(parseOrderSafely('{"id": 7, "item": "chai"}'));
  console.log(parseOrderSafely("{not json"));
  // endregion
}

function demoFetch() {
  // region: fetch-checked
  type Order = { id: number; item: string };

  function isOrder(value: unknown): value is Order {
    return (
      typeof value === "object" &&
      value !== null &&
      "id" in value &&
      typeof value.id === "number" &&
      "item" in value &&
      typeof value.item === "string"
    );
  }

  async function loadOrder(address: string): Promise<Order | undefined> {
    const response = await fetch(address);
    if (!response.ok) {
      return undefined;
    }
    const data: unknown = await response.json();
    return isOrder(data) ? data : undefined;
  }

  const done = loadOrder("https://example.com/orders/7").then((order) => console.log(order));
  // endregion
  return done;
}

function demoList() {
  // region: guard-list
  type Order = { id: number; item: string };

  function isOrder(value: unknown): value is Order {
    return (
      typeof value === "object" &&
      value !== null &&
      "id" in value &&
      typeof value.id === "number" &&
      "item" in value &&
      typeof value.item === "string"
    );
  }

  function isOrderList(value: unknown): value is Order[] {
    return Array.isArray(value) && value.every(isOrder);
  }

  console.log(isOrderList([{ id: 1, item: "chai" }]));
  console.log(isOrderList([{ id: 1, item: "chai" }, { id: "2" }]));
  console.log(isOrderList("chai"));
  // endregion
}

function demoLyingGuard() {
  // region: lying-guard
  type Order = { id: number; item: string };

  // This compiles. The checker believes the promise in the signature and never inspects the body.
  function isOrder(value: unknown): value is Order {
    return true;
  }

  const data: unknown = { nothing: "useful" };
  if (isOrder(data)) {
    console.log(data.item.toUpperCase());
  }
  // endregion
}

// The shapes the checker leaves behind.
function guardChecks() {
  type Order = { id: number; item: string };
  function isOrder(value: unknown): value is Order {
    return typeof value === "object" && value !== null && "id" in value && "item" in value;
  }
  function f(data: unknown) {
    if (isOrder(data)) {
      const yes: Equal<typeof data, Order> = true;
      return yes;
    }
    const still: Equal<typeof data, unknown> = true;
    return still;
  }
  const fromJson: Equal<ReturnType<typeof JSON.parse>, any> = true;
  return [f({ id: 1, item: "a" }), f(null), fromJson];
}

// region: read-name
function readName(data: unknown): string | undefined {
  if (typeof data === "object" && data !== null && "name" in data && typeof data.name === "string") {
    return data.name.toUpperCase();
  }
  return undefined;
}

readName({ name: "asha" }); // "ASHA"
readName(null); // undefined
readName({ name: 42 }); // undefined
// endregion

// region: is-ticket
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

function parseTicket(json: string): Ticket | undefined {
  const data: unknown = JSON.parse(json);
  return isTicket(data) ? data : undefined;
}

parseTicket('{"coach": "B2", "seat": 14}'); // { coach: "B2", seat: 14 }
parseTicket('{"coach": "B2", "seat": "14"}'); // undefined
// endregion

// region: load-scores
function isNumberList(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item) => typeof item === "number");
}

async function loadScores(url: string): Promise<number[]> {
  const response = await fetch(url);
  if (!response.ok) {
    return [];
  }
  const data: unknown = await response.json();
  return isNumberList(data) ? data : [];
}
// endregion

export {
  demoTrust,
  demoUnknown,
  demoAnyHole,
  demoGuard,
  demoCatch,
  demoFetch,
  demoList,
  demoLyingGuard,
  guardChecks,
  readName,
  parseTicket,
  loadScores,
};
