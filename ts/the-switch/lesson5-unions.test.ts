import { afterEach, describe, expect, it, vi } from "vitest";
import {
  bill,
  demoExhaustive,
  demoInOperator,
  demoLiterals,
  demoServe,
  demoTicket,
  demoToList,
  demoWidening,
  narrowingChecks,
  receipt,
  withGst,
} from "./lesson5-unions";

afterEach(() => vi.restoreAllMocks());

/** What a demo printed, one entry per console.log. */
function printed(run: () => unknown): string[] {
  const log = vi.spyOn(console, "log").mockImplementation(() => {});
  run();
  return log.mock.calls.map((call) => call.join(" "));
}

describe("lesson 5: the demos", () => {
  it("a ticket id may be text or a number, and each gets its own treatment", () => {
    expect(printed(demoTicket)).toEqual(["Ticket B2", "Ticket no. 14"]);
  });

  it("toList accepts a comma list or a list", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    demoToList();
    expect(log.mock.calls).toEqual([[["chai", "coffee"]], [["lassi"]]]);
  });

  it("a literal union only takes the listed words", () => {
    expect(printed(demoLiterals)).toEqual(["Two shots", "One shot"]);
  });

  it("serve reads the kind and answers for each", () => {
    expect(printed(demoServe)).toEqual(["Chai with 2 sugars", "strong coffee"]);
  });

  it("the in operator tells a batter from a bowler", () => {
    expect(printed(demoInOperator)).toEqual(["Kohli scored 82", "Bumrah took 3 wickets"]);
  });

  it("the exhaustive serve handles the new kind", () => {
    expect(printed(demoExhaustive)).toEqual(["Mango lassi"]);
  });

  it("a const keeps its exact word, so it can be passed on", () => {
    expect(printed(demoWidening)).toEqual(["Two shots"]);
  });

  it("narrowing leaves exactly the type the lesson says", () => {
    expect(narrowingChecks()).toEqual([true, true, true, true, true, true]);
  });
});

describe("lesson 5: the practice solutions", () => {
  it("withGst adds 18 percent to a number or to text that holds one", () => {
    expect(withGst(100)).toBe(118);
    expect(withGst("100")).toBe(118);
  });

  it("bill prices each kind of order", () => {
    expect(bill({ kind: "chai", sugar: 2 })).toBe(10);
    expect(bill({ kind: "coffee", strength: "strong" })).toBe(30);
    expect(bill({ kind: "coffee", strength: "mild" })).toBe(20);
  });

  it("receipt covers every payment method", () => {
    expect(receipt({ method: "upi", id: "asha@upi" })).toBe("Paid by UPI to asha@upi");
    expect(receipt({ method: "card", last4: "4242" })).toBe("Paid by card ending 4242");
    expect(receipt({ method: "cash" })).toBe("Paid in cash");
  });

  it("receipt fails loudly for a method it was never told about", () => {
    const stray = { method: "wallet" } as unknown as Parameters<typeof receipt>[0];
    expect(() => receipt(stray)).toThrow("Unhandled payment");
  });
});
