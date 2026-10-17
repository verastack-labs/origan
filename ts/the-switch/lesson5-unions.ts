// Lesson 5: Unions and narrowing. The page text is
// src/content/learn/js-to-ts/unions-and-narrowing.mdx.
//
// The TypeScript side. Snippets that are meant to fail are in errors/.

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

function demoTicket() {
  // region: ticket-narrowed
  function ticketLabel(id: string | number): string {
    if (typeof id === "string") {
      return "Ticket " + id.toUpperCase();
    }
    return "Ticket no. " + id;
  }

  console.log(ticketLabel("b2"));
  console.log(ticketLabel(14));
  // endregion
}

function demoToList() {
  // region: to-list
  function toList(input: string | string[]): string[] {
    if (typeof input === "string") {
      return input.split(",");
    }
    return input;
  }

  console.log(toList("chai,coffee"));
  console.log(toList(["lassi"]));
  // endregion
}

function demoLiterals() {
  // region: literals
  type Strength = "mild" | "strong";

  function brew(strength: Strength): string {
    return strength === "strong" ? "Two shots" : "One shot";
  }

  console.log(brew("strong"));
  console.log(brew("mild"));
  // endregion
}

function demoServe() {
  // region: serve
  type ChaiOrder = { kind: "chai"; sugar: number };
  type CoffeeOrder = { kind: "coffee"; strength: "mild" | "strong" };
  type Order = ChaiOrder | CoffeeOrder;

  function serve(order: Order): string {
    switch (order.kind) {
      case "chai":
        return "Chai with " + order.sugar + " sugars";
      case "coffee":
        return order.strength + " coffee";
    }
  }

  console.log(serve({ kind: "chai", sugar: 2 }));
  console.log(serve({ kind: "coffee", strength: "strong" }));
  // endregion
}

function demoInOperator() {
  // region: in-operator
  type Batter = { name: string; runs: number };
  type Bowler = { name: string; wickets: number };

  function summary(player: Batter | Bowler): string {
    if ("runs" in player) {
      return player.name + " scored " + player.runs;
    }
    return player.name + " took " + player.wickets + " wickets";
  }

  console.log(summary({ name: "Kohli", runs: 82 }));
  console.log(summary({ name: "Bumrah", wickets: 3 }));
  // endregion
}

function demoExhaustive() {
  // region: exhaustive
  type ChaiOrder = { kind: "chai"; sugar: number };
  type CoffeeOrder = { kind: "coffee"; strength: "mild" | "strong" };
  type LassiOrder = { kind: "lassi"; flavour: string };
  type Order = ChaiOrder | CoffeeOrder | LassiOrder;

  function assertNever(value: never): never {
    throw new Error("Unserved order: " + JSON.stringify(value));
  }

  function serve(order: Order): string {
    switch (order.kind) {
      case "chai":
        return "Chai with " + order.sugar + " sugars";
      case "coffee":
        return order.strength + " coffee";
      case "lassi":
        return order.flavour + " lassi";
      default:
        return assertNever(order);
    }
  }

  console.log(serve({ kind: "lassi", flavour: "Mango" }));
  // endregion
}

function demoWidening() {
  // region: widening-fixed
  type Strength = "mild" | "strong";

  function brew(strength: Strength): string {
    return strength === "strong" ? "Two shots" : "One shot";
  }

  const strength = "strong";
  console.log(brew(strength));
  // endregion
}

// Checks of what narrowing leaves behind, run by the compiler rather than at runtime.
function narrowingChecks() {
  function byTypeof(id: string | number) {
    if (typeof id === "string") {
      const inString: Equal<typeof id, string> = true;
      return inString;
    }
    const inNumber: Equal<typeof id, number> = true;
    return inNumber;
  }

  type A = { kind: "a"; x: number };
  type B = { kind: "b"; y: string };
  function byKind(v: A | B) {
    if (v.kind === "a") {
      const isA: Equal<typeof v, A> = true;
      return isA;
    }
    const isB: Equal<typeof v, B> = true;
    return isB;
  }

  function byIn(v: { runs: number } | { wickets: number }) {
    if ("runs" in v) {
      const hasRuns: Equal<typeof v, { runs: number }> = true;
      return hasRuns;
    }
    const hasWickets: Equal<typeof v, { wickets: number }> = true;
    return hasWickets;
  }

  const strengthAfterConst = "strong";
  const later: Equal<typeof strengthAfterConst, "strong"> = true;
  return [byTypeof("a"), byTypeof(1), byKind({ kind: "a", x: 1 }), byKind({ kind: "b", y: "" }), byIn({ runs: 1 }), later];
}

// region: with-gst
function withGst(amount: number | string): number {
  const rupees = typeof amount === "string" ? Number(amount) : amount;
  return rupees + rupees * 0.18;
}

withGst(100); // 118
withGst("100"); // 118
// endregion

// region: bill
type ChaiOrder = { kind: "chai"; sugar: number };
type CoffeeOrder = { kind: "coffee"; strength: "mild" | "strong" };
type Order = ChaiOrder | CoffeeOrder;

function bill(order: Order): number {
  if (order.kind === "chai") {
    return 10;
  }
  return order.strength === "strong" ? 30 : 20;
}

bill({ kind: "chai", sugar: 2 }); // 10
bill({ kind: "coffee", strength: "strong" }); // 30
// endregion

// region: receipt
type Payment =
  | { method: "upi"; id: string }
  | { method: "card"; last4: string }
  | { method: "cash" };

function assertNever(value: never): never {
  throw new Error("Unhandled payment: " + JSON.stringify(value));
}

function receipt(payment: Payment): string {
  switch (payment.method) {
    case "upi":
      return "Paid by UPI to " + payment.id;
    case "card":
      return "Paid by card ending " + payment.last4;
    case "cash":
      return "Paid in cash";
    default:
      return assertNever(payment);
  }
}

receipt({ method: "upi", id: "asha@upi" }); // "Paid by UPI to asha@upi"
// endregion

export {
  demoTicket,
  demoToList,
  demoLiterals,
  demoServe,
  demoInOperator,
  demoExhaustive,
  demoWidening,
  narrowingChecks,
  withGst,
  bill,
  receipt,
};
