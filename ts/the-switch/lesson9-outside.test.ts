import { afterEach, describe, expect, it, vi } from "vitest";
import {
  demoAnyHole,
  demoCatch,
  demoFetch,
  demoGuard,
  demoList,
  demoLyingGuard,
  demoTrust,
  demoUnknown,
  guardChecks,
  loadScores,
  parseTicket,
  readName,
} from "./lesson9-outside";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

/** The arguments of every console.log a demo made, one entry per call. */
function logged(run: () => unknown): unknown[] {
  const log = vi.spyOn(console, "log").mockImplementation(() => {});
  run();
  return log.mock.calls.map((args) => (args.length === 1 ? args[0] : args));
}

/** A stand-in for fetch that answers with this body, or with a failure status. */
function stubFetch(body: unknown, ok = true) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ ok, json: async () => body })),
  );
}

describe("lesson 9: the demos", () => {
  it("JSON.parse trusts the data: the type says number, the text says otherwise", () => {
    expect(logged(demoTrust)).toEqual(["71"]);
  });

  it("unknown has to be checked before it is used", () => {
    expect(logged(demoUnknown)).toEqual(["CHAI", "21.0", "something else"]);
  });

  it("any lets a nonsense call compile, and it crashes when run", () => {
    expect(() => demoAnyHole()).toThrow(TypeError);
  });

  it("a type guard lets only well-formed data through", () => {
    expect(logged(demoGuard)).toEqual([{ id: 7, item: "chai" }, undefined]);
  });

  it("a catch variable is unknown, and is narrowed before it is used", () => {
    expect(logged(demoCatch)).toEqual([{ id: 7, item: "chai" }, "That was not valid JSON"]);
  });

  it("checked fetch gives the order, or undefined for odd data", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    stubFetch({ id: 7, item: "chai" });
    await demoFetch();
    stubFetch({ id: "7" });
    await demoFetch();
    expect(log.mock.calls).toEqual([[{ id: 7, item: "chai" }], [undefined]]);
  });

  it("a guard for a list checks every item", () => {
    expect(logged(demoList)).toEqual([true, false, false]);
  });

  it("a guard that lies is believed by the checker, and fails at runtime", () => {
    expect(() => demoLyingGuard()).toThrow(TypeError);
  });

  it("a guard narrows to the type it names", () => {
    expect(guardChecks()).toEqual([true, true, true]);
  });
});

describe("lesson 9: the practice solutions", () => {
  it("readName only reads a name that is text", () => {
    expect(readName({ name: "asha" })).toBe("ASHA");
    expect(readName(null)).toBeUndefined();
    expect(readName({ name: 42 })).toBeUndefined();
    expect(readName("asha")).toBeUndefined();
  });

  it("parseTicket accepts a real ticket and refuses a wrong one", () => {
    expect(parseTicket('{"coach": "B2", "seat": 14}')).toEqual({ coach: "B2", seat: 14 });
    expect(parseTicket('{"coach": "B2", "seat": "14"}')).toBeUndefined();
    expect(parseTicket("null")).toBeUndefined();
  });

  it("loadScores returns a list of numbers, and an empty list for anything else", async () => {
    stubFetch([90, 85]);
    expect(await loadScores("https://example.com/scores")).toEqual([90, 85]);
    stubFetch([90, "85"]);
    expect(await loadScores("https://example.com/scores")).toEqual([]);
    stubFetch({ scores: [1] });
    expect(await loadScores("https://example.com/scores")).toEqual([]);
    stubFetch([1], false);
    expect(await loadScores("https://example.com/scores")).toEqual([]);
  });
});
