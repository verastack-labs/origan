import { describe, expect, it } from "vitest";
import { isContact } from "./contact";

describe("isContact", () => {
  it("accepts an email", () => {
    expect(isContact("asha@college.ac.in")).toBe(true);
  });

  it("accepts a phone number however it is written", () => {
    expect(isContact("9380654730")).toBe(true);
    expect(isContact("+91 93806 54730")).toBe(true);
    expect(isContact("093806-54730")).toBe(true);
  });

  it("rejects text with neither", () => {
    expect(isContact("Asha")).toBe(false);
    expect(isContact("12345")).toBe(false);
    expect(isContact("")).toBe(false);
  });
});
