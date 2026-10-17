import { afterEach, describe, expect, it, vi } from "vitest";
import {
  defaults,
  demoExtends,
  demoMerging,
  demoShape,
  demoTypeVsInterface,
  describeUser,
  displayName,
  emailOf,
  fullName,
  withPort,
} from "./lesson3-objects";

afterEach(() => vi.restoreAllMocks());

describe("lesson 3: the demos", () => {
  it("describeUser reads a name and an age", () => {
    expect(describeUser({ name: "Asha", age: 21 })).toBe("Asha is 21");
  });

  it("a variable with extra properties is still a User", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    demoShape();
    expect(log).toHaveBeenCalledWith("Momo is 3");
  });

  it("a type and an interface with the same shape are interchangeable", () => {
    expect(demoTypeVsInterface()).toEqual({ x: 1, y: 2 });
  });

  it("extends and & both add fields", () => {
    expect(demoExtends()).toEqual([
      { name: "Momo", breed: "Indie" },
      { name: "Mishti", indoor: true },
    ]);
  });

  it("two interfaces with one name merge", () => {
    expect(demoMerging()).toEqual({ theme: "dark", fontSize: 16 });
  });

  it("an optional email has to be checked before it is used", () => {
    expect(emailOf({ name: "Asha" })).toBe("no email on file");
    expect(emailOf({ name: "Asha", email: "ASHA@Example.com" })).toBe("asha@example.com");
  });
});

describe("lesson 3: the practice solutions", () => {
  it("fullName joins first and last", () => {
    expect(fullName({ first: "Asha", last: "Rao" })).toBe("Asha Rao");
  });

  it("displayName prefers the nickname when there is one", () => {
    expect(displayName({ first: "Asha", nickname: "Ash" })).toBe("Ash");
    expect(displayName({ first: "Ravi" })).toBe("Ravi");
  });

  it("an empty nickname is still a nickname", () => {
    expect(displayName({ first: "Ravi", nickname: "" })).toBe("");
  });

  it("withPort returns a new object and leaves the original alone", () => {
    const next = withPort(defaults, 9090);
    expect(next).toEqual({ host: "localhost", port: 9090 });
    expect(next).not.toBe(defaults);
    expect(defaults.port).toBe(8080);
  });
});
